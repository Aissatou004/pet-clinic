# 🐾 PetClinic — Jour 2 : Démarrage du développement

Le socle est posé (dépôt, JDL, application de base). Aujourd'hui, chaque binôme démarre le développement de son module sur sa branche `feature/<groupe>-...`.

---

## 0. Avant de commencer (15 min, tous les groupes)

- [ ] `git pull` sur `main` pour récupérer la dernière version du squelette généré hier.
- [ ] Vérifier que l'application démarre toujours en local après le pull.
- [ ] Se remettre sur sa branche `feature/<groupe>-...` (ou la recréer à jour si besoin : `git rebase main`).

---

## 1. Tâches par groupe

### G1 — Cliniques
- [ ] Vérifier le CRUD généré pour `Clinique` (créer, lister, éditer, supprimer un enregistrement de test).
- [ ] Ajouter la validation des champs (téléphone au bon format, adresse obligatoire).
- [ ] Commencer la personnalisation de la liste Angular : colonnes lisibles, libellés traduits en français.

### G2 — Médecins
- [ ] Vérifier le CRUD généré pour `Medecin` et le lien avec `Clinique`.
- [ ] Ajouter la validation de l'email.
- [ ] Personnaliser le formulaire : sélection de la clinique via une liste déroulante lisible (nom de clinique, pas juste l'ID).

### G3 — Clients
- [ ] Vérifier le CRUD généré pour `Client`.
- [ ] Ajouter la validation des champs obligatoires (nom, prénom, téléphone).
- [ ] Personnaliser la liste : affichage clair nom + prénom + téléphone.

### G4 — Animaux
- [ ] Vérifier le CRUD généré pour `Animal` et le lien avec `Client`.
- [ ] Ajouter la validation du poids (valeur positive) et de la date de naissance (pas dans le futur).
- [ ] Personnaliser le formulaire : sélection du client via une liste lisible.

### G5 — Rendez-vous
- [ ] Vérifier le CRUD généré pour `RendezVous` et ses liens avec `Animal`, `Medecin`, `Clinique`.
- [ ] Commencer l'implémentation de la règle métier "pas de rendez-vous dans le passé" côté back-end (validation dans le service Spring Boot).
- [ ] Lister les champs à afficher en priorité dans la liste des RDV (date, heure, motif, animal, médecin).

### G6 — Recherche & Dashboard
- [ ] Étudier comment est structurée la page d'accueil générée par JHipster.
- [ ] Lister avec chaque groupe les champs sur lesquels une recherche est utile (nom client, espèce animal, etc.) pour préparer l'implémentation transverse.
- [ ] Commencer la maquette du dashboard (nombre d'animaux, RDV du jour) — pas besoin de données réelles encore, un premier écran statique suffit.

### G7 — Intégration & JHipster
- [ ] Mettre en place le pipeline CI de base (build + tests à chaque push/PR).
- [ ] Rédiger dans le `README.md` la procédure à suivre pour modifier le `petclinic.jdl` (qui review, comment réimporter le JDL sans tout régénérer).
- [ ] Faire un point rapide avec chaque groupe pour vérifier qu'il n'y a pas de blocage sur l'environnement.
- [ ] Préparer le premier point d'intégration (voir étape 3 ci-dessous).

---

## 2. Premiers commits et Pull Requests (tous les groupes)

- [ ] Premier commit sur sa branche dès qu'une petite tâche est terminée (pas d'attendre la fin de journée pour tout committer d'un coup).
- [ ] Respecter la convention de commit (`[G4] Ajout validation poids animal`).
- [ ] Fin de journée : ouvrir une première Pull Request vers `main`, même si le travail n'est pas terminé (marquer "Draft" ou "WIP" dans le titre) — l'objectif est de prendre le réflexe de PR tôt.

---

## 3. Point d'intégration de fin de journée (15-20 min, tous les groupes + G7)

- [ ] Chaque binôme partage en 2 phrases : ce qui a été fait, ce qui bloque.
- [ ] G7 note les demandes de modification du JDL remontées par les groupes (nouvel attribut manquant, relation à ajuster) pour les traiter en une seule PR groupée le lendemain matin.

---

## ✅ En fin de journée, on doit avoir :

1. Les CRUD de base vérifiés et validés côté données pour chaque entité.
2. Une première itération de personnalisation Angular sur chaque module.
3. Le début de la règle métier sur les rendez-vous (G5).
4. Une CI qui tourne (G7).
5. Une première PR (même en Draft) ouverte par chaque binôme.
