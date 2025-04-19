// DOM elements
const gradeSelect = document.getElementById('grade-select');
const subjectSelect = document.getElementById('subject-select');
const topicsContainer = document.getElementById('topics-container');
const subjectTitle = document.getElementById('subject-title');
const gradeInfo = document.getElementById('grade-info');
const loadingSpinner = document.getElementById('loading-spinner');

// Store curriculum data
let curriculumData = [];

// Fetch curriculum data when page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        loadingSpinner.classList.remove('d-none');
        const response = await fetch('scripts/curriculumn.json'); // Adjust the path as necessary
        console.log('Response:', response); // Debugging line
        // Check if the response is ok (status code 200-299)
        
        if (!response.ok) {
            throw new Error('Failed to fetch curriculum data');
        }
        const data = await response.json();
        curriculumData = data.curriculum;
        loadingSpinner.classList.add('d-none');
    } catch (error) {
        console.error('Error loading curriculum data:', error);
        loadingSpinner.classList.add('d-none');
        topicsContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">Failed to load curriculum data. Please try again later.</div>
            </div>
        `;
    }
});

// When grade is selected, populate subjects
gradeSelect.addEventListener('change', () => {
    const selectedGrade = gradeSelect.value;
    subjectSelect.disabled = !selectedGrade;
    
    if (!selectedGrade) {
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';
        topicsContainer.innerHTML = '';
        subjectTitle.textContent = 'Study Guide Topics';
        gradeInfo.textContent = 'Select a subject to view topics';
        return;
    }

    // Find the grade in curriculum data
    const gradeData = curriculumData.find(grade => grade.grade == selectedGrade);
    
    if (gradeData && gradeData.subjects) {
        // Populate subject dropdown
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';
        gradeData.subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.name;
            option.textContent = subject.name;
            subjectSelect.appendChild(option);
        });
    }
});

// When subject is selected, display topics
subjectSelect.addEventListener('change', () => {
    const selectedGrade = gradeSelect.value;
    const selectedSubject = subjectSelect.value;
    
    if (!selectedSubject) {
        topicsContainer.innerHTML = '';
        subjectTitle.textContent = 'Study Guide Topics';
        gradeInfo.textContent = 'Select a subject to view topics';
        return;
    }

    // Find the grade and subject in curriculum data
    const gradeData = curriculumData.find(grade => grade.grade == selectedGrade);
    if (gradeData) {
        const subjectData = gradeData.subjects.find(subject => subject.name === selectedSubject);
        if (subjectData) {
            // Update page title and info
            subjectTitle.textContent = subjectData.name;
            gradeInfo.textContent = `Grade ${selectedGrade} - ${subjectData.studyGuide}`;
            
            // Display topics
            renderTopics(subjectData.topics);
        }
    }
});

// Function to render topics as cards
function renderTopics(topics) {
    if (!topics || topics.length === 0) {
        topicsContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">No topics available for this subject.</div>
            </div>
        `;
        return;
    }

    topicsContainer.innerHTML = topics.map(topic => `
        <div class="col-md-4">
            <div class="card topic-card h-100">
                <div class="card-body">
                    <h5 class="card-title">${topic}</h5>
                    <p class="card-text">Detailed study material for ${topic.toLowerCase()}.</p>
                    <a href="#" class="btn btn-sm btn-primary">View Resources</a>
                </div>
            </div>
        </div>
    `).join('');
}