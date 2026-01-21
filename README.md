# Fournier Designer — Site One-Page Premium

Site vitrine **one-page premium**, moderne et performant pour **Fournier Designer**  
Designer web freelance spécialisé dans les micro-entreprises.

👉 Stack volontairement simple : **HTML / CSS / JavaScript (vanilla)**  
👉 Optimisé pour **GitHub Pages**, performance, accessibilité et SEO de base.

---

## 🚀 Aperçu du projet

- Design premium moderne (dark/light mode)
- Animations légères et fluides (scroll reveal, parallax, hover)
- Micro-interactions (magnetic buttons, glow discret)
- Mobile-first & responsive
- SEO de base (meta, OpenGraph, Schema.org)
- Formulaire de contact via **Formspree**
- Déploiement simple sur GitHub Pages

---

## 📁 Arborescence

```
/fournier-designer/
│
├─ index.html
├─ favicon.svg
├─ robots.txt
├─ sitemap.xml
│
├─ /assets/
│   ├─ /css/
│   │   └─ style.css
│   ├─ /js/
│   │   └─ main.js
│   └─ /img/
│       └─ (placeholders, noise.png, og-cover.png)
│
├─ README.md
└─ LICENSE
```

---

## ⚙️ Mise en ligne sur GitHub Pages

1. Créer un dépôt GitHub nommé par exemple :
   ```
   fournier-designer
   ```

2. Uploader **tout le contenu du dossier** dans le dépôt (pas le dossier parent).

3. Aller dans :
   ```
   Settings → Pages
   ```

4. Choisir :
   - **Source** : Branch `main`
   - **Folder** : `/root`

5. Sauvegarder  
   👉 Le site sera accessible à :
   ```
   https://fournier-designer.github.io/
   ```

---

## ✏️ Modifier le contenu

### Textes
- Tout se modifie dans `index.html`
- Chaque section est clairement commentée

### Couleurs / thème
Dans `assets/css/style.css` → section `:root`

```css
--accent: 220 90% 58%;   /* Bleu principal */
--accent-2: 355 85% 58%; /* Rouge */
```

### Activer Formspree
Dans `index.html`, remplace :

```html
action="https://formspree.io/f/XXXXXXXX"
```

par ton vrai endpoint Formspree :
```
https://formspree.io/f/abcde123
```

---

## ♿ Accessibilité & performance

- Focus visible clavier
- Contrastes respectés
- `prefers-reduced-motion` supporté
- Pas de librairies lourdes
- Animations GPU-friendly
- Score Lighthouse élevé attendu

---

## 🔐 Légal

- Mentions légales simples
- Ville affichée : **Gravelines**
- Aucune donnée stockée côté client
- Formulaire géré par Formspree

---

## 📄 Licence

Projet sous licence **MIT**  
Libre d’utilisation, modification et déploiement.

---

## ✨ Auteur

**Fournier Designer**  
Designer web freelance  
📧 fournier-designer@outlook.fr  
📍 Gravelines – France
