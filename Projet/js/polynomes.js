document.getElementById('btn-poly').addEventListener('click', () => {
  const a = parseFloat(document.getElementById('poly-a').value) || 0;
  const b = parseFloat(document.getElementById('poly-b').value) || 0;
  const c = parseFloat(document.getElementById('poly-c').value) || 0;

  const x = [], y = [];
  for (let i = -10; i <= 10; i += 0.1) {
    x.push(i);
    y.push(a * i * i + b * i + c);
  }

  const ctx = document.getElementById('poly-chart').getContext('2d');

  // Empêche les superpositions
  if (window.polyChart) {
    window.polyChart.destroy();
  }

  window.polyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: x,
      datasets: [{
        label: `y = ${a}x² + ${b}x + ${c}`,
        data: y,
        borderColor: 'blue',
        borderWidth: 2,
        fill: false,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'x' } },
        y: { title: { display: true, text: 'y' } }
      }
    }
  });
});
