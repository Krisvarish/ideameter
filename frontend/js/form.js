// frontend/js/form.js

const API_URL = 'http://localhost:8000';

document.getElementById('evaluateForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const formData = {
        startup_name: document.getElementById('startupName').value.trim(),
        description: document.getElementById('description').value.trim(),
        industry: document.getElementById('industry').value,
        stage: parseInt(document.querySelector('input[name="stage"]:checked').value),
        team_experience: parseInt(document.getElementById('teamExperience').value),
        funding_ask: parseInt(document.getElementById('fundingAsk').value)
    };

    // Hide form, show loading
    document.getElementById('evaluateForm').style.display = 'none';
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('errorState').style.display = 'none';

    try {
        // Call API
        const response = await fetch(`${API_URL}/api/evaluate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Evaluation failed');
        }

        const result = await response.json();

        // Store result in sessionStorage
        sessionStorage.setItem('evaluationResult', JSON.stringify(result));

        // Redirect to results page
        window.location.href = 'results.html';

    } catch (error) {
        console.error('Error:', error);
        
        // Show error state
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('errorState').style.display = 'block';
        document.querySelector('.error-message').textContent = 
            error.message || 'Something went wrong. Please try again.';
    }
});

// Character counter for description
document.getElementById('description').addEventListener('input', (e) => {
    const length = e.target.value.length;
    const helpText = e.target.nextElementSibling;
    helpText.textContent = `${length}/200 characters`;
    
    if (length < 20) {
        helpText.style.color = 'var(--danger)';
    } else {
        helpText.style.color = 'var(--gray-700)';
    }
});