// past_exam_data.js

// Load and parse the JSON
fetch('../scripts/past_exam_papers.json')
  .then(response => response.json())
  .then(data => {
    console.log('Past exam data:', data); // Debugging line
    
    const params = new URLSearchParams(window.location.search);
    const grade = `grade${params.get('grade')}`;
    const subject = params.get('subject');

    if (!data.pastExams[grade] || !data.pastExams[grade].subjects[subject]) {
      document.getElementById('exam-container').innerHTML = '<p class="text-danger">No data found for selected grade and subject.</p>';
      return;
    }

    document.getElementById('exam-title').innerText = `${subject} - Grade ${params.get('grade')} Past Papers`;

    const years = data.pastExams[grade].subjects[subject].years;
    const sortedYears = Object.keys(years).sort((a, b) => b - a);
    const container = document.getElementById('exam-container');

    sortedYears.forEach(year => {
      const yearData = years[year];
      const paperItems = yearData.papers.map((p, i) => {
        const memo = yearData.memos[i];
        return `<li class="list-group-item d-flex justify-content-between align-items-center">
                  ${year} ${p.paper}
                  <span>
                    <a href="${p.url}" target="_blank" class="btn btn-sm btn-outline-primary">Paper</a>
                    <a href="${memo.url}" target="_blank" class="btn btn-sm btn-outline-success">Memo</a>
                  </span>
                </li>`;
      }).join('');

      const yearBlock = `<div class="exam-year mb-4">
                            <h4>${year}</h4>
                            <ul class="list-group">${paperItems}</ul>
                          </div>`;

      container.innerHTML += yearBlock;
    });
  })
  .catch(error => {
    console.error('Error loading exam data:', error);
    document.getElementById('exam-container').innerHTML = '<p class="text-danger">Failed to load exam data.</p>';
  });
