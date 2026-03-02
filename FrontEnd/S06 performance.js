  // Wait for DOM to load
  window.addEventListener('DOMContentLoaded', () => {
    const labels = [];
    const totalMarks = [];

    // Select all table rows (skip header)
    document.querySelectorAll('table tr').forEach((row, index) => {
      if (index === 0) return;

      const cells = row.querySelectorAll('td');
      if (cells.length >= 6) {
        const testLabel = cells[1].textContent.trim(); // 'Weekly Test 1'
        const physics = parseInt(cells[2].textContent) || 0;
        const chemistry = parseInt(cells[3].textContent) || 0;
        const maths = parseInt(cells[4].textContent) || 0;

        const total = physics + chemistry + maths;

        // Update total and out-of marks in the table
        cells[5].textContent = total;
        cells[6].textContent = 300;

        // Store for chart
        labels.push(testLabel);
        totalMarks.push(total);
      }
    });

    // Plot chart using calculated totals
    const ctx = document.getElementById('performanceChart').getContext('2d');
    const performanceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels, // Test names from table
        datasets: [{
          label: 'Total Marks',
          data: totalMarks, // Auto-calculated totals
          borderColor: '#2980b9',
          backgroundColor: 'rgba(41, 128, 185, 0.2)',
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#2980b9',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Auto-Generated Performance Chart'
          }
        },
        scales: {
          y: {
            suggestedMin: 0,
            suggestedMax: 300,
            title: {
              display: true,
              text: 'Total Marks'
            }
          }
        }
      }
    });
  });