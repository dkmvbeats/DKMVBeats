// ---------------------------------------------------------
// INITIALISATION PYODIDE
// ---------------------------------------------------------
let pyodide = null;

async function initPyodide() {
    pyodide = await loadPyodide();
    await pyodide.loadPackage("numpy");
    await pyodide.loadPackage("matplotlib");
}

initPyodide();

// ---------------------------------------------------------
// 1) POLYNÔME
// ---------------------------------------------------------
async function tracerPolynomePython(type, a, b, c, x_min, x_max) {

    const pythonCode = `
import numpy as np
import matplotlib.pyplot as plt

plt.clf()
plt.close()

def tracer_premier_degre(a, b, x_min, x_max):
    x = np.linspace(x_min, x_max, 400)
    y = a * x + b
    plt.plot(x, y, label=f"{a}x + {b}")

def tracer_second_degre(a, b, c, x_min, x_max):
    x = np.linspace(x_min, x_max, 400)
    y = a * x**2 + b * x + c
    plt.plot(x, y, label=f"{a}x² + {b}x + {c}")

plt.figure(figsize=(6,4))

if ${type} == 1:
    tracer_premier_degre(${a}, ${b}, ${x_min}, ${x_max})
else:
    tracer_second_degre(${a}, ${b}, ${c}, ${x_min}, ${x_max})

plt.xlabel("x")
plt.ylabel("y")
plt.grid(True)
plt.legend()

import io, base64
buf = io.BytesIO()
plt.savefig(buf, format="png")
buf.seek(0)
base64.b64encode(buf.read()).decode("utf-8")
`;

    return await pyodide.runPythonAsync(pythonCode);
}

// ---------------------------------------------------------
// 2) ÉQUATION DIFFÉRENTIELLE — VERSION PYODIDE (RK4)
// ---------------------------------------------------------
async function tracerEDO(f_str, x0, y0, x_min, x_max) {

    const pythonCode = `
import numpy as np
import matplotlib.pyplot as plt

plt.clf()
plt.close()

def f(x, y):
    return ${f_str}

def rk4(f, x0, y0, x_min, x_max, n=400):
    x = np.linspace(x_min, x_max, n)
    y = np.zeros(n)
    y[0] = y0
    h = (x_max - x_min) / (n - 1)

    for i in range(n - 1):
        k1 = f(x[i], y[i])
        k2 = f(x[i] + h/2, y[i] + h*k1/2)
        k3 = f(x[i] + h/2, y[i] + h*k2/2)
        k4 = f(x[i] + h, y[i] + h*k3)
        y[i+1] = y[i] + (h/6)*(k1 + 2*k2 + 2*k3 + k4)

    return x, y

x, y = rk4(f, ${x0}, ${y0}, ${x_min}, ${x_max})

plt.figure(figsize=(6,4))
plt.plot(x, y, label="Solution EDO")
plt.grid(True)
plt.xlabel("x")
plt.ylabel("y")
plt.legend()

import io, base64
buf = io.BytesIO()
plt.savefig(buf, format="png")
buf.seek(0)
base64.b64encode(buf.read()).decode("utf-8")
`;

    return await pyodide.runPythonAsync(pythonCode);
}

// ---------------------------------------------------------
// 3) CALCUL MATRICIEL — VERSION PYODIDE
// ---------------------------------------------------------
async function calculMatrice(operation, A, B=null) {

    const pythonCode = `
import numpy as np

op = "${operation}"
A = np.array(${JSON.stringify(A)})

if op in ["add", "mul"]:
    B = np.array(${JSON.stringify(B)})

if op == "add":
    result = A + B
elif op == "mul":
    result = A.dot(B)
elif op == "det":
    result = np.linalg.det(A)

result.tolist() if op != "det" else float(result)
`;

    return await pyodide.runPythonAsync(pythonCode);
}
