document.getElementById('btn-signal').addEventListener('click', () => {
  const A = parseFloat(document.getElementById('sig-A').value) || 1;
  const f = parseFloat(document.getElementById('sig-f').value) || 1;
  const C = parseFloat(document.getElementById('sig-C').value) || 0;

  const x = [], y = [];
  for (let t = 0; t <= 2; t += 0.01) {
    x.push(t);
    y.push(A * Math.sin(2 * Math.PI * f * t) + C);
  }

  new Chart(document.getElementById('signal-chart'), {
    type: 'line',
    data: {
      labels: x,
      datasets: [{
        label: 'Signal sinusoïdal',
        data: y,
        borderColor: 'red',
        fill: false
      }]
    }
  });
});
