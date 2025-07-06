# Crenauto

## Description

Application de gestion d'auto ecole. Ce projet a pour objectif de me permettre d'apprendre la clean architecture. Focus sur la separation du code en differentes couches, l'isolation des entites metier et le testing avec la syntaxe Gherkin.
L'objectif est de creer une application en isolant le code metier des details techniques

Ce repository ne contient ni frontend, ni backend pour le moment. Seulement du code typescript implementant les differents cas d'usage de la future application. Cela inclue la creation d'une entreprise pour l'administrateur de la solution, les operations CRUD sur les entreprises et leurs auto ecoles

## Stack Technique

- **Languages** : Typescript
- **Testing** : Vitest


## Architecture

- **Clean Architecture**: Il s'agit d'un workspace PNPM avec differents packages:
  - Package application: Contient les differents useCase propres a la logique applicative
  - Package domain: On y retrouve les differentes Entites metier de l'application. Celles-ci ne doivent absolument pas dependre de l'exterieur
  - Package error: Fournit des helpers de gestion d'erreur, des types permettant la gestion d'erreur de maniere fonctionnelle

## Gherkin

Le projet utilise **Gherkin** pour écrire des tests comportementaux. Gherkin est un langage de plain text qui permet de définir des scénarios de tests de manière claire et compréhensible par tous les membres de l'équipe, y compris les non-développeurs.
Le code teste reelement les scenarios tels qu'ils sont ecrits dans les user Stories

## Lancer les tests

A la racine du projet 

```
pnpm test
```
