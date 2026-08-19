# 🚗 ET SI ? — Décide sur la route

**ET SI ?** est une application web interactive d'entraînement au **Code de la route**, basée sur la génération dynamique de situations de conduite.

Le projet combine **JavaScript**, **Make** et l'**IA** afin de proposer au joueur des scénarios variés dans lesquels il doit observer une situation, anticiper un danger et prendre la bonne décision.

## 💡 Le concept

> **Et si cette situation arrivait réellement sur la route, que ferais-tu ?**

Au lieu de proposer uniquement des questions prédéfinies, l'application s'appuie sur une automatisation **Make pour générer les situations de conduite**.

Le fonctionnement repose sur plusieurs étapes :

1. L'application demande une nouvelle situation.
2. La demande est envoyée à **Make via un webhook**.
3. **Make déclenche le processus de génération de la situation.**
4. L'IA génère un scénario de Code de la route avec son contexte, l'événement qui survient et les différentes actions possibles.
5. Make récupère et structure la situation générée.
6. La situation est renvoyée à l'application.
7. JavaScript adapte la scène visuelle au scénario reçu.
8. Le joueur choisit l'action qui lui semble la plus adaptée.
9. L'application lui indique les conséquences de sa décision.

Ainsi, les situations ne sont pas toutes écrites directement dans le code : elles peuvent être **générées dynamiquement grâce au scénario Make et à l'IA**.

## 🤖 Génération des situations avec Make

**Make joue un rôle central dans le projet.**

Il sert d'intermédiaire entre l'application web et l'IA chargée de créer les situations.

Le scénario Make permet notamment de :

* recevoir une demande provenant de l'application ;
* déclencher la génération d'une nouvelle situation ;
* transmettre les informations nécessaires à l'IA ;
* récupérer la situation générée ;
* structurer les données obtenues ;
* renvoyer le scénario à l'application dans un format exploitable par JavaScript.

### Architecture simplifiée

```text
Application ET SI ?
        ↓
     Webhook
        ↓
       Make
        ↓
        IA
        ↓
Génération d'une situation
        ↓
       Make
        ↓
Situation structurée
        ↓
Application JavaScript
        ↓
Génération / adaptation de la scène
        ↓
Choix du joueur
```

## 🎮 Une situation

Une situation générée peut contenir différentes informations permettant à l'application de construire le scénario, par exemple :

```json
{
  "scene": "route urbaine",
  "weather": "pluie",
  "event": "un piéton s'approche du passage piéton",
  "question": "Que fais-tu ?",
  "actions": [
    "Je ralentis",
    "Je continue à la même vitesse",
    "J'accélère"
  ]
}
```

JavaScript utilise ensuite ces informations pour afficher une scène correspondant au scénario et proposer les différents choix au joueur.

## 🎯 Objectif

L'objectif de **ET SI ?** est de proposer un apprentissage plus dynamique du Code de la route.

Plutôt que de mémoriser uniquement des réponses, le joueur est placé dans une logique de :

**Observer → Comprendre → Anticiper → Décider**

La génération des situations permet également de proposer des scénarios plus variés et de limiter la répétition des mêmes exercices.

## 🛠️ Technologies utilisées

* **HTML5** — structure de l'application
* **CSS3** — interface et représentation des scènes
* **JavaScript** — logique du jeu et adaptation dynamique des scènes
* **Make** — orchestration et automatisation de la génération des situations
* **Webhook Make** — communication entre l'application et Make
* **IA** — génération dynamique des scénarios du Code de la route
* **LocalStorage** — sauvegarde de certaines préférences du joueur

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

### `index.html`

Page d'accueil de l'application.

### `landing.css`

Styles de la page d'accueil.

### `landing.js`

Gestion des interactions et des préférences du joueur.

### `jeu.html`

Interface principale dans laquelle les situations sont présentées.

### `style.css`

Gestion de l'apparence du jeu et des différentes scènes de conduite.

### `script.js`

Cœur du fonctionnement côté navigateur :

* communication avec Make ;
* récupération des situations générées ;
* interprétation des données reçues ;
* adaptation de la scène ;
* affichage des événements ;
* gestion des choix du joueur ;
* affichage des conséquences.

## ▶️ Lancer le projet

1. Télécharger ou cloner le projet.
2. Configurer le webhook correspondant au scénario **Make**.
3. Activer le scénario Make.
4. Lancer l'application web.
5. Démarrer une situation.
6. Make et l'IA génèrent le scénario qui sera ensuite interprété par l'application.

> ⚠️ L'URL du webhook Make ne doit pas être publiée directement dans le README si elle permet de déclencher publiquement le scénario.

## 🚧 Évolutions possibles

Le projet pourra notamment évoluer avec :

* davantage de types de routes et de décors ;
* des situations plus complexes ;
* une meilleure correspondance entre la situation générée et la scène visuelle ;
* différents niveaux de difficulté ;
* un système de score ;
* un historique des décisions ;
* des statistiques sur les erreurs du joueur ;
* une personnalisation des situations selon les difficultés de l'utilisateur.

---

**ET SI ? — Décide sur la route** 🚘

Une application qui combine **développement web, automatisation Make et intelligence artificielle** pour générer des situations interactives d'entraînement au Code de la route.
