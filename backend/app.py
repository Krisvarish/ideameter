# backend/app.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
import numpy as np

from model import Predictor

app = FastAPI(title="IdeaMeter API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
try:
    predictor = Predictor()
    print("✅ Model loaded")
except:
    predictor = None
    print("⚠️  Run 'python model.py' first!")

class EvaluateRequest(BaseModel):
    startup_name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=20, max_length=200)
    industry: str
    stage: int = Field(..., ge=1, le=4)
    team_experience: int = Field(..., ge=1, le=5)
    funding_ask: int = Field(..., ge=0, le=10000000)

class EvaluateResponse(BaseModel):
    startup_name: str
    score: float
    verdict: str
    justification: str
    strengths: List[str]
    improvements: List[str]

def get_verdict(score: float) -> str:
    """Get verdict based on score"""
    if score >= 80:
        return "Excellent"
    elif score >= 65:
        return "Good"
    elif score >= 50:
        return "Fair"
    else:
        return "Needs Improvement"

def generate_justification(score: float, industry: str, stage: int, team_exp: int, funding: int) -> str:
    """Generate explanation for score"""
    stage_names = {1: "idea", 2: "MVP", 3: "traction", 4: "revenue"}
    
    if score >= 70:
        return f"Your {industry} startup shows strong fundamentals at the {stage_names[stage]} stage. The combination of your team's experience and appropriate funding strategy positions you well for investment."
    elif score >= 50:
        return f"Your {industry} venture has potential but needs refinement. At the {stage_names[stage]} stage, focus on strengthening your execution plan and clarifying your market approach."
    else:
        return f"Your concept requires significant development before seeking investment. Consider building more traction at the {stage_names[stage]} stage and reassessing your funding needs."

def generate_strengths(industry: str, stage: int, team_exp: int, funding: int) -> List[str]:
    """Identify strengths"""
    strengths = []
    
    if industry in ['SaaS', 'FinTech', 'AI/ML', 'HealthTech']:
        strengths.append(f"Operating in high-growth {industry} sector")
    
    if stage >= 3:
        strengths.append("Demonstrated market traction")
    
    if team_exp >= 4:
        strengths.append("Highly experienced founding team")
    elif team_exp >= 3:
        strengths.append("Solid team experience")
    
    ideal_funding = {1: 100000, 2: 300000, 3: 1000000, 4: 2000000}
    if abs(funding - ideal_funding[stage]) < ideal_funding[stage] * 0.5:
        strengths.append("Appropriate funding ask for current stage")
    
    if not strengths:
        strengths.append("Clear vision for the market")
    
    return strengths[:3]

def generate_improvements(industry: str, stage: int, team_exp: int, funding: int) -> List[str]:
    """Identify areas for improvement"""
    improvements = []
    
    ideal_funding = {1: 100000, 2: 300000, 3: 1000000, 4: 2000000}
    if funding > ideal_funding[stage] * 1.5:
        improvements.append("Consider reducing funding ask to match your current stage")
    
    if stage == 1:
        improvements.append("Build an MVP to validate your concept")
    elif stage == 2:
        improvements.append("Focus on acquiring early customers")
    
    if team_exp <= 2:
        improvements.append("Consider adding experienced advisors or co-founders")
    
    if industry in ['E-commerce', 'Other']:
        improvements.append("Clarify your unique value proposition in a competitive market")
    
    if not improvements:
        improvements.append("Continue executing on your current strategy")
    
    return improvements[:3]

@app.get("/")
def health_check():
    return {
        "status": "running",
        "model_loaded": predictor is not None
    }

@app.post("/api/evaluate", response_model=EvaluateResponse)
def evaluate(request: EvaluateRequest):
    """Evaluate startup idea"""
    if not predictor:
        raise HTTPException(500, "Model not loaded. Train the model first.")
    
    # Validate industry
    valid_industries = ['SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce', 'AI/ML', 'Other']
    if request.industry not in valid_industries:
        raise HTTPException(400, f"Industry must be one of: {valid_industries}")
    
    try:
        # Predict score
        score = predictor.predict(
            request.industry,
            request.stage,
            request.team_experience,
            request.funding_ask
        )
        
        score = round(float(score), 1)
        
        # Generate insights
        verdict = get_verdict(score)
        justification = generate_justification(
            score, request.industry, request.stage, 
            request.team_experience, request.funding_ask
        )
        strengths = generate_strengths(
            request.industry, request.stage,
            request.team_experience, request.funding_ask
        )
        improvements = generate_improvements(
            request.industry, request.stage,
            request.team_experience, request.funding_ask
        )
        
        return EvaluateResponse(
            startup_name=request.startup_name,
            score=score,
            verdict=verdict,
            justification=justification,
            strengths=strengths,
            improvements=improvements
        )
    
    except Exception as e:
        raise HTTPException(500, f"Evaluation failed: {str(e)}")

if __name__ == '__main__':
    import uvicorn
    print("🚀 Starting IdeaMeter API on http://localhost:8000")
    print("📖 API docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)