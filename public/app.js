let score = 0;

function fetchQuestion() {
    console.log('Fetching a new question from the server...');
    return fetch('http://localhost:3000/api/question')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.json();
        })
        .then(data => {
            if (!data || !data.question) {
                throw new Error('Invalid question data received from server');
            }
            console.log('Question fetched successfully:', data);
            if (typeof displayQuestion === 'function') {
                displayQuestion(data);
            }
            else {
                console.error('displayQuestion is not defined');
            }

        })
        .catch(error => {
            console.error('Error fetching question:', error);
        });
}

function displayQuestion(data) {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');

    questionElement.textContent = data.question;
    optionsElement.innerHTML = '';

    data.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => checkAnswer(index, data.correctIndex, button);
        optionsElement.appendChild(button);
    });
}

function checkAnswer(selectedIndex, correctIndex, button) {
    const optionsElement = document.getElementById('options');
    const buttons = optionsElement.getElementsByTagName('button');

    // Disable all buttons to prevent multiple selections 
    for (let btn of buttons) {
        btn.disabled = true;
    }

    // Ensure both indices are integers for accurate comparison 
    const selectedIdx = parseInt(selectedIndex, 10);
    const correctIdx = parseInt(correctIndex, 10);

    if (selectedIdx === correctIdx) {
        score++;
        console.log('Correct answer! Score updated:', score);
        button.style.backgroundColor = 'green';
    } else {
        console.log('Incorrect answer. Score remains:', score);
        button.style.backgroundColor = 'red';
    }

    // Highlight the correct answer 
    buttons[correctIdx].style.backgroundColor = 'green';

    document.getElementById('score').textContent = score;

    // Delay before fetching the next question 
    setTimeout(fetchQuestion, 2000);
}

// Fetch the first question on page load 

window.onload = fetchQuestion;




module.exports = { fetchQuestion };