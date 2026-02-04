// Simulation backend (plus tard remplacé par fetch('/api/produits'))
const produits = [
    {
        id: 1,
        nom: "Collier berbère argent",
        prix: 49.99,
        categorie: "collier",
        image: "images/n1.jpg"
    },
    {
        id: 2,
        nom: "Bague gravée amazighe",
        prix: 29.99,
        categorie: "bague",
        image: "images/n2.jpg"
    },
    {
        id: 3,
        nom: "Bracelet artisanal",
        prix: 39.99,
        categorie: "bracelet",
        image: "images/n3.jpg"
    },
    {
        id: 4,
        nom: "Créoles berbères",
        prix: 34.99,
        categorie: "boucles",
        image: "images/v2.jpg"
    }
];

// Affichage des produits
function afficherProduits(liste) {
    const container = document.getElementById("produits-container");
    container.innerHTML = "";

    liste.forEach(p => {
        container.innerHTML += `
            <div class="produit-carte" onclick="ouvrirProduit(${p.id})">
                <img src="${p.image}" alt="${p.nom}">
                <div class="produit-info">
                    <h3>${p.nom}</h3>
                    <p>${p.prix.toFixed(2)} €</p>
                </div>
            </div>
        `;
    });
}

// Filtres
document.getElementById("filtre-categorie").addEventListener("change", filtrer);
document.getElementById("filtre-tri").addEventListener("change", filtrer);

function filtrer() {
    let cat = document.getElementById("filtre-categorie").value;
    let tri = document.getElementById("filtre-tri").value;

    let resultat = produits;

    if (cat !== "all") {
        resultat = resultat.filter(p => p.categorie === cat);
    }

    if (tri === "price-asc") {
        resultat.sort((a, b) => a.prix - b.prix);
    } else if (tri === "price-desc") {
        resultat.sort((a, b) => b.prix - a.prix);
    }

    afficherProduits(resultat);
}

// Page produit individuelle (plus tard)
function ouvrirProduit(id) {
    window.location.href = `produit.html?id=${id}`;
}

// Initialisation
afficherProduits(produits);
// --- PANIER (localStorage pour l'instant) ---
function getPanier() {
    return JSON.parse(localStorage.getItem("panier")) || [];
}

function savePanier(panier) {
    localStorage.setItem("panier", JSON.stringify(panier));
}

function ajouterAuPanier(idProduit) {
    let panier = getPanier();
    let item = panier.find(p => p.id === idProduit);

    if (item) {
        item.quantite++;
    } else {
        panier.push({ id: idProduit, quantite: 1 });
    }

    savePanier(panier);
    alert("Produit ajouté au panier !");
}

function afficherPanier() {
    const container = document.getElementById("panier-container");
    if (!container) return;

    let panier = getPanier();
    container.innerHTML = "";

    if (panier.length === 0) {
        container.innerHTML = "<p>Votre panier est vide.</p>";
        document.getElementById("panier-total-prix").textContent = "0.00 €";
        return;
    }

    let total = 0;

    panier.forEach(item => {
        let produit = produits.find(p => p.id === item.id);
        let sousTotal = produit.prix * item.quantite;
        total += sousTotal;

        container.innerHTML += `
            <div class="panier-item">
                <img src="${produit.image}" alt="${produit.nom}">
                <div class="panier-info">
                    <h3>${produit.nom}</h3>
                    <p>${produit.prix.toFixed(2)} €</p>
                    <p>Quantité : ${item.quantite}</p>
                </div>
                <div class="panier-actions">
                    <button class="btn-supprimer" onclick="supprimerDuPanier(${item.id})">Supprimer</button>
                </div>
            </div>
        `;
    });

    document.getElementById("panier-total-prix").textContent = total.toFixed(2) + " €";
}

function supprimerDuPanier(idProduit) {
    let panier = getPanier().filter(item => item.id !== idProduit);
    savePanier(panier);
    afficherPanier();
}

function validerCommande() {
    alert("Paiement Simulation (Stripe/PayPal/CB)");
}

// Initialisation panier
document.addEventListener("DOMContentLoaded", afficherPanier);
// --- LOGIN (simulation avant backend) ---
function login(event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const mdp = document.getElementById("login-password").value;

    // Identifiants temporaires (à remplacer par base de données plus tard)
    const adminEmail = "";
    const adminMdp = "";

    if (email === adminEmail && mdp === adminMdp) {
        localStorage.setItem("adminConnecte", "true");
        window.location.href = "admin.html";
    } else {
        alert("Identifiants incorrects.");
    }
}
// --- ADMIN : ajouter un produit ---
function ajouterProduit(event) {
    event.preventDefault();

    const nom = document.getElementById("prod-nom").value;
    const prix = parseFloat(document.getElementById("prod-prix").value);
    const categorie = document.getElementById("prod-categorie").value;
    const image = document.getElementById("prod-image").value;
    const description = document.getElementById("prod-description").value;

    const nouveau = {
        id: Date.now(),
        nom,
        prix,
        categorie,
        image,
        description
    };

    produits.push(nouveau);
    afficherProduitsAdmin();
    alert("Bijou ajouté !");
    document.getElementById("form-ajout").reset();
}

// --- ADMIN : afficher liste ---
function afficherProduitsAdmin() {
    const container = document.getElementById("admin-liste-produits");
    if (!container) return;

    container.innerHTML = "";

    produits.forEach(p => {
        container.innerHTML += `
            <div class="admin-item">
                <img src="${p.image}">
                <div class="admin-info">
                    <h4>${p.nom}</h4>
                    <p>${p.prix.toFixed(2)} € — ${p.categorie}</p>
                </div>
                <div class="admin-actions">
                    <button onclick="supprimerProduit(${p.id})">Supprimer</button>
                </div>
            </div>
        `;
    });
}

function supprimerProduit(id) {
    const index = produits.findIndex(p => p.id === id);
    if (index !== -1) {
        produits.splice(index, 1);
        afficherProduitsAdmin();
    }
}

// --- Déconnexion ---
function logout() {
    localStorage.removeItem("adminConnecte");
    window.location.href = "login.html";
}

// Initialisation admin
document.addEventListener("DOMContentLoaded", afficherProduitsAdmin);
window.addEventListener("scroll", function() {
    const header = document.querySelector("header");

    if (window.scrollY > 80) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});
