# 🐾 Projet PetClinic — Système de Gestion Vétérinaire

Bienvenue dans le projet PetClinic. Ce document explique le projet dans son ensemble et ce que vous devez faire **aujourd'hui**, jour 1.

---

## 🎯 Le projet en bref

Vous allez concevoir et développer, **tous ensemble**, une application de gestion pour une clinique vétérinaire, avec la stack Spring Boot / JHipster / Angular.

Ce n'est pas 7 projets identiques développés côte à côte : c'est **une seule application PetClinic**, construite par 7 binômes qui se partagent le travail sur un dépôt Git commun, comme dans une vraie squad.

### Fonctionnalités attendues

1. **Gestion des Cliniques** — CRUD (Nom, Adresse, Téléphone)
2. **Gestion des Médecins** — CRUD, rattachés à une clinique (Nom, Prénom, Spécialité, Email)
3. **Gestion des Clients (propriétaires)** — CRUD (Nom, Prénom, Adresse, Téléphone)
4. **Gestion des Animaux** — CRUD, rattachés à un client (Nom, Espèce, Date de naissance, Poids)
5. **Gestion des Rendez-vous** — Planification (Date, Heure, Motif), lié à un Animal, un Médecin et une Clinique. Règle métier : pas de rendez-vous dans le passé.
6. **Recherche et filtrage** sur les listes (ex. client par nom, animal par espèce)
7. **Dashboard** en page d'accueil : nombre total d'animaux enregistrés + rendez-vous du jour

### Organisation : 7 groupes, 7 périmètres

| Groupe                          | Périmètre                             | Ce qu'il livre                                          |
| ------------------------------- | ------------------------------------- | ------------------------------------------------------- |
| **G1 — Cliniques**              | CRUD Clinique + lien avec Médecin     | Formulaires, validations, liste avec recherche          |
| **G2 — Médecins**               | CRUD Médecin, rattaché à une clinique | Gestion des spécialités, filtre par clinique/spécialité |
| **G3 — Clients**                | CRUD Client                           | Recherche par nom, fiche client avec ses animaux        |
| **G4 — Animaux**                | CRUD Animal, rattaché à un client     | Filtre par espèce, historique poids                     |
| **G5 — Rendez-vous**            | Planification RDV                     | Règle "pas de RDV dans le passé", vue par jour          |
| **G6 — Recherche & Dashboard**  | Recherche globale, page d'accueil     | Widgets dashboard, i18n des libellés                    |
| **G7 — Intégration & JHipster** | Pilotage technique du dépôt commun    | JDL, merges, CI, doc technique                          |

> Le rôle de **G7** peut tourner entre les groupes toutes les 1-2 semaines : chaque binôme passera à un moment par la partie "intégration" (gestion du JDL commun, résolution de conflits, CI/CD).

### La règle d'or

Il existe **un seul fichier `petclinic.jdl`** qui décrit tout le modèle de données du projet. Toute modification de ce fichier (nouvel attribut, nouvelle relation) passe par une Pull Request, jamais par un push direct sur `main`.

---

## ✅ Ce que vous devez faire aujourd'hui (Jour 1)

Aujourd'hui, **on ne code aucune fonctionnalité**. L'objectif est de poser un socle commun sur lequel tout le monde pourra s'appuyer dès demain.

### 1. Création du dépôt Git commun (~30 min)

already done

### 2. Atelier collectif : définition du JDL (~1h)

- [ ] Tous les groupes se réunissent pour définir ensemble les 5 entités et leurs relations : `Clinique`, `Medecin`, `Client`, `Animal`, `RendezVous`.
- [ ] Écrire `petclinic.jdl` avec les attributs de chaque entité, les relations `OneToMany`/`ManyToOne`, `paginate * with pagination`, `service * with serviceClass`.
- [ ] Chaque groupe relit et valide la partie du JDL qui le concerne.
- [ ] Commit sur une branche `setup/jdl-initial`, puis PR vers `main` reviewée par au moins 2 groupes différents.

### 3. Génération de l'application de base (G7 pilote, les autres suivent)

- [ ] G7 génère l'application JHipster monolithique : nom `pet-clinic`, Angular, base de données au choix (PostgreSQL ou MySQL).
- [ ] Import du `petclinic.jdl` validé dans l'application générée.
- [ ] Vérification que l'application démarre correctement et que les entités CRUD de base sont accessibles.
- [ ] Commit du squelette de base sur `main`.

### 4. Mise en place de l'environnement de chaque binôme (fin de journée)

- [ ] Chaque binôme clone le dépôt et fait tourner l'application en local.
- [ ] Chaque binôme crée sa branche `feature/<groupe>-...` à partir de `main` à jour.
- [ ] Chaque binôme note dans le `README.md` l'état "Environnement OK" une fois que ça tourne.

### En fin de journée, on doit avoir :

1. Un dépôt Git avec `main` protégée.
2. Un `petclinic.jdl` validé et versionné.
3. Une application JHipster de base qui démarre pour tout le monde.
4. Chaque binôme avec sa branche prête pour démarrer son module demain.

### État des environnements par groupe

| Groupe        | Environnement                                      | Branche               |
| ------------- | -------------------------------------------------- | --------------------- |
| G2 — Médecins | ✅ OK (app démarre en local, CRUD Medecin vérifié) | `feature/g2-medecins` |
