# Page Personnelle Dynamique pour Chercheurs

Cette application permet de créer des pages personnelles dynamiques pour les chercheurs de manière générique, basée sur des fichiers JSON modifiables.

## Structure

### Fichiers JSON

Les données des chercheurs sont stockées dans le dossier `src/data/` sous forme de fichiers JSON. Chaque fichier contient la structure suivante :

```json
{
  "personalInfo": {
    "firstName": "Prénom",
    "lastName": "Nom",
    "title": "Titre",
    "position": "Position",
    "email": "email@example.com",
    "phone": "+212 XXX XXX XXX",
    "office": "Bureau",
    "avatar": "URL de l'avatar (optionnel)",
    "bio": "Biographie",
    "interests": ["Intérêt 1", "Intérêt 2"],
    "links": {
      "googleScholar": "URL",
      "researchGate": "URL",
      "linkedin": "URL",
      "orcid": "URL"
    }
  },
  "scientificActivity": {
    "publications": [...],
    "projects": [...],
    "supervisions": [...],
    "conferences": [...]
  },
  "pedagogicalActivity": {
    "courses": [...],
    "tutorials": [...],
    "responsibilities": [...],
    "innovations": [...]
  },
  "honors": [...]
}
```

### Pages

- **Page principale** (`/`) : Contient la présentation du laboratoire avec un bouton "Voir le profil" pour accéder aux profils individuels
- **Page chercheur** (`/researcher`) : Page dynamique qui affiche le profil du chercheur basé sur le fichier JSON

## Utilisation

### 1. Modifier les données d'un chercheur

Pour modifier les informations d'un chercheur, éditez le fichier JSON correspondant dans `src/data/` :

```bash
# Exemple pour modifier le profil principal
nano src/data/researcher.json
```

### 2. Ajouter un nouveau chercheur

1. Créez un nouveau fichier JSON dans `src/data/` (ex: `researcher3.json`)
2. Copiez la structure du fichier `researcher.json` existant
3. Modifiez les informations selon le nouveau chercheur
4. Mettez à jour la page pour charger le nouveau fichier JSON

### 3. Personnaliser la page

La page est entièrement personnalisable via le fichier JSON :

- **Informations personnelles** : nom, titre, position, contacts, centres d'intérêt
- **Activité scientifique** : publications, projets, supervisions, conférences
- **Activité pédagogique** : cours, tutoriels, responsabilités, innovations
- **Distinctions** : prix et reconnaissances

## Sections de la Page

### En-tête
- Photo de profil avec initiales si pas d'avatar
- Informations de contact (email, téléphone, bureau)
- Centres d'intérêt avec badges
- Liens vers les profils académiques

### Activité Scientifique
- **Publications** : Liste complète avec détails (auteurs, journal, année, DOI)
- **Projets** : Cartes des projets de recherche avec financement et partenaires
- **Supervisions** : Thèses et mémoires encadrés
- **Conférences** : Présentations et interventions

### Activité Pédagogique
- **Cours** : Matières enseignées avec objectifs et horaires
- **Tutoriels** : Ateliers et formations
- **Responsabilités** : Tâches administratives
- **Innovations** : Initiatives pédagogiques

## Caractéristiques Techniques

- **Responsive Design** : Compatible mobile, tablette et desktop
- **Composants UI** : Utilisation de shadcn/ui pour un design cohérent
- **TypeScript** : Typage fort pour la maintenance du code
- **Next.js 15** : Dernière version avec App Router
- **Tailwind CSS** : Styling moderne et personnalisable

## Exemples de fichiers JSON

- `src/data/researcher.json` : Profil du Dr. Ahmed Mohammed
- `src/data/researcher2.json` : Profil de la Pr. Fatima Zahra

## Déploiement

Pour déployer l'application :

```bash
# Build de l'application
npm run build

# Déploiement (selon votre plateforme)
npm run start
```

## Personnalisation avancée

Pour ajouter de nouvelles sections ou modifier la structure :

1. Mettez à jour le schéma TypeScript dans `src/app/researcher/page.tsx`
2. Modifiez le composant correspondant
3. Mettez à jour les fichiers JSON pour inclure les nouvelles données

## Support

Pour toute question ou modification, contactez l'équipe de développement.