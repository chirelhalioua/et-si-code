# ET SI ? 🚗

**ET SI ?** est une application web interactive autour du **Code de la route**.

L’objectif est de placer l’utilisateur face à une situation de conduite, puis de modifier un élément de la scène avec un **« ET SI… ? »** afin de l’amener à observer, anticiper et prendre une décision.

---

## 🎯 Objectif du projet

Le projet permet de travailler le raisonnement du conducteur à partir de situations visuelles.

Au lieu de répondre uniquement à des questions théoriques, l’utilisateur doit :

1. Observer une situation de conduite.
2. Découvrir un changement dans la scène avec **« ET SI… ? »**.
3. Choisir la réaction qui lui semble correcte.
4. Recevoir immédiatement une correction et une explication.

L’objectif est de développer les réflexes d’**observation**, d’**anticipation** et de **prise de décision**.

---

## 🚘 Comment fonctionne le projet ?

Chaque situation contient deux images :

- une **situation initiale**
- une situation modifiée correspondant au **« ET SI… ? »**

Par exemple :

> Tu circules derrière un véhicule sur une route à double sens.

Puis :

> **ET SI… un véhicule arrivait maintenant en sens inverse ?**

L’utilisateur doit ensuite choisir parmi plusieurs comportements possibles.

Après validation :

- la bonne réponse est indiquée en vert ;
- une mauvaise réponse est indiquée en rouge ;
- la bonne réponse est également affichée ;
- une explication permet de comprendre la décision à prendre.

---

## 🧩 Déroulement d'une situation

Une situation se déroule actuellement en **3 étapes** :

### 1. Observer

L’utilisateur découvre la situation initiale.

### 2. Anticiper

Un nouvel élément apparaît dans la scène avec le principe :

**« ET SI… ? »**

### 3. Décider

L’utilisateur choisit une réponse et obtient immédiatement la correction.

---

## 🖼️ Gestion des situations

Les situations sont enregistrées dans le fichier :

```text
situations.json

## 🚀 Évolutions prévues

Plusieurs évolutions sont prévues afin de transformer progressivement le projet en une expérience d’entraînement plus complète.

## 🎚️ Niveaux de difficulté

Ajouter un niveau à chaque situation :

Facile
Moyen
Difficile

La difficulté pourrait dépendre notamment :

du nombre d’éléments à observer ;
du temps disponible pour réagir ;
de la complexité de la situation ;
de la proximité entre plusieurs réponses possibles.
🏆 Système de progression et de récompenses

Créer un système permettant au joueur de savoir où il se situe.

Par exemple :

nombre de bonnes réponses ;
taux de réussite ;
séries de bonnes réponses ;
points ;
badges ;
niveaux ;
progression globale.

L’objectif serait de rendre l’apprentissage plus motivant tout en permettant au joueur de suivre son évolution.

## 🔎 Choix des situations

Permettre au joueur de choisir ses entraînements en fonction de différents critères.

Par exemple :

Par catégorie :

Piétons
Dépassement
Intersection
Autoroute
Travaux
Passage à niveau
Véhicules prioritaires
etc.

## Par niveau :

Facile
Moyen
Difficile

Il serait également possible de combiner les deux :

Autoroute + niveau difficile

## 🤖 Intégration de l'intelligence artificielle

Une évolution importante du projet serait l’intégration de l’IA pour générer automatiquement de nouvelles situations de Code de la route.

L’IA pourrait notamment générer :

le contexte de la situation ;
la question « ET SI… ? » ;
les différentes réponses possibles ;
la bonne réponse ;
l’explication pédagogique ;
la catégorie ;
le niveau de difficulté ;
les informations nécessaires à la génération du visuel.

À terme, cela permettrait de disposer d’un nombre beaucoup plus important de situations et de proposer des entraînements plus variés.

## 💡 Vision du projet

L’objectif à terme est de faire de ET SI ? un outil d’entraînement interactif capable d’adapter les situations au niveau et aux difficultés du joueur.

Le projet pourrait ainsi proposer un parcours de plus en plus personnalisé :

Observer → Anticiper → Décider → Progresser

## 👩🏻‍💻 Développé par

Développé avec 💛 par Chirel

👉 chirelhalioua.fr
