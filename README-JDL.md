---

## Procédure de modification du `petclinic.jdl`

Le fichier `petclinic.jdl` est la source unique de vérité pour le modèle de données. Toute l'équipe s'appuie dessus : le modifier sans coordination peut casser le code déjà généré et personnalisé par les autres groupes. Cette section explique comment procéder proprement.

### Qui peut modifier le JDL, et qui valide

- N'importe quel groupe peut **proposer** une modification (nouvel attribut, nouvelle relation, nouvelle entité) s'il en a besoin pour sa fonctionnalité.
- Aucune modification n'est poussée directement sur `main`. Elle passe **obligatoirement par une Pull Request**.
- La PR doit être **reviewée et approuvée par au moins 2 groupes différents** du groupe demandeur, avant merge (même règle qu'au Jour 1).
- G7 centralise les demandes : si plusieurs groupes demandent des changements le même jour, elles sont regroupées en **une seule PR** plutôt que plusieurs PR séparées, pour limiter les conflits.

### Comment proposer une modification

1. Créer une branche depuis `main` à jour, par exemple `jdl/ajout-champ-x`.
2. Modifier `petclinic.jdl` (ajouter le champ, la relation, etc.).
3. Ouvrir une PR vers `main`, en décrivant clairement le changement et pourquoi il est nécessaire.
4. Attendre la review de 2 groupes minimum avant de merger.

### Comment réimporter le JDL sans tout régénérer

Une fois la modification du JDL mergée sur `main`, il faut mettre à jour le code généré (entités Java, migrations Liquibase, composants Angular) **sans écraser le travail déjà personnalisé** par les groupes sur les entités non concernées par le changement.

1. Se placer sur une branche à jour avec `main` (après avoir récupéré le JDL modifié).
2. Committer ou mettre de côté (`git stash`) tout travail en cours, pour repartir d'un état propre, cette étape permet de comparer facilement ce que la régénération modifie, et de revenir en arrière si besoin.
3. Lancer la commande d'import, à la racine du projet :

```bash
   npx jhipster jdl petclinic.jdl
```

Par défaut, JHipster ne régénère que les entités dont la définition a changé dans le JDL,les autres entités et leur code déjà personnalisé ne sont normalement pas touchés.

4. **Vérifier le diff avant de commiter** (`git status` / `git diff`) : si la régénération touche des fichiers qui n'auraient pas dû changer, ne pas commiter tel quel, en discuter avec G7 avant.
5. Si on veut seulement mettre à jour les métadonnées (`.jhipster/*.json`) sans toucher au code déjà généré, utiliser l'option `--json-only` :

```bash
   npx jhipster jdl petclinic.jdl --json-only
```

6. Une fois la régénération vérifiée, committer normalement sur sa branche `feature/<groupe>-...`, en incluant la référence au changement JDL dans le message de commit.

> Éviter l'option `--force` sauf nécessité explicite validée avec G7 : elle régénère **toutes** les entités et peut écraser des personnalisations déjà faites par les groupes.
