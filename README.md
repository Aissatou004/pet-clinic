# 📋 CampusHub — Tâches du jour (Jour 10/10) — Dernier jour !

 G8 est de retour aujourd'hui. Le pipeline CI et le Docker compose ont été assemblés hier par les 7 autres groupes. G8 reprend aujourd'hui le pilotage de la finalisation : déploiement public, polish du pipeline, README. Tous les autres groupes reviennent à leur rôle habituel + préparation de la démo finale.

**Objectif du jour :** URL publique + Swagger UI en ligne + dépôt documenté + démo de 10 min par groupe/binôme.

---

## ⚫ G8 – DevOps & Cloud (retour, pilote du jour)

**Mission du jour :** reprendre la main sur le CI/CD et piloter le déploiement — c'est votre journée.

### Étapes détaillées

**1. Se resynchroniser en priorité absolue, dès l'arrivée** (30 premières minutes) :
   - Lire `docs/ci-cd.md` rédigé par G1 hier.
   - Passer en revue avec G1, G4 et G5 ce qui a été livré hier (pipeline, `docker-compose.yml`, gestion des secrets) pour repartir sur une base claire.

**2. Finaliser le pipeline GitHub Actions** — ajouter le déclenchement sur chaque PR si pas déjà fait, et un job de déploiement automatique sur la branche `main` :
```yaml
name: build-test-deploy
on:
  pull_request:
  push:
    branches: [main]

jobs:
  # ... jobs build-backend, build-frontend, build-docker-images, test-docker-compose (repris de G1 hier)

  deploy:
    needs: [test-docker-compose]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Déployer sur la plateforme cible
        run: |
          # commande spécifique à la plateforme choisie (voir étape 3)
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

**3. Piloter le déploiement public** sur la plateforme choisie (Render, Railway, Fly.io ou VPS) :
   - Connecter le dépôt GitHub à la plateforme.
   - Configurer les variables d'environnement en production (`JWT_SECRET`, `POSTGRES_PASSWORD`, etc.) à partir de la documentation `docs/secrets.md` livrée par G5 hier — **jamais de valeurs en dur**.
   - Configurer les profils Spring `dev` (local) et `prod` (déployé) :
```properties
# application-prod.properties
spring.datasource.url=${DATABASE_URL}
spring.jpa.hibernate.ddl-auto=validate
spring.flyway.enabled=true
```
   - Lancer le premier déploiement et vérifier que l'application répond bien publiquement.

**4. Vérifier l'endpoint Actuator `/health`** en production :
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```
```properties
management.endpoints.web.exposure.include=health
```

**5. Vérifier que Swagger UI est accessible publiquement**, pas seulement en local.

**6. Support à G1** pour la rédaction de la section "déploiement" du README global.

### Livrable attendu ce soir
- URL publique fonctionnelle, Swagger UI accessible en ligne.
- Pipeline CI/CD complet : build + tests + déploiement automatique sur push vers `main`.
- Endpoint `/health` vérifié en production.

---

## 🔵 G1 – Fondations & Modèle de données

**Mission du jour :** README global — la synthèse finale de tout le projet.

### Étapes détaillées

1. **Rédiger le README principal** à la racine du dépôt, avec une section par module (demander à chaque groupe un paragraphe court sur son périmètre) :
```markdown
# CampusHub

## Installation
### Prérequis
- JDK 17+, Node 20+, Docker

### Lancer en local
\`\`\`bash
docker compose up
\`\`\`
Application disponible sur http://localhost:4200
Swagger UI sur http://localhost:8080/swagger-ui.html

## Architecture
[schéma ou description des modules back/front]

## Modules
- **Étudiants** (G2) — ...
- **Cours & Inscriptions** (G3) — ...
- **Persistance** (G4) — ...
- **Sécurité** (G5) — ...
- **Frontend** (G6, G7) — ...
- **CI/CD & Déploiement** (G8) — ...

## Lien Swagger en production
[URL fournie par G8]

## Déploiement
[URL publique fournie par G8]
```

2. **Collecter les paragraphes** de chaque groupe en début de journée (message groupé, deadline claire type "avant 11h").

3. **Relire l'ensemble** pour la cohérence de style et de niveau de détail.

4. **Coordonner la préparation de la démo finale** : établir l'ordre de passage, vérifier que chaque groupe a bien 10 minutes préparées.

### Livrable attendu ce soir
- README complet et cohérent, avec lien Swagger et URL de déploiement à jour.

---

## 🟢 G2 – API Étudiants

**Mission du jour :** finitions et préparation de la démo.

### Étapes détaillées

1. **Vérifier que l'API fonctionne correctement en production** une fois déployée par G8 — tester quelques appels réels depuis Swagger UI en ligne.

2. **Rédiger votre paragraphe** pour le README (2-3 lignes sur votre périmètre : CRUD, validation, sécurité appliquée).

3. **Préparer votre portion de la démo** : quels endpoints montrer, quel scénario raconter en 1-2 minutes sur votre module.

4. **Corriger les derniers bugs mineurs** si le temps le permet, sans prendre de risque la veille de la démo (pas de gros refactoring aujourd'hui).

### Livrable attendu ce soir
- API validée en production.
- Paragraphe README livré à G1.
- Portion de démo préparée.

---

## 🟡 G3 – API Cours & Inscriptions

**Mission du jour :** finitions et préparation de la démo.

### Étapes détaillées

1. **Vérifier le fonctionnement en production** une fois déployé.
2. **Rédiger votre paragraphe README.**
3. **Préparer votre portion de démo**, en particulier la démonstration de la relation many-to-many (inscriptions) qui est votre valeur ajoutée technique la plus visible.

### Livrable attendu ce soir
- Module validé en production.
- Paragraphe README livré à G1.
- Portion de démo préparée.

---

## 🟠 G4 – Persistance

**Mission du jour :** vérification finale de la persistance en production, et préparation de la démo.

### Étapes détaillées

1. **Vérifier que les migrations Flyway s'appliquent bien automatiquement** au déploiement en production (coordination avec G8).

2. **S'assurer que les données de démonstration** sont présentes en production pour que la démo soit visuellement convaincante — ou, si vous préférez une démo "à froid", vérifier qu'un compte ADMIN de démo existe pour créer des données en direct.

3. **Rédiger votre paragraphe README** (schéma relationnel, choix de migration Flyway).

4. **Préparer votre portion de démo** : montrer le schéma relationnel au tableau ou via `docs/schema.md`.

### Livrable attendu ce soir
- Persistance validée en production.
- Paragraphe README livré à G1.
- Portion de démo préparée.

---

## 🔴 G5 – Sécurité Backend

**Mission du jour :** vérification finale de la sécurité en production, et préparation de la démo.

### Étapes détaillées

1. **Vérifier que `JWT_SECRET` est bien configuré comme variable d'environnement en production** (jamais en dur) — dernière vérification avec G8.

2. **Tester le parcours register → login → action protégée** directement sur l'URL publique, pas seulement en local.

3. **Rédiger votre paragraphe README** (approche sécurité : JWT, rôles, BCrypt).

4. **Préparer votre portion de démo** : le parcours d'authentification complet est souvent le moment le plus impressionnant à montrer au jury — soignez cette partie.

### Livrable attendu ce soir
- Sécurité validée en production.
- Paragraphe README livré à G1.
- Portion de démo préparée.

---

## 🟣 G6 – Frontend Core

**Mission du jour :** vérification finale de l'affichage en production, et préparation de la démo.

### Étapes détaillées

1. **Vérifier que le frontend déployé** (servi par Nginx via l'image Docker créée hier) communique bien avec le backend en production — attention aux URLs d'API en dur qui pointeraient encore vers `localhost`.

2. **Si nécessaire, corriger la configuration d'environnement Angular** pour utiliser la bonne URL d'API en production :
```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://votre-backend-deploye.com/api'
};
```

3. **Rédiger votre paragraphe README.**

4. **Préparer votre portion de démo** : affichage, pagination, gestion des états de chargement/erreur.

### Livrable attendu ce soir
- Frontend fonctionnel en production, connecté au bon backend.
- Paragraphe README livré à G1.
- Portion de démo préparée.

---

## ⚪ G7 – Frontend Formulaires & Auth

**Mission du jour :** vérification finale du parcours utilisateur complet en production, et préparation de la démo.

### Étapes détaillées

1. **Tester le parcours utilisateur intégral sur l'URL publique** : login → navigation → CRUD complet → déconnexion.

2. **Vérifier que les guards et l'intercepteur fonctionnent bien en production** (pas seulement en local avec le serveur de dev Angular).

3. **Rédiger votre paragraphe README.**

4. **Préparer votre portion de démo** : c'est vous qui porterez probablement le fil conducteur de la démo finale (parcours utilisateur de bout en bout), coordonnez-vous avec G1 sur l'ordre de passage.

### Livrable attendu ce soir
- Parcours utilisateur complet validé en production.
- Paragraphe README livré à G1.
- Portion de démo préparée, probablement en ouverture ou clôture du passage collectif.

---

## 🎤 Démo finale (fin de journée)

**Format : 10 minutes par binôme/groupe**, structure suggérée :
1. Parcours utilisateur complet (G7 ouvre le bal en général — connexion, navigation).
2. Tour de l'API dans Swagger (G2/G3 montrent la documentation et les endpoints clés).
3. Zoom sur un point technique fort par groupe (relation many-to-many pour G3, JWT pour G5, schéma pour G4, Docker/déploiement pour G8).
4. Questions du jury.

## Grille d'évaluation finale — rappel

| Critère | Points |
|---|---|
| API REST fonctionnelle, codes HTTP corrects (G2, G3) | 15 |
| Documentation Swagger complète et exacte | 15 |
| Persistance JPA + migrations Flyway (G4) | 10 |
| Sécurité JWT bout en bout (G5) | 15 |
| Front Angular : routing, formulaires, guards, intercepteur (G6, G7) | 20 |
| Tests back et front | 10 |
| Docker + CI + déploiement (G8) | 5 |
| Partie collective : cohérence d'intégration, qualité des revues croisées, démo finale | 10 |

## 📌 Dernier rappel

Dernier `JOURNAL.md` du parcours : chaque groupe rédige un bilan en quelques lignes — appris sur 2 semaines, ce qui a bien fonctionné dans la collaboration à 8 groupes, ce qui pourrait être amélioré pour une prochaine session.

**Bravo à tous pour ces 10 jours !** 🎉
