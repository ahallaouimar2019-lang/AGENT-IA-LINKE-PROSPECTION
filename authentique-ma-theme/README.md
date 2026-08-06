# Authentique MA — Thème Shopify

Thème Shopify **Online Store 2.0** sur mesure pour **Authentique MA** (skincare K-beauty), optimisé conversion **Maroc** : Français + Arabe (RTL), MAD, **Paiement à la livraison (COD)** + checkout Shopify, WhatsApp, badges de confiance.

---

## 🚀 Importer le thème dans Shopify

1. Admin Shopify → **Boutique en ligne → Thèmes**
2. En bas : **Ajouter un thème → Importer depuis un fichier ZIP**
3. Sélectionne `authentique-ma-theme.zip`
4. Une fois importé : **Personnaliser** pour configurer, puis **Publier**

---

## ✅ À configurer après l'import (checklist)

### 1. Logo & favicon
- Éditeur de thème → section **En-tête** → uploader le logo `AUTHENTIQUE MA`
- **Paramètres du thème → Général** → uploader le favicon

### 2. Langues (Français + Arabe)
- Admin → **Paramètres → Langues** → ajouter **العربية (Arabe)**
- Le site bascule automatiquement en **RTL** en arabe. Le sélecteur FR/AR est dans la barre d'annonce.

### 3. Devise
- Admin → **Paramètres → Général** → devise = **MAD (Dirham marocain)**

### 4. Paiement à la livraison (COD) + carte
- Admin → **Paramètres → Paiements**
- Activer **Paiement à la livraison (Cash on Delivery)** → méthode manuelle
- (Optionnel) Activer **CMI** / carte bancaire pour le Maroc
- Le formulaire COD de la page produit ajoute au panier + redirige vers le checkout où la cliente choisit « Paiement à la livraison ». Les infos (Nom, Tél, Ville, Adresse) sont enregistrées dans la note de commande.

### 5. WhatsApp
- **Paramètres du thème → WhatsApp** → mettre le vrai numéro (format `2126XXXXXXXX`)

### 6. Produits
Ajoute tes produits dans **Produits → Ajouter un produit**. Exemple fourni :
- **Authentique Wrinkle Repair Eyecream 20ml (Compatible with Galvanic Rejuvenator)** — **499 MAD**
- Description : *Discover the synergy between a powerful anti-aging eye cream, enriched with plant stem cell cultures extract Hibiskin Vita*
- Uploader les 4 visuels du produit dans la galerie du produit
- Crée des **collections** (ex : « Contour des yeux », « Soins visage », « Nouveautés ») et associe-les dans la page d'accueil.

### 7. Hero Avant/Après (page d'accueil)
- Éditeur → section **Hero Luxe (Avant/Après)** → uploader **Image AVANT** (cernes) et **Image APRÈS** (peau fraîche)

### 8. Menu de navigation
- Admin → **Boutique en ligne → Navigation** → menu `main-menu` (Accueil, Boutique, Livraison & Paiement, Contact…)

### 9. Réseaux sociaux
- **Paramètres du thème → Réseaux sociaux** → liens Instagram / TikTok / Facebook

---

## 🎨 Personnalisation
- **Couleurs** : Paramètres du thème → Couleurs (violet de la marque par défaut)
- **Typographie** : Playfair Display (titres) + Poppins (texte) + Cairo (arabe)
- Toutes les sections de la page d'accueil sont **glisser-déposer** dans l'éditeur.

---

## 📁 Structure
```
config/     → réglages du thème
layout/     → theme.liquid (+ password)
sections/   → hero-luxe, header, footer, produit, panier, etc.
snippets/   → carte produit, prix, WhatsApp, meta SEO
templates/  → pages (index, product, collection, cart, contact…)
locales/    → fr (défaut), ar, en
assets/     → theme.css, global.js
```

Fait avec 💜 pour Authentique MA.
