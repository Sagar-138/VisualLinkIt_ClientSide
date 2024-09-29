// Handle the login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const password = document.getElementById('password').value;
    
    fetch('http://localhost:3001/api/login', {
    // fetch('https://api.visualchatlinktitbot.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('adminToken', data.token);
            document.getElementById('loginFormContainer').style.display = 'none';
            document.getElementById('adminActions').style.display = 'block';
            // Clear the password field
            document.getElementById('password').value = '';
        } else {
            alert('Login failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    });
});

// Show/Hide Password functionality
document.getElementById('showPassword').addEventListener('change', function() {
    const passwordField = document.getElementById('password');
    if (this.checked) {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
});

// Logout functionality
document.getElementById('logout').addEventListener('click', function() {
    localStorage.removeItem('adminToken');
    document.getElementById('adminActions').style.display = 'none';
    document.getElementById('loginFormContainer').style.display = 'block';
    // Clear the password field after logout
    document.getElementById('password').value = '';
});

// Check if the user is already logged in on page load
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        document.getElementById('loginFormContainer').style.display = 'none';
        document.getElementById('adminActions').style.display = 'block';
    }
});

// Show the add question form
document.getElementById('addQuestion').addEventListener('click', function() {
    document.getElementById('addQuestionForm').style.display = 'block';
    document.getElementById('uploadForm').style.display = 'none';
    document.getElementById('questionsContainer').style.display = 'none';
});

// Handle the submission of the add question form
document.getElementById('questionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const token = localStorage.getItem('adminToken');
    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer').value;

    fetch('http://localhost:3001/api/questions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question, answer })
    })
    .then(response => response.ok ? response.json() : Promise.reject('Failed to add question'))
    .then(() => {
        alert('Question added successfully!');
        document.getElementById('questionForm').reset();
        document.getElementById('addQuestionForm').style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    });
});

// Show the upload form when "Upload Questions" button is clicked
document.getElementById('uploadQuestions').addEventListener('click', function() {
    document.getElementById('addQuestionForm').style.display = 'none';
    document.getElementById('uploadForm').style.display = 'block';
    document.getElementById('questionsContainer').style.display = 'none';
});

// Handle the JSON file upload form submission
document.getElementById('uploadQuestionsForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const token = localStorage.getItem('adminToken');
    const fileInput = document.getElementById('file');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    fetch('http://localhost:3001/api/questions/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    })
    .then(response => response.ok ? response.json() : Promise.reject('Failed to upload questions'))
    .then(() => {
        alert('Questions uploaded successfully!');
        document.getElementById('uploadQuestionsForm').reset();
        document.getElementById('uploadForm').style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    });
});

// Handle the "Get All Questions" button click
document.getElementById('getAllQuestions').addEventListener('click', function() {
    const token = localStorage.getItem('adminToken');

    fetch('http://localhost:3001/api/questions', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const questionsContainer = document.getElementById('questionsContainer');
        questionsContainer.innerHTML = '';
        data.forEach(question => {
            const questionElement = document.createElement('div');
            questionElement.className = 'question-item';
            questionElement.innerHTML = `
                <h3>Question: ${question.question}</h3>
                <p><strong>Answer:</strong> ${question.answer}</p>
                <p><em>ID:</em> ${question.id}</p>
            `;
            questionsContainer.appendChild(questionElement);
        });
        document.getElementById('addQuestionForm').style.display = 'none';
        document.getElementById('uploadForm').style.display = 'none';
        questionsContainer.style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while fetching the questions. Please try again later.');
    });
});
