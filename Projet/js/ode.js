document.getElementById('btn-ode').addEventListener('click', () => {
  const y0 = parseFloat(document.getElementById('ode-y0').value) || 1;
  const k = parseFloat(document.getElementById('ode-k').value) || 1;

  const x = [], y = [];
  let h = 0.1, yVal = y0;

  for (let t = 0; t <= 10; t += h) {
    x.push(t);
    y.push(yVal);
    yVal += h * (-k * yVal); // dy/dt = -k*y
  }

  new Chart(document.getElementById('ode-chart'), {
    type: 'line',
    data: {
      labels: x,
      datasets: [{
        label: 'y(t)',
        data: y,
        borderColor: 'green',
        fill: false
      }]
    }
  });
});
