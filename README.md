# IdeaMeter

A clean, professional startup idea evaluator with ML-powered scoring.

## 📁 Folder Structure

```
ideameter/
├── backend/
│   ├── app.py              # FastAPI server
│   ├── model.py            # ML model
│   ├── requirements.txt    # Dependencies
│   └── models/             # Auto-created
│
├── frontend/
│   ├── index.html          # Landing page
│   ├── form.html           # Evaluation form
│   ├── results.html        # Results page
│   ├── css/
│   │   └── style.css       # All styles
│   └── js/
│       ├── form.js         # Form logic
│       └── results.js      # Results logic
│
└── README.md
```

---

## 🚀 Quick Start

### Step 1: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# On Mac/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train the model (first time only)
python model.py

# Start the API server
python app.py
```

**Backend should now be running at:** `http://localhost:8000`

**API Documentation:** `http://localhost:8000/docs`

---

### Step 2: Setup Frontend

```bash
# Navigate to frontend folder
cd frontend

# Option 1: Use Python's built-in server
python -m http.server 3000

# Option 2: Use any other local server
# npx serve .
# php -S localhost:3000
```

**Frontend should now be running at:** `http://localhost:3000`

---

### Step 3: Test It

1. Open `http://localhost:3000` in your browser
2. Click "Evaluate Your Idea"
3. Fill out the form
4. See your results!

---

## 🧪 Example Test Data

Use these values to test quickly:

- **Startup Name:** CloudSync
- **Description:** Real-time collaboration platform for distributed teams
- **Industry:** SaaS
- **Stage:** MVP (2)
- **Team Experience:** 3-5 years
- **Funding Ask:** $250K

---

## 📊 How It Works

### Backend (Python + FastAPI)

1. **model.py** - Trains a Linear Regression model on 1,500 synthetic startup examples
   - Features: Industry, Stage, Team Experience, Funding Ask
   - Target: Investment Readiness Score (0-100)
   - R² Score: ~0.82 (82% accuracy)

2. **app.py** - FastAPI server with endpoints:
   - `POST /api/evaluate` - Evaluates a startup idea
   - Returns: Score, verdict, justification, strengths, improvements

### Frontend (HTML + CSS + JS)

1. **index.html** - Landing page with hero and CTA
2. **form.html** - Clean form to collect startup info
3. **results.html** - Displays score with animated gauge
4. **JavaScript** - Handles API calls and animations

---

## 🎨 Design Features

✅ **Clean & Professional** - Modern UI with subtle colors  
✅ **Responsive** - Works on mobile, tablet, desktop  
✅ **Animated** - Score counter and smooth transitions  
✅ **Print-Friendly** - Results page can be printed as PDF  
✅ **No Dependencies** - Pure HTML/CSS/JS (no frameworks)  

---

## 📝 API Reference

### Evaluate Startup

**Endpoint:** `POST /api/evaluate`

**Request Body:**
```json
{
  "startup_name": "CloudSync",
  "description": "Real-time collaboration platform",
  "industry": "SaaS",
  "stage": 2,
  "team_experience": 3,
  "funding_ask": 250000
}
```

**Response:**
```json
{
  "startup_name": "CloudSync",
  "score": 72.5,
  "verdict": "Good",
  "justification": "Your SaaS startup shows strong fundamentals...",
  "strengths": [
    "Operating in high-growth SaaS sector",
    "Solid team experience",
    "Appropriate funding ask for current stage"
  ],
  "improvements": [
    "Focus on acquiring early customers",
    "Build measurable traction metrics"
  ]
}
```

---

## 🔧 Customization

### Change Colors

Edit `frontend/css/style.css`:

```css
:root {
    --primary: #2563eb;        /* Main blue */
    --primary-dark: #1e40af;   /* Darker blue */
    --success: #10b981;        /* Green */
    --warning: #f59e0b;        /* Orange */
    --danger: #ef4444;         /* Red */
}
```

### Adjust Model

Edit `backend/model.py` to:
- Change training data size (line 55)
- Modify scoring logic (lines 60-90)
- Add/remove features

Then retrain:
```bash
python model.py
```

---

## 🌐 Deployment

### Deploy Backend (Free Options)

**Option 1: Render.com**
1. Push code to GitHub
2. Connect Render to your repo
3. Set build command: `pip install -r requirements.txt && python model.py`
4. Set start command: `python app.py`

**Option 2: Railway.app**
```bash
railway login
railway init
railway up
```

**Option 3: PythonAnywhere**
- Upload files via web interface
- Run model training in console
- Configure WSGI file

### Deploy Frontend (Free Options)

**Option 1: Netlify**
- Drag and drop `frontend` folder
- Done!

**Option 2: Vercel**
```bash
cd frontend
vercel --prod
```

**Option 3: GitHub Pages**
- Push `frontend` folder to GitHub
- Enable Pages in repo settings

### Update API URL

After deploying backend, update `frontend/js/form.js`:

```javascript
const API_URL = 'https://your-backend-url.com';  // Change this
```

---

## 🐛 Troubleshooting

### Backend Issues

**"Model not loaded"**
- Run `python model.py` first to train the model
- Check that `models/` folder was created

**"Port 8000 already in use"**
```bash
# Find and kill process
lsof -ti:8000 | xargs kill -9

# Or use different port
python app.py --port 8001
```

**Import errors**
```bash
pip install -r requirements.txt
```

### Frontend Issues

**CORS errors**
- Make sure backend is running
- Check API_URL in `form.js` matches your backend

**Results not showing**
- Check browser console for errors
- Verify backend response in Network tab
- Try clearing sessionStorage: `sessionStorage.clear()`

---

## 📈 Next Steps

Want to enhance this? Add:

1. **Database** - Store evaluations (PostgreSQL/SQLite)
2. **User Accounts** - Save multiple evaluations
3. **PDF Export** - Generate downloadable reports
4. **More Features** - Revenue model, market size, etc.
5. **Better Model** - Use more training data or advanced algorithms
6. **Analytics** - Track usage with Google Analytics

---

## 🤝 Contributing

Found a bug or have a feature request? Open an issue!

---

## 📄 License

MIT License - feel free to use this for your projects!

---

## ✨ Credits

Built with:
- FastAPI (Python web framework)
- scikit-learn (Machine learning)
- Pure HTML/CSS/JavaScript (No frameworks!)

---

**🎉 You're all set! Enjoy using IdeaMeter!**
