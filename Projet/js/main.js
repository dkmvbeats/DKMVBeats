// -----------------------------------------------------
// ONGLET DYNAMIQUE
// -----------------------------------------------------
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');

    window.location.hash = btn.dataset.tab;
  });
});

// Ouvrir onglet selon URL
window.addEventListener('load', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const btn = document.querySelector(`.tab-btn[data-tab="${hash}"]`);
    if (btn) btn.click();
  } else {
    document.querySelector('.tab-btn[data-tab="connexion"]').click();
  }
});

// -----------------------------------------------------
// CONNEXION
// -----------------------------------------------------
document.getElementById('btn-login').addEventListener('click', () => {
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;
    const role = document.getElementById('login-role').value;

    const accounts = {
        admin: { user: "admin", pass: "admin" },
        prof: { user: "prof", pass: "prof" }
    };

    if (user !== accounts[role].user || pass !== accounts[role].pass) {
        document.getElementById('login-status').textContent = "Identifiants incorrects.";
        return;
    }

    document.body.dataset.role = role;
    document.body.classList.add("connected");
    document.getElementById('login-status').textContent = `Connecté en tant que ${role}`;

    document.querySelector('.tab-btn[data-tab="maths"]').click();
});

// -----------------------------------------------------
// AFFICHAGE DES DONNÉES
// -----------------------------------------------------
document.getElementById('btn-afficher').addEventListener('click', () => {
  const type = document.getElementById('affichage-type').value;
  const result = document.getElementById('affichage-result');
  result.innerHTML = "";

  const items = type === "maths"
    ? ["Polynôme", "Matrices", "Équation différentielle"]
    : ["Signal", "Filtre", "Optique"];

  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    result.appendChild(li);
  });
});

// -----------------------------------------------------
// MATHS : POLYNÔME
// -----------------------------------------------------
document.getElementById('btn-calc-poly').addEventListener('click', () => {
  const a = parseFloat(document.getElementById('a').value);
  const b = parseFloat(document.getElementById('b').value);
  const c = parseFloat(document.getElementById('c').value);

  const delta = b*b - 4*a*c;
  let result = `Δ = ${delta}`;

  if (delta > 0) {
    const x1 = (-b - Math.sqrt(delta)) / (2*a);
    const x2 = (-b + Math.sqrt(delta)) / (2*a);
    result += `<br>Deux racines : x₁ = ${x1.toFixed(2)}, x₂ = ${x2.toFixed(2)}`;
  } else if (delta === 0) {
    const x = -b / (2*a);
    result += `<br>Une racine double : x = ${x.toFixed(2)}`;
  } else {
    result += `<br>Aucune racine réelle.`;
  }

  document.getElementById('result-poly').innerHTML = result;
});

// -----------------------------------------------------
// MATHS : POLYNÔME (PYTHON)
// -----------------------------------------------------
document.getElementById("btn-tracer-python").addEventListener("click", async () => {
    const a = parseFloat(document.getElementById("a").value);
    const b = parseFloat(document.getElementById("b").value);
    const c = parseFloat(document.getElementById("c").value);
    const type = c === 0 ? 1 : 2;

    const imgBase64 = await tracerPolynomePython(type, a, b, c, -10, 10);

    const img = document.getElementById("graph-python");
    img.src = "data:image/png;base64," + imgBase64;
    img.style.display = "block";
});

// -----------------------------------------------------
// MATHS : ÉQUATION DIFFÉRENTIELLE (PYTHON)
// -----------------------------------------------------
document.getElementById("btn-tracer-edo").addEventListener("click", async () => {
    const f = document.getElementById("edo-f").value;
    const x0 = parseFloat(document.getElementById("edo-x0").value);
    const y0 = parseFloat(document.getElementById("edo-y0").value);
    const xmin = parseFloat(document.getElementById("edo-xmin").value);
    const xmax = parseFloat(document.getElementById("edo-xmax").value);

    const imgBase64 = await tracerEDO(f, x0, y0, xmin, xmax);

    const img = document.getElementById("graph-edo");
    img.src = "data:image/png;base64," + imgBase64;
    img.style.display = "block";
});

// -----------------------------------------------------
// MATHS : MATRICES (PYTHON)
// -----------------------------------------------------
document.getElementById("btn-mat-calc").addEventListener("click", async () => {
    const op = document.getElementById("mat-op").value;
    const A = JSON.parse(document.getElementById("mat-A").value);
    const B = document.getElementById("mat-B").value ? JSON.parse(document.getElementById("mat-B").value) : null;

    const result = await calculMatrice(op, A, B);

    document.getElementById("mat-result").textContent = JSON.stringify(result, null, 2);
});

// -----------------------------------------------------
// PHYSIQUE : LOI D'OHM
// -----------------------------------------------------
document.getElementById('btn-calc-ohm').addEventListener('click', () => {
  const u = parseFloat(document.getElementById('u').value);
  const r = parseFloat(document.getElementById('r').value);

  if (r === 0) {
    document.getElementById('result-ohm').textContent = "Erreur : résistance nulle.";
    return;
  }

  const i = u / r;
  document.getElementById('result-ohm').textContent = `Intensité I = ${i.toFixed(2)} A`;
});

// -----------------------------------------------------
// PHYSIQUE : FILTRE (CHART.JS)
// -----------------------------------------------------
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
