document.getElementById('btn-filtre').addEventListener('click', () => {
  const fc = parseFloat(document.getElementById('fc').value) || 1;
  const type = document.getElementById('filtre-type').value;

  const f = [], H = [];
  for (let i = 0.1; i <= 10; i += 0.1) {
    f.push(i);
    if (type === 'lowpass') {
      H.push(1 / Math.sqrt(1 + Math.pow(i / fc, 2)));
    } else {
      H.push((i / fc) / Math.sqrt(1 + Math.pow(i / fc, 2)));
    }
  }

  new Chart(document.getElementById('filtre-chart'), {
    type: 'line',
    data: {
      labels: f,
      datasets: [{
        label: `Filtre ${type}`,
        data: H,
        borderColor: 'purple',
        fill: false
      }]
    }
  });
});
