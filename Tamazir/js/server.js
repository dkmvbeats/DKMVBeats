const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'PWD#', // remplace par ton mot de passe root
    database: 'bijoux_berberes'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connecté à MySQL !');
});

// Récupérer tous les produits
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

const PORT = 3000;

app.post('/add-product', (req, res) => {
    const { nom, prix, description, image, categorie, stock } = req.body;

    const sql = `
        INSERT INTO products (nom, prix, description, image, categorie, stock)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [nom, prix, description, image, categorie, stock], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erreur serveur");
        }
        res.send("Produit ajouté");
    });
});

app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
