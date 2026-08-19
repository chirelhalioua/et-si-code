# 🚗 ET SI ? — Décide sur la route

**ET SI ?** est une mini-application web éducative autour du **Code de la route**.

Le principe : placer le joueur face à différentes situations de conduite afin de l'aider à **observer, anticiper et prendre la bonne décision** lorsqu'un événement survient sur la route.

## 🎯 Objectif

L'application permet de s'entraîner de manière interactive à différentes situations de conduite.

Pour chaque situation, le joueur doit :

1. Observer la scène.
2. Comprendre le contexte.
3. Faire face à un événement **« ET SI… »**.
4. Choisir une action parmi plusieurs propositions.
5. Découvrir les conséquences de son choix.

L'objectif est de développer les bons réflexes et l'anticipation nécessaires à une conduite sûre.

## 🎮 Fonctionnement

Depuis la page d'accueil, le joueur peut lancer une situation de conduite.

Chaque scénario présente une scène dans laquelle différents événements peuvent apparaître : véhicules, piétons, obstacles, changements de circulation ou autres situations nécessitant une réaction.

Le joueur choisit ensuite la décision qui lui semble la plus adaptée.

Les données liées aux situations et aux actions du joueur peuvent être envoyées vers un **webhook Make**.

Make permet ensuite d'automatiser le traitement de ces informations et leur transmission vers les outils connectés au projet.

## ⚙️ Automatisation avec Make

Le projet intègre **Make** afin d'ajouter une couche d'automatisation au fonctionnement de l'application.

Lorsqu'une situation est jouée, JavaScript peut envoyer les informations correspondantes à un **webhook Make**.

Exemples de données transmises :

```json
{
  "event": "evenement rencontré",
  "weather": "conditions météo",
  "action": "décision du joueur",
  "timestamp": "date et heure"
}
```

Le scénario Make reçoit ensuite les données et peut les traiter automatiquement.

### Flux simplifié

```text
Joueur
   ↓
Application ET SI ?
   ↓
JavaScript
   ↓
Webhook Make
   ↓
Scénario d'automatisation Make
   ↓
Outil / base de données connecté(e)
```

Cette architecture permet de séparer la partie **jeu** de la partie **automatisation et gestion des données**.

## 🛠️ Technologies utilisées

* **HTML5** — structure de l'application
* **CSS3** — interface et création des scènes de conduite
* **JavaScript** — scénarios, interactions et logique du jeu
* **LocalStorage** — sauvegarde locale des préférences
* **Make** — automatisation des flux de données
* **Webhook Make** — communication entre l'application et le scénario d'automatisation

## 📁 Structure du projet

```text
ET-SI/
│
├── index.html
├── landing.css
├── landing.js
│
├── jeu.html
├── style.css
├── script.js
│
└── README.md
```

### Page d'accueil

`index.html`
Page d'entrée de l'application.

`landing.css`
Styles de la page d'accueil.

`landing.js`
Gestion des interactions et des préférences du joueur.

### Jeu

`jeu.html`
Interface principale des situations de conduite.

`style.css`
Styles du jeu et des différentes scènes.

`script.js`
Gestion des scénarios, événements, choix, conséquences et communication avec le webhook Make.

## 🌙 Thème clair / sombre

L'application propose un **mode clair et un mode sombre**.

Le thème choisi est conservé grâce au `localStorage`.

## 👤 Joueur

Le joueur peut choisir son avatar.

Ce choix est également conservé localement afin de personnaliser l'expérience.

## ▶️ Lancer le projet

1. Télécharger ou cloner le projet.
2. Ouvrir le dossier.
3. Lancer `index.html` dans un navigateur.
4. Démarrer une situation depuis la page d'accueil.
5. Effectuer les différents choix proposés.

Pour utiliser l'automatisation, le scénario correspondant doit également être configuré et activé dans **Make**.

## 💡 Concept

> **Observer. Anticiper. Décider.**

ET SI ? transforme des situations du Code de la route en scénarios interactifs afin de rendre l'apprentissage plus concret et dynamique.

Le projet combine ainsi **développement web** et **automatisation No-Code avec Make**.

## 🚧 Évolutions possibles

* ajout de nouvelles situations de conduite ;
* nouveaux événements « ET SI… » ;
* génération de davantage de scénarios ;
* amélioration des illustrations selon la situation ;
* système de score et de progression ;
* statistiques sur les décisions du joueur ;
* enrichissement des automatisations Make ;
* historique des situations et des choix.

---

**ET SI ? — Décide sur la route** 🚘
Projet web interactif combinant **JavaScript et automatisation Make**.
