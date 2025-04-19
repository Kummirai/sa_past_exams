function checkAnswer(questionId, correctAnswer) {
    const inputElement = document.getElementById(questionId);
    const feedbackElement = document.getElementById(`${questionId}-feedback`);
    
    let userAnswer;
    
    if (inputElement.type === 'radio') {
        const selectedRadio = document.querySelector(`input[name="${questionId}"]:checked`);
        userAnswer = selectedRadio ? selectedRadio.value : null;
    } else if (inputElement.type === 'number') {
        userAnswer = parseInt(inputElement.value);
    } else {
        // For text inputs, normalize the answer by removing spaces and making lowercase
        userAnswer = inputElement.value.trim().toLowerCase().replace(/\s+/g, '');
        correctAnswer = correctAnswer.toLowerCase().replace(/\s+/g, '');
    }
    
    if (userAnswer === null || userAnswer === '' || (typeof userAnswer === 'number' && isNaN(userAnswer))) {
        feedbackElement.textContent = 'Please provide an answer.';
        feedbackElement.className = 'feedback incorrect';
        feedbackElement.style.display = 'block';
        return;
    }
    
    if (userAnswer == correctAnswer) {
        feedbackElement.textContent = 'Correct! Well done.';
        feedbackElement.className = 'feedback correct';
    } else {
        feedbackElement.textContent = `Incorrect. The correct answer is: ${correctAnswer}`;
        feedbackElement.className = 'feedback incorrect';
    }
    
    feedbackElement.style.display = 'block';
}

function checkAnswer2(questionId, correctAnswer1, correctAnswer2) {
    const inputElement1 = document.getElementById(`${questionId}-multiples6`);
    const inputElement2 = document.getElementById(`${questionId}-multiples7`);
    const feedbackElement = document.getElementById(`${questionId}-feedback`);
    
    const userAnswer1 = parseInt(inputElement1.value);
    const userAnswer2 = parseInt(inputElement2.value);
    
    if (isNaN(userAnswer1) || isNaN(userAnswer2)) {
        feedbackElement.textContent = 'Please provide answers for both fields.';
        feedbackElement.className = 'feedback incorrect';
        feedbackElement.style.display = 'block';
        return;
    }
    
    if (userAnswer1 === correctAnswer1 && userAnswer2 === correctAnswer2) {
        feedbackElement.textContent = 'Correct! Well done.';
        feedbackElement.className = 'feedback correct';
    } else {
        feedbackElement.textContent = `Incorrect. The correct answers are: ${correctAnswer1} and ${correctAnswer2}`;
        feedbackElement.className = 'feedback incorrect';
    }
    
    feedbackElement.style.display = 'block';
}

// For questions with two separate inputs (like red and yellow beads)
function checkAnswer2(questionId, correctAnswer1, correctAnswer2) {
    const inputElement1 = document.getElementById(`${questionId}-red`);
    const inputElement2 = document.getElementById(`${questionId}-yellow`);
    const feedbackElement = document.getElementById(`${questionId}-feedback`);
    
    const userAnswer1 = parseInt(inputElement1.value);
    const userAnswer2 = parseInt(inputElement2.value);
    
    if (isNaN(userAnswer1) || isNaN(userAnswer2)) {
        feedbackElement.textContent = 'Please provide answers for both fields.';
        feedbackElement.className = 'feedback incorrect';
        feedbackElement.style.display = 'block';
        return;
    }
    
    if (userAnswer1 === correctAnswer1 && userAnswer2 === correctAnswer2) {
        feedbackElement.textContent = 'Correct! Well done.';
        feedbackElement.className = 'feedback correct';
    } else {
        feedbackElement.textContent = `Incorrect. The correct answers are: ${correctAnswer1} and ${correctAnswer2}`;
        feedbackElement.className = 'feedback incorrect';
    }
    
    feedbackElement.style.display = 'block';
}