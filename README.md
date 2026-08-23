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
