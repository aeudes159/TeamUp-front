# TeamUp Front

Application mobile et web de team building avec chat en temps réel, reactions et partage d'images.

## Stack Technique

- **Framework**: React Native avec Expo (~54.0)
- **Navigation**: Expo Router (~6.0)
- **Styling**: React Native Paper + StyleSheet
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Backend**: Spring Boot API (TeamUp-back)
- **Storage**: Supabase Storage (images)
- **Authentication**: Clerk (optional)
- **Notifications**: Expo Notifications
- **TypeScript**: ~5.9

## Fonctionnalites

- Chat de groupe en temps réel (polling 2s)
- Reactions aux messages (emojis)
- Envoi d'images dans le chat
- Notifications push (mobile)
- Support Web et Mobile

## Prerequisites

Avant de commencer, assurez-vous d'avoir installe :

- [Node.js](https://nodejs.org/) (version 18 ou superieure recommandee)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) sur votre appareil mobile (pour tester sur mobile)

### Pour le developpement mobile :

- **Android** : [Android Studio](https://developer.android.com/studio) (optionnel, pour emulateur)
- **iOS** : [Xcode](https://developer.apple.com/xcode/) (Mac uniquement, pour simulateur)

## Installation

1. Clonez le repository :
```bash
git clone <url-du-repo>
cd TeamUp-front
```

2. Installez les dependances :
```bash
npm install
```

3. Configuration des variables d'environnement :

Copiez le fichier d'exemple et configurez vos cles :
```bash
cp .env.example .env
```

Editez `.env` avec vos valeurs :
```env
# Backend API (requis)
EXPO_PUBLIC_API_URL=http://localhost:8080

# Supabase Storage (requis pour les images)
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Clerk Authentication (optionnel)
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Expo Project ID (pour les notifications push)
EXPO_PUBLIC_PROJECT_ID=your-expo-project-id
```

## Variables d'Environnement

| Variable | Requis | Description |
|----------|--------|-------------|
| `EXPO_PUBLIC_API_URL` | Oui | URL du backend Spring Boot (ex: `http://localhost:8080`) |
| `EXPO_PUBLIC_SUPABASE_URL` | Oui | URL de votre projet Supabase |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Oui | Cle anonyme Supabase (publique) |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Non | Cle publique Clerk pour l'authentification |
| `EXPO_PUBLIC_PROJECT_ID` | Non | ID du projet Expo pour les notifications push |

## Configuration Supabase

Pour l'upload d'images, vous devez configurer Supabase Storage :

1. Creez un bucket `images` dans Supabase Storage
2. Configurez les policies RLS (ou executez la migration backend `V1_3__add_supabase_storage_policies.sql`)

```sql
-- Creer le bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Policies pour upload/lecture/suppression publique
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT TO public WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow public reads" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'images');

CREATE POLICY "Allow public deletes" ON storage.objects
FOR DELETE TO public USING (bucket_id = 'images');
```

## Lancement du projet

### Mode Developpement

Demarrez le serveur de developpement Expo :

```bash
npm start
```

Cela ouvrira le Metro Bundler dans votre terminal avec un QR code.

### Lancer sur Mobile

#### Via Expo Go (Recommande pour debuter)

1. Installez [Expo Go](https://expo.dev/go) sur votre telephone
2. Lancez `npm start`
3. Scannez le QR code affiche :
   - **iOS** : Utilisez l'appareil photo natif
   - **Android** : Utilisez l'application Expo Go

#### Via Emulateur/Simulateur

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

L'application s'ouvrira automatiquement dans votre navigateur a l'adresse `http://localhost:8081`.

## Structure du Projet

```
TeamUp-front/
├── app/                    # Routes Expo Router
│   ├── (tabs)/            # Navigation par onglets
│   │   ├── index.tsx      # Feed/Evenements
│   │   ├── groups.tsx     # Liste des groupes
│   │   └── profile.tsx    # Profil utilisateur
│   ├── group/[id].tsx     # Chat de groupe
│   └── _layout.tsx        # Layout racine
├── components/
│   ├── chat/              # Composants chat
│   │   ├── ReactionPicker.tsx
│   │   ├── ReactionBar.tsx
│   │   └── ImagePickerButton.tsx
│   ├── groups/            # Composants groupes
│   │   └── MessageBubble.tsx
│   └── ui/                # Composants UI de base
├── contexts/              # Contextes React
│   └── NotificationContext.tsx
├── hooks/                 # Custom hooks
│   ├── useMessages.ts
│   ├── useReactions.ts
│   ├── useNotifications.ts
│   └── useImageUpload.ts
├── lib/                   # Utilitaires
│   ├── api.ts            # Client API
│   ├── supabase.ts       # Client Supabase
│   └── queryClient.ts    # Config React Query
├── types/                 # Types TypeScript
│   ├── index.ts
│   └── api.ts
└── .env.example          # Template variables d'env
```

## Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Demarre le serveur de developpement |
| `npm run android` | Lance sur emulateur/appareil Android |
| `npm run ios` | Lance sur simulateur/appareil iOS |
| `npm run web` | Lance dans le navigateur |

## Fonctionnalites du Chat

### Envoi de messages
- Tapez votre message et appuyez sur "Send"
- **Web** : `Enter` pour envoyer, `Shift+Enter` pour nouvelle ligne

### Reactions
- **Long press** sur un message pour ouvrir le selecteur d'emoji
- Choisissez parmi les emojis rapides ou appuyez sur "+" pour plus d'options
- Cliquez en dehors pour fermer le selecteur
- Cliquez sur une reaction existante pour l'ajouter/retirer

### Images
- Appuyez sur l'icone image a cote du champ de texte
- Choisissez "Gallery" ou "Camera"
- Previsualisation avant envoi

## Troubleshooting

### Le projet ne demarre pas

```bash
# Nettoyez le cache
npx expo start -c

# Reinstallez les dependances
rm -rf node_modules package-lock.json
npm install
```

### Erreur "localStorage.getItem is not a function"

Cette erreur peut survenir avec expo-notifications sur web. Le code gere automatiquement ce cas.

### Les images ne s'uploadent pas

Verifiez que :
1. `EXPO_PUBLIC_SUPABASE_URL` et `EXPO_PUBLIC_SUPABASE_ANON_KEY` sont configures
2. Le bucket `images` existe dans Supabase
3. Les policies RLS sont configurees (voir section Configuration Supabase)

### Les reactions n'apparaissent pas

Verifiez que :
1. Le backend est demarre et accessible
2. La migration `V1_2__add_reaction_table.sql` a ete executee

## Build & Deploiement

### Build Web (Export Statique)

```bash
npx expo export --platform web
```

Les fichiers statiques seront generes dans le dossier `dist/`.

### Build Mobile (Development Build)

Pour creer un build de developpement local :

```bash
# Generer les projets natifs
npx expo prebuild

# Build Android (necessite Android Studio)
npx expo run:android

# Build iOS (Mac uniquement, necessite Xcode)
npx expo run:ios
```

Note : Pour tester sur mobile pendant le developpement, utilisez [Expo Go](https://expo.dev/go).

## Support

Pour toute question ou probleme, consultez :

- [Documentation Expo](https://docs.expo.dev/)
- [Documentation React Native](https://reactnative.dev/)
- [Documentation Supabase](https://supabase.com/docs)

## Licence

Projet prive - Tous droits reserves
