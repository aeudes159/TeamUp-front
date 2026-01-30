# TeamUp Front

Application mobile et web développée avec React Native et Expo.

## Stack Technique

- **Framework**: React Native avec Expo (~54.0)
- **Navigation**: Expo Router (~6.0)
- **Styling**: NativeWind (TailwindCSS pour React Native)
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Backend**: Supabase
- **Authentication**: Clerk
- **TypeScript**: ~5.9

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) sur votre appareil mobile (pour tester sur mobile)

### Pour le développement mobile :

- **Android** : [Android Studio](https://developer.android.com/studio) (optionnel, pour émulateur)
- **iOS** : [Xcode](https://developer.apple.com/xcode/) (Mac uniquement, pour simulateur)

## Installation

1. Clonez le repository :
```bash
git clone <url-du-repo>
cd TeamUp-front
```

2. Installez les dépendances :
```bash
npm install
```

3. Configuration des variables d'environnement :

Créez un fichier `.env` à la racine du projet avec les clés nécessaires :
```env
# Clerk Authentication
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key

# Supabase
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Lancement du projet

### Mode Développement

Démarrez le serveur de développement Expo :

```bash
npm start
```

Cela ouvrira le Metro Bundler dans votre terminal avec un QR code.

### Lancer sur Mobile

#### Via Expo Go (Recommandé pour débuter)

1. Installez [Expo Go](https://expo.dev/go) sur votre téléphone
2. Lancez `npm start`
3. Scannez le QR code affiché :
   - **iOS** : Utilisez l'appareil photo natif
   - **Android** : Utilisez l'application Expo Go

#### Via Émulateur/Simulateur

**Android** :
```bash
npm run android
```

**iOS** (Mac uniquement) :
```bash
npm run ios
```

### Lancer sur Web

```bash
npm run web
```

L'application s'ouvrira automatiquement dans votre navigateur à l'adresse `http://localhost:8081`.

## Build & Déploiement

### Build Web (Export Statique)

Pour générer une version statique déployable sur Netlify, Vercel, GitHub Pages, etc. :

```bash
npx expo export --platform web
```

Les fichiers statiques seront générés dans le dossier `dist/`.

### Build Mobile

Pour créer des builds iOS et Android :

```bash
# Configuration du build
npx eas build:configure

# Build pour Android
npx eas build --platform android

# Build pour iOS
npx eas build --platform ios

# Build pour les deux plateformes
npx eas build --platform all
```

Note : Vous aurez besoin d'un compte [Expo EAS](https://expo.dev/eas).

## Structure du Projet

```
TeamUp-front/
├── app/                 # Routes Expo Router
├── assets/              # Images, fonts, etc.
├── components/          # Composants réutilisables
├── constants/           # Constantes de l'app
├── app.json            # Configuration Expo
├── package.json        # Dépendances
├── tailwind.config.js  # Configuration TailwindCSS
└── tsconfig.json       # Configuration TypeScript
```

## Scripts Disponibles

- `npm start` : Démarre le serveur de développement
- `npm run android` : Lance sur émulateur/appareil Android
- `npm run ios` : Lance sur simulateur/appareil iOS
- `npm run web` : Lance dans le navigateur

## Technologies Clés

### Routing
Le projet utilise **Expo Router** basé sur le système de fichiers. Les routes sont définies dans le dossier `app/`.

### Styling
**NativeWind** permet d'utiliser les classes TailwindCSS directement dans React Native.

### State Management
**Zustand** pour la gestion d'état simple et performante.

### Backend
**Supabase** pour la base de données, l'authentification et le stockage.

## Troubleshooting

### Le projet ne démarre pas

```bash
# Nettoyez le cache
npx expo start -c

# Réinstallez les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Problèmes avec les modules natifs

```bash
# Réinitialisez le projet Expo
npx expo install --check
```

### Erreurs TypeScript

```bash
# Régénérez les types Expo Router
npx expo customize tsconfig.json
```

## Support

Pour toute question ou problème, consultez :

- [Documentation Expo](https://docs.expo.dev/)
- [Documentation React Native](https://reactnative.dev/)
- [Documentation NativeWind](https://www.nativewind.dev/)

## Licence

Projet privé - Tous droits réservés
