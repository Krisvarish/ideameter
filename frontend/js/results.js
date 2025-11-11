// frontend/js/results.js

// Get result from sessionStorage
const resultData = JSON.parse(sessionStorage.getItem('evaluationResult'));

if (!resultData) {
    // No data, redirect to form
    window.location.href = 'form.html';
} else {
    // Display results
    displayResults(resultData);
}

function displayResults(data) {
    // Startup name
    document.getElementById('startupName').textContent = data.startup_name;

    // Score with animation
    animateScore(data.score);

    // Verdict
    const verdictBadge = document.getElementById('verdictBadge');
    verdictBadge.textContent = data.verdict;
    verdictBadge.className = `verdict-badge ${data.verdict.toLowerCase().replace(' ', '-')}`;

    // Verdict text
    document.getElementById('verdictText').textContent = getVerdictDescription(data.score);

    // Justification
    document.getElementById('justificationText').textContent = data.justification;

    // Strengths
    const strengthsList = document.getElementById('strengthsList');
    strengthsList.innerHTML = '';
    data.strengths.forEach(strength => {
        const li = document.createElement('li');
        li.textContent = strength;
        strengthsList.appendChild(li);
    });

    // Improvements
    const improvementsList = document.getElementById('improvementsList');
    improvementsList.innerHTML = '';
    data.improvements.forEach(improvement => {
        const li = document.createElement('li');
        li.textContent = improvement;
        improvementsList.appendChild(li);
    });

    // Update gauge color and progress based on score
    updateGaugeProgress(data.score);
    
    // Store original data for what-if simulator
    window.originalData = data;
}

function animateScore(targetScore) {
    const scoreElement = document.getElementById('scoreNumber');
    let currentScore = 0;
    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out-cubic)
        const eased = 1 - Math.pow(1 - progress, 3);

        currentScore = Math.round(eased * targetScore);
        scoreElement.textContent = currentScore;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            scoreElement.textContent = Math.round(targetScore);
        }
    }

    update();
}

function updateGaugeProgress(score) {
    const gaugeCircle = document.getElementById('gaugeCircle');
    
    // Calculate percentage for circular progress (0-360 degrees)
    const percentage = score / 100;
    const degrees = percentage * 360;
    
    // Create conic gradient for circular progress
    let gradient;
    if (score >= 80) {
        // Excellent - Teal
        gradient = `conic-gradient(
            #00d9c0 0deg,
            #00d9c0 ${degrees}deg,
            rgba(0, 217, 192, 0.2) ${degrees}deg,
            rgba(0, 217, 192, 0.2) 360deg
        )`;
    } else if (score >= 65) {
        // Good - Orange
        gradient = `conic-gradient(
            #ff7849 0deg,
            #ff7849 ${degrees}deg,
            rgba(255, 120, 73, 0.2) ${degrees}deg,
            rgba(255, 120, 73, 0.2) 360deg
        )`;
    } else if (score >= 50) {
        // Fair - Amber
        gradient = `conic-gradient(
            #ffc107 0deg,
            #ffc107 ${degrees}deg,
            rgba(255, 193, 7, 0.2) ${degrees}deg,
            rgba(255, 193, 7, 0.2) 360deg
        )`;
    } else {
        // Poor - Red
        gradient = `conic-gradient(
            #ff5252 0deg,
            #ff5252 ${degrees}deg,
            rgba(255, 82, 82, 0.2) ${degrees}deg,
            rgba(255, 82, 82, 0.2) 360deg
        )`;
    }
    
    // Apply the gradient with animation
    gaugeCircle.style.background = gradient;
    gaugeCircle.style.transition = 'all 2s cubic-bezier(0.4, 0, 0.2, 1)';
}

function getVerdictDescription(score) {
    if (score >= 80) {
        return 'Your startup shows excellent investment readiness. Strong fundamentals across key areas.';
    } else if (score >= 65) {
        return 'Good foundation with room for optimization. Address key areas to strengthen your position.';
    } else if (score >= 50) {
        return 'Fair potential but needs significant improvements before seeking investment.';
    } else {
        return 'Consider refining your approach and building more traction before pitching to investors.';
    }
}

// ============================================
// WHAT-IF SIMULATOR
// ============================================

function initializeWhatIfSimulator() {
    if (!window.originalData) return;
    
    const originalFormData = JSON.parse(sessionStorage.getItem('originalFormData'));
    if (!originalFormData) return;
    
    // Get slider elements
    const stageSlider = document.getElementById('whatIfStage');
    const fundingSlider = document.getElementById('whatIfFunding');
    const teamSlider = document.getElementById('whatIfTeam');
    
    // Set initial values
    stageSlider.value = originalFormData.stage;
    fundingSlider.value = getFundingIndex(originalFormData.funding_ask);
    teamSlider.value = originalFormData.team_experience;
    
    // Update labels
    updateSliderLabels(originalFormData);
    
    // Add event listeners
    stageSlider.addEventListener('input', () => simulateChanges());
    fundingSlider.addEventListener('input', () => simulateChanges());
    teamSlider.addEventListener('input', () => simulateChanges());
}

function getFundingIndex(amount) {
    const fundingLevels = [0, 50000, 100000, 250000, 500000, 1000000, 2000000, 5000000];
    return fundingLevels.indexOf(amount) || 0;
}

function getFundingAmount(index) {
    const fundingLevels = [0, 50000, 100000, 250000, 500000, 1000000, 2000000, 5000000];
    return fundingLevels[index] || 0;
}

function formatFunding(amount) {
    if (amount === 0) return '$0 (Bootstrapping)';
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000)}K`;
    return `${amount}`;
}

function updateSliderLabels(formData) {
    const stageNames = ['Idea', 'MVP', 'Traction', 'Revenue'];
    const teamNames = ['No exp', '1-2 yrs', '3-5 yrs', '5-10 yrs', '10+ yrs'];
    
    const stage = parseInt(document.getElementById('whatIfStage').value);
    const fundingIndex = parseInt(document.getElementById('whatIfFunding').value);
    const team = parseInt(document.getElementById('whatIfTeam').value);
    
    document.getElementById('stageLabel').textContent = stageNames[stage - 1];
    document.getElementById('fundingLabel').textContent = formatFunding(getFundingAmount(fundingIndex));
    document.getElementById('teamLabel').textContent = teamNames[team - 1];
}

async function simulateChanges() {
    const originalFormData = JSON.parse(sessionStorage.getItem('originalFormData'));
    if (!originalFormData) return;
    
    // Get new values
    const newStage = parseInt(document.getElementById('whatIfStage').value);
    const newFundingIndex = parseInt(document.getElementById('whatIfFunding').value);
    const newTeam = parseInt(document.getElementById('whatIfTeam').value);
    const newFunding = getFundingAmount(newFundingIndex);
    
    // Update labels
    updateSliderLabels({ stage: newStage, funding_ask: newFunding, team_experience: newTeam });
    
    // Create modified form data
    const modifiedData = {
        ...originalFormData,
        stage: newStage,
        funding_ask: newFunding,
        team_experience: newTeam
    };
    
    // Show loading
    document.getElementById('simulatorLoading').style.display = 'block';
    document.getElementById('simulatorResult').style.display = 'none';
    
    try {
        // Call API with modified data
        const response = await fetch('http://localhost:8000/api/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(modifiedData)
        });
        
        if (!response.ok) throw new Error('Simulation failed');
        
        const result = await response.json();
        
        // Calculate delta
        const delta = result.score - window.originalData.score;
        const deltaText = delta >= 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1);
        const deltaClass = delta >= 0 ? 'positive' : 'negative';
        
        // Update simulator display
        document.getElementById('simulatorLoading').style.display = 'none';
        document.getElementById('simulatorResult').style.display = 'block';
        document.getElementById('newScore').textContent = result.score.toFixed(1);
        
        const deltaElement = document.getElementById('scoreDelta');
        deltaElement.textContent = deltaText;
        deltaElement.className = `score-delta ${deltaClass}`;
        
    } catch (error) {
        console.error('Simulation error:', error);
        document.getElementById('simulatorLoading').style.display = 'none';
    }
}

// Initialize simulator when page loads
if (resultData) {
    // Store original form data for simulator
    const originalFormData = {
        startup_name: resultData.startup_name,
        description: sessionStorage.getItem('description') || 'Sample description for simulation',
        industry: sessionStorage.getItem('industry') || 'SaaS',
        stage: parseInt(sessionStorage.getItem('stage')) || 2,
        team_experience: parseInt(sessionStorage.getItem('team_experience')) || 3,
        funding_ask: parseInt(sessionStorage.getItem('funding_ask')) || 250000
    };
    sessionStorage.setItem('originalFormData', JSON.stringify(originalFormData));
    
    // Initialize simulator after a short delay
    setTimeout(() => {
        initializeWhatIfSimulator();
    }, 100);
}