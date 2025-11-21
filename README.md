# MIMSC Lab - Site Web Dynamique

Un site web dynamique pour le laboratoire MIMSC (Modélisation, Intelligence et Multimédia, Sciences et Calcul) de l'UCA ESTE, avec intégration MongoDB pour la gestion des données.

## 🚀 Fonctionnalités

### 🎯 **Caractéristiques Principales**

- **Site Web Dynamique** : Contenu chargé depuis MongoDB
- **Gestion des Étudiants** : Doctorants et étudiants Master avec informations complètes
- **Publications** : Système de gestion des publications scientifiques
- **Événements** : Calendrier des événements à venir avec inscriptions
- **Interface Moderne** : Design responsive avec shadcn/ui et Tailwind CSS

### 📊 **Sections Dynamiques**

#### 1. **Équipe**
- **Enseignants-Chercheurs** : Membres permanents du laboratoire
- **Doctorants** : Étudiants en thèse avec superviseurs et domaines de recherche
- **Étudiants Master** : Étudiants en master avec spécialisations

#### 2. **Publications**
- **Articles de journal** : Publications scientifiques avec DOI
- **Conférences** : Présentations et actes de conférence
- **Chapitres de livre** : Contributions à des ouvrages
- **Thèses et rapports** : Documents académiques

#### 3. **Événements**
- **Séminaires** : Présentations scientifiques
- **Ateliers** : Sessions pratiques et formation
- **Soutenances** : Thèses et mémoires
- **Conférences** : Événements académiques
- **Journées portes ouvertes** : Événements institutionnels

## 🛠 **Stack Technique**

### **Frontend**
- **Next.js 15** : Framework React avec App Router
- **TypeScript** : Typage fort pour la maintenance
- **Tailwind CSS** : Styling moderne et responsive
- **shadcn/ui** : Composants UI de haute qualité
- **Lucide React** : Icônes vectorielles

### **Backend**
- **API Routes** : Endpoints RESTful intégrés à Next.js
- **MongoDB** : Base de données NoSQL
- **Mongoose** : ODM MongoDB pour Node.js

### **Développement**
- **ESLint** : Qualité de code
- **Hot Reload** : Développement rapide
- **Git** : Contrôle de version

## 📁 **Structure du Projet**

```
src/
├── app/                    # Pages et API routes
│   ├── api/               # Endpoints API
│   │   ├── students/      # Gestion des étudiants
│   │   ├── publications/  # Gestion des publications
│   │   ├── events/        # Gestion des événements
│   │   ├── users/         # Gestion des utilisateurs
│   │   └── seed/          # Script de données exemples
│   ├── page.tsx          # Page d'accueil
│   └── researcher/        # Page chercheur (obsolète)
├── components/            # Composants React
│   ├── ui/               # Composants shadcn/ui
│   ├── DynamicTeamSection.tsx
│   ├── DynamicPublications.tsx
│   └── DynamicEvents.tsx
├── lib/                   # Bibliothèques utilitaires
│   ├── models/           # Schémas Mongoose
│   │   ├── User.ts
│   │   ├── Student.ts
│   │   ├── Publication.ts
│   │   └── Event.ts
│   ├── mongodb.ts        # Connexion MongoDB
│   └── utils.ts          # Fonctions utilitaires
└── data/                 # Données statiques (obsolète)
    ├── researcher.json
    └── researcher2.json
```

## 🗄️ **Base de Données**

### **Collections MongoDB**

#### **Users**
- Enseignants-chercheurs et personnel
- Informations de contact et profils
- Liens vers profils académiques

#### **Students**
- Doctorants et étudiants Master
- Superviseurs et co-superviseurs
- Thèses et domaines de recherche
- Statut et dates

#### **Publications**
- Articles, conférences, chapitres
- Auteurs et citations
- DOI et liens externes
- Tags et domaines de recherche

#### **Events**
- Événements à venir et passés
- Organisateurs et intervenants
- Inscriptions et capacités
- Types et statuts

## 🚀 **Installation et Déploiement**

### **Prérequis**
- Node.js 18+
- MongoDB (local ou cloud)
- npm ou yarn

### **Installation**

1. **Cloner le projet**
```bash
git clone <repository-url>
cd mimsc-lab
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env.local
```

4. **Configurer MongoDB**
```bash
# Ajouter dans .env.local
MONGODB_URI=mongodb://localhost:27017/mimsc-lab
```

5. **Démarrer le développement**
```bash
npm run dev
```

### **Peupler la base de données**

Pour ajouter des données exemples :

```bash
# Utiliser curl ou un client API
curl -X POST http://localhost:3000/api/seed
```

### **Déploiement**

```bash
# Build pour production
npm run build

# Démarrer en production
npm start
```

## 🔌 **API Endpoints**

### **Étudiants**
- `GET /api/students` - Récupérer tous les étudiants
- `GET /api/students?type=PHD` - Récupérer les doctorants
- `GET /api/students?type=MASTER` - Récupérer les étudiants Master
- `POST /api/students` - Créer un nouvel étudiant

### **Publications**
- `GET /api/publications` - Récupérer toutes les publications
- `GET /api/publications?limit=10` - Limiter les résultats
- `POST /api/publications` - Créer une nouvelle publication

### **Événements**
- `GET /api/events` - Récupérer tous les événements
- `GET /api/events?upcoming=true` - Événements à venir
- `POST /api/events` - Créer un nouvel événement

### **Utilisateurs**
- `GET /api/users` - Récupérer tous les utilisateurs
- `GET /api/users?type=FACULTY` - Récupérer les enseignants
- `POST /api/users` - Créer un nouvel utilisateur

### **Seed**
- `POST /api/seed` - Peupler la base avec des données exemples

## 🎨 **Personnalisation**

### **Ajouter de nouvelles sections**

1. **Créer le schéma Mongoose** dans `src/lib/models/`
2. **Créer l'API endpoint** dans `src/app/api/`
3. **Créer le composant React** dans `src/components/`
4. **Intégrer dans la page principale**

### **Modifier le style**

- Les styles sont définis avec Tailwind CSS
- Les composants utilisent shadcn/ui
- Personnaliser les couleurs dans `tailwind.config.ts`

### **Ajouter des champs**

1. **Mettre à jour le schéma Mongoose**
2. **Modifier les composants React**
3. **Mettre à jour les API endpoints**

## 📱 **Responsive Design**

Le site est optimisé pour :
- **Mobile** : 320px+
- **Tablette** : 768px+
- **Desktop** : 1024px+

## 🔒 **Sécurité**

- Validation des entrées avec Mongoose
- Protection contre les injections NoSQL
- Gestion des erreurs appropriée
- Variables d'environnement pour les configurations sensibles

## 📈 **Performance**

- **Chargement dynamique** des données
- **Optimisation des images** avec Next.js
- **Code splitting** automatique
- **Mise en cache** des requêtes MongoDB

## 🤝 **Contributions**

1. Forker le projet
2. Créer une branche feature
3. Committer les changements
4. Pousser vers la branche
5. Créer une Pull Request

## 📄 **Licence**

Ce projet est sous licence MIT - voir le fichier LICENSE pour les détails.

## 🆘 **Support**

Pour toute question ou problème :
- Créer une issue sur GitHub
- Contacter l'équipe de développement

---

**Développé avec ❤️ pour le laboratoire MIMSC - UCA ESTE**