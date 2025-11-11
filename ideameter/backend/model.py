# backend/model.py
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_absolute_error
import joblib
import json
from pathlib import Path

def generate_training_data(n=1000):
    """Generate synthetic startup data"""
    np.random.seed(42)
    data = []
    
    industries = ['SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce', 'AI/ML', 'Other']
    
    for _ in range(n):
        industry = np.random.choice(industries)
        stage = np.random.choice([1, 2, 3, 4])  # Idea, MVP, Traction, Revenue
        team_exp = np.random.choice([1, 2, 3, 4, 5])
        
        # Realistic funding based on stage
        if stage == 1:
            funding = np.random.choice([0, 50000, 100000, 250000])
        elif stage == 2:
            funding = np.random.choice([100000, 250000, 500000])
        elif stage == 3:
            funding = np.random.choice([500000, 1000000, 2000000])
        else:
            funding = np.random.choice([1000000, 2000000, 5000000])
        
        # Calculate score (ground truth)
        score = 50
        
        # Industry boost
        if industry in ['SaaS', 'FinTech', 'AI/ML', 'HealthTech']:
            score += np.random.normal(12, 2)
        else:
            score += np.random.normal(5, 2)
        
        # Stage impact (strongest predictor)
        score += stage * np.random.normal(10, 1.5)
        
        # Team experience
        score += team_exp * np.random.normal(5, 1)
        
        # Funding appropriateness
        ideal_funding = {1: 100000, 2: 300000, 3: 1000000, 4: 2000000}
        if abs(funding - ideal_funding[stage]) < ideal_funding[stage] * 0.5:
            score += np.random.normal(8, 2)
        else:
            score -= np.random.normal(10, 2)
        
        # Noise
        score += np.random.normal(0, 5)
        score = np.clip(score, 0, 100)
        
        data.append({
            'industry': industry,
            'stage': stage,
            'team_exp': team_exp,
            'funding': funding,
            'score': round(score, 1)
        })
    
    return pd.DataFrame(data)

def train_model():
    """Train and save the model"""
    print("🤖 Training IdeaMeter Model...")
    
    # Create models directory
    Path('models').mkdir(exist_ok=True)
    
    # Generate data
    df = generate_training_data(1500)
    print(f"✅ Generated {len(df)} training examples")
    
    # Prepare features
    X = pd.get_dummies(df[['industry', 'stage', 'team_exp', 'funding']], columns=['industry'])
    y = df['score']
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train
    model = LinearRegression()
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_scaled)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    
    print(f"✅ Model trained - R²: {r2:.3f}, MAE: {mae:.2f}")
    
    # Save
    joblib.dump(model, 'models/model.pkl')
    joblib.dump(scaler, 'models/scaler.pkl')
    
    metadata = {
        'features': X.columns.tolist(),
        'r2_score': float(r2),
        'mae': float(mae)
    }
    
    with open('models/metadata.json', 'w') as f:
        json.dump(metadata, f)
    
    print("💾 Model saved to models/")
    return model, scaler, metadata

class Predictor:
    """Simple prediction class"""
    
    def __init__(self):
        self.model = joblib.load('models/model.pkl')
        self.scaler = joblib.load('models/scaler.pkl')
        with open('models/metadata.json') as f:
            self.metadata = json.load(f)
        self.features = self.metadata['features']
    
    def predict(self, industry, stage, team_exp, funding):
        """Predict score from inputs"""
        # Create input dataframe
        input_data = pd.DataFrame([{
            'industry': industry,
            'stage': stage,
            'team_exp': team_exp,
            'funding': funding
        }])
        
        # One-hot encode
        input_encoded = pd.get_dummies(input_data, columns=['industry'])
        
        # Ensure all features present
        for feat in self.features:
            if feat not in input_encoded.columns:
                input_encoded[feat] = 0
        
        # Reorder to match training
        input_encoded = input_encoded[self.features]
        
        # Scale and predict
        input_scaled = self.scaler.transform(input_encoded)
        score = self.model.predict(input_scaled)[0]
        
        return np.clip(score, 0, 100)

if __name__ == '__main__':
    train_model()