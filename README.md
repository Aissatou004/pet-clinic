# 🐾 PetClinic — Jour 1 : Kickoff du projet

Objectif du jour : poser les fondations communes avant que chaque groupe ne commence à développer son module. **Rien ne doit être développé aujourd'hui côté fonctionnalités** — tout le monde doit repartir avec un dépôt, un JDL validé et une application de base qui tourne.

---

## 1. Création du dépôt Git commun (30 min)

- [ ] Créer le dépôt `pet-clinic` sur la forge (GitHub/GitLab interne).
- [ ] Ajouter les 14 stagiaires + encadrant(s) comme collaborateurs.
- [ ] Protéger la branche `main` (pas de push direct, PR + au moins 1 review obligatoire).
- [ ] Créer un fichier `README.md` à la racine avec :
  - le nom du projet et son objectif,
  - la liste des 7 groupes et leur périmètre (tableau du sujet),
  - la convention de branches : `feature/<groupe>-<courte-description>` (ex. `feature/g4-animaux-crud`),
  - la convention de commits (ex. `[G4] Ajout validation poids animal`),
  - le lien vers le fichier `petclinic.jdl`.

## 2. Atelier collectif : définition du JDL (1h)

- [ ] Tous les groupes se réunissent (physiquement ou en visio) pour définir ensemble les 5 entités et leurs relations : `Clinique`, `Medecin`, `Client`, `Animal`, `RendezVous`.
- [ ] Écrire le fichier `petclinic.jdl` avec :
  - les attributs de chaque entité (voir sujet),
  - les relations `OneToMany`/`ManyToOne`,
  - `paginate * with pagination`,
  - `service * with serviceClass`.
- [ ] Chaque groupe relit et valide la partie du JDL qui le concerne avant de committer.
- [ ] Commit du fichier `petclinic.jdl` directement sur une branche `setup/jdl-initial`, puis PR vers `main` reviewée par au moins 2 groupes différents.

## 3. Génération de l'application de base (le groupe G7 pilote, les autres suivent)

- [ ] G7 génère l'application JHipster monolithique (`jhipster` en mode interactif ou avec `.yo-rc.json` préparé) : nom `pet-clinic`, Angular, base de données au choix (PostgreSQL ou MySQL).
- [ ] Import du `petclinic.jdl` validé à l'étape 2 dans l'application générée.
- [ ] Vérification que l'application démarre correctement (`./mvnw` + `npm start` ou équivalent) et que les entités CRUD de base sont accessibles.
- [ ] Commit de l'application générée sur `main` (squelette de base, sans personnalisation).

## 4. Mise en place de l'environnement de chaque groupe (fin de journée)

- [ ] Chaque binôme clone le dépôt et fait tourner l'application en local avec succès.
- [ ] Chaque binôme crée sa branche `feature/<groupe>-...` à partir de `main` à jour.
- [ ] Chaque binôme note dans `README.md` (section "Suivi des groupes") l'état "Environnement OK" une fois que ça tourne.

---

## ✅ Fin de journée, on doit avoir :

1. Un dépôt Git avec `main` protégée.
2. Un `petclinic.jdl` validé et versionné.
3. Une application JHipster de base qui démarre pour tout le monde.
4. Chaque binôme avec sa branche prête pour démarrer son module demain.
