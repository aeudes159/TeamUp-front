# 🎯 TeamBuilding App - Frontend

Application mobile-first de gestion d'événements de team building avec chat en temps réel.

## 📋 Vue d'ensemble

**Contexte :** Hackathon 20h - Application de team building d'entreprise
**Priorité :** Mobile-first avec support Web
**Stack :** Expo (React Native) + TypeScript + NativeWind

## 🛠️ Stack Technique
```yaml
Framework: Expo SDK 50+ (React Native)
Language: TypeScript (strict mode)
Styling: NativeWind (Tailwind CSS pour React Native)
Navigation: Expo Router (file-based routing)
State Management: 
  - React Query (@tanstack/react-query) pour server state
  - Zustand pour client state si besoin
Auth: Clerk (@clerk/clerk-expo)
Database: Supabase (PostgreSQL + Realtime)
Storage: Supabase Storage (images)
HTTP Client: Fetch API + React Query
Déploiement: 
  - Web: Vercel
  - Mobile: Expo Go (dev) / EAS Build (prod)
```

## 📁 Structure du Projet
```
teambuilding-app/
├── app/                          # Expo Router (file-based routing)
│   ├── (auth)/                   # Routes authentification
│   │   └── login.tsx            # Écran de connexion
│   ├── (tabs)/                   # Navigation tabs (authentifié)
│   │   ├── _layout.tsx          # Layout avec bottom tabs
│   │   ├── index.tsx            # 📱 Feed événements
│   │   ├── groups.tsx           # 👥 Liste groupes
│   │   └── profile.tsx          # 👤 Profil utilisateur
│   ├── group/                    # Routes dynamiques
│   │   └── [id].tsx             # 💬 Chat groupe
│   ├── event/
│   │   └── [id].tsx             # 📋 Détail événement
│   ├── _layout.tsx              # Root layout (Clerk Provider)
│   └── +not-found.tsx           # 404
│
├── components/                   # Composants réutilisables
│   ├── ui/                      # Composants de base
│   │   ├── Button.tsx           # Boutons (primary, secondary, outline)
│   │   ├── Card.tsx             # Card wrapper
│   │   ├── Input.tsx            # Input texte
│   │   └── Avatar.tsx           # Avatar utilisateur
│   ├── events/                  # Composants événements
│   │   ├── EventCard.tsx        # Card événement
│   │   ├── EventList.tsx        # Liste événements
│   │   └── CreateEventForm.tsx  # Formulaire création
│   ├── groups/                  # Composants groupes
│   │   ├── GroupCard.tsx        # Card groupe
│   │   └── MessageBubble.tsx    # Bulle de message
│   └── layout/
│       └── Screen.tsx           # Screen wrapper (SafeAreaView)
│
├── lib/                         # Utilitaires et configs
│   ├── supabase.ts             # Client Supabase
│   ├── clerk.ts                # Config Clerk
│   └── queryClient.ts          # Config React Query
│
├── hooks/                       # Custom hooks
│   ├── useEvents.ts            # Fetch/Create events
│   ├── useGroups.ts            # Fetch groups
│   ├── useMessages.ts          # Realtime messages
│   └── useAuth.ts              # Auth utilities
│
├── types/                       # Types TypeScript
│   ├── database.types.ts       # Types générés depuis Supabase
│   ├── api.types.ts            # Types API Spring
│   └── index.ts                # Exports
│
├── mock/                        # Données de test (phase dev)
│   └── data.ts                 # Mock events, groups, messages
│
├── utils/                       # Fonctions utilitaires
│   ├── formatters.ts           # Date, nombre formatters
│   └── validators.ts           # Validation forms
│
├── assets/                      # Assets statiques
│   ├── images/
│   └── styles/
│       └── global.css          # Tailwind global styles
│
├── .env.local                   # Variables d'environnement (local)
├── .env.example                 # Template env vars
├── app.json                     # Config Expo
├── tailwind.config.js          # Config Tailwind
├── tsconfig.json               # Config TypeScript
└── package.json
```

## 🎨 Conventions de Code

### TypeScript
```typescript
// ✅ DO: Types explicites pour les props
type EventCardProps = {
  event: Event;
  onPress?: () => void;
};

// ✅ DO: Utiliser les types Supabase générés
import { Database } from '@/types/database.types';
type Event = Database['public']['Tables']['events']['Row'];

// ❌ DON'T: Utiliser 'any' (sauf cas exceptionnel)
const handleSubmit = (data: any) => { } // ❌

// ✅ DO: Named exports
export function EventCard({ event }: EventCardProps) { }

// ❌ DON'T: Default exports (sauf pour les pages Expo Router)
export default function EventCard() { } // ❌ (sauf dans app/)
```

### Styling (NativeWind)
```typescript
// ✅ DO: Utiliser NativeWind (Tailwind classes)
<View className="flex-1 bg-gray-50 p-4">
  <Text className="text-2xl font-bold text-gray-900">Titre</Text>
</View>

// ❌ DON'T: StyleSheet inline (sauf cas complexe)
<View style={{ flex: 1, backgroundColor: '#f9fafb' }}> // ❌

// ✅ DO: Responsive avec breakpoints
<View className="w-full md:w-1/2 lg:w-1/3">

// ✅ DO: Variables Tailwind dans config
className="bg-primary text-white" // primary défini dans tailwind.config.js
```

### React Query
```typescript
// ✅ DO: Utiliser React Query pour le server state
import { useQuery, useMutation } from '@tanstack/react-query';

const { data: events, isLoading } = useQuery({
  queryKey: ['events'],
  queryFn: fetchEvents,
});

// ✅ DO: Mutations avec invalidation
const createEvent = useMutation({
  mutationFn: (event: NewEvent) => supabase.from('events').insert(event),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['events'] });
  },
});

// ❌ DON'T: useState pour server data
const [events, setEvents] = useState([]); // ❌
useEffect(() => { fetchEvents() }, []); // ❌
```

### Supabase Realtime
```typescript
// ✅ DO: Subscribe dans useEffect avec cleanup
useEffect(() => {
  const channel = supabase
    .channel(`group:${groupId}`)
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'messages' },
      (payload) => {
        setMessages(prev => [...prev, payload.new]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [groupId]);
```

## 🚀 Démarrage Rapide

### Installation
```bash
# Cloner le repo
git clone https://github.com/VOTRE-ORG/teambuilding-app.git
cd teambuilding-app

# Installer les dépendances
npm install

# Copier le .env
cp .env.example .env.local
# Éditer .env.local avec vos clés Supabase/Clerk
```

### Variables d'environnement
```bash
# .env.local
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_API_URL=http://localhost:8080 # Backend Spring (optionnel)
```

### Lancer l'app
```bash
# Development
npx expo start

# Spécifique plateforme
npx expo start --ios
npx expo start --android
npx expo start --web

# Clear cache si problème
npx expo start -c
```

## 📱 Navigation (Expo Router)

### File-based routing
```typescript
app/
├── (tabs)/index.tsx     → /              (Feed)
├── (tabs)/groups.tsx    → /groups        (Groupes)
├── group/[id].tsx       → /group/123     (Chat)
└── event/[id].tsx       → /event/456     (Détail)
```

### Navigation programmatique
```typescript
import { router } from 'expo-router';

// Navigation simple
router.push('/groups');

// Navigation avec params
router.push(`/group/${groupId}`);

// Retour
router.back();

// Récupérer params
import { useLocalSearchParams } from 'expo-router';
const { id } = useLocalSearchParams();
```

## 🗄️ Intégration Backend

### Supabase (Direct - recommandé pour CRUD simple)
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

// Usage dans composant
const { data: events } = await supabase
  .from('events')
  .select('*')
  .order('created_at', { ascending: false });
```

### Spring API (Pour logique métier complexe)
```typescript
// lib/api.ts
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function createEvent(event: NewEvent) {
  const response = await fetch(`${API_URL}/api/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getClerkToken()}`
    },
    body: JSON.stringify(event)
  });
  return response.json();
}
```

## 🔐 Authentification (Clerk)

### Setup dans _layout.tsx
```typescript
import { ClerkProvider } from '@clerk/clerk-expo';

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <QueryClientProvider client={queryClient}>
        <Stack />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
```

### Utilisation
```typescript
import { useAuth, useUser } from '@clerk/clerk-expo';

function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <View>
      <Text>{user?.emailAddresses[0].emailAddress}</Text>
      <Button onPress={() => signOut()}>Déconnexion</Button>
    </View>
  );
}
```

## 📦 Commandes Utiles
```bash
# Développement
npm start                    # Expo dev server
npm run ios                  # iOS simulator
npm run android              # Android emulator
npm run web                  # Web browser

# Type checking
npm run typecheck           # tsc --noEmit

# Linting (à ajouter si besoin)
npm run lint                # eslint

# Build
npx expo export             # Export pour prod
eas build --platform all    # EAS Build (iOS + Android)

# Supabase
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.types.ts

# Clear
npx expo start -c           # Clear cache
rm -rf node_modules .expo   # Hard reset
```

## 🎯 Features Principales

### 1. Feed Événements
- **Fichier:** `app/(tabs)/index.tsx`
- **Composants:** `EventCard`, `EventList`
- **Data:** Supabase `events` table
- **Features:**
    - Liste événements
    - Création événement
    - Filtrage par date

### 2. Groupes & Chat
- **Fichier:** `app/(tabs)/groups.tsx`, `app/group/[id].tsx`
- **Composants:** `GroupCard`, `MessageBubble`
- **Data:** Supabase `groups`, `messages` tables
- **Features:**
    - Liste groupes
    - Chat temps réel (Supabase Realtime)
    - Envoi messages

### 3. Profil
- **Fichier:** `app/(tabs)/profile.tsx`
- **Data:** Clerk user + Supabase `profiles`
- **Features:**
    - Infos utilisateur
    - Édition profil
    - Statistiques

## 🐛 Debugging

### Expo Dev Tools
```bash
# Ouvrir dev tools
npx expo start
# Puis presser 'm' pour ouvrir menu

# Logs
npx expo start --tunnel    # Expose via ngrok (test mobile réel)
```

### React Query Devtools (Web uniquement)
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Dans _layout.tsx
{Platform.OS === 'web' && <ReactQueryDevtools />}
```

### Supabase Logs
```bash
# Voir dans Supabase Dashboard
# Logs > Postgres Logs
# Realtime > Channels Inspector
```

## 📊 Performance

### Optimisations Images
```typescript
// ✅ DO: Utiliser expo-image (optimisé)
import { Image } from 'expo-image';

<Image 
  source={{ uri: url }}
  contentFit="cover"
  transition={200}
/>

// ❌ DON'T: React Native Image basique
import { Image } from 'react-native'; // ❌
```

### Lazy Loading
```typescript
// ✅ DO: FlatList pour longues listes
<FlatList
  data={events}
  renderItem={({ item }) => <EventCard event={item} />}
  keyExtractor={item => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
/>

// ❌ DON'T: map() pour >20 items
{events.map(event => <EventCard />)} // ❌
```

## 🚀 Déploiement

### Vercel (Web)
```bash
# Dans le projet
vercel

# Avec env vars
vercel --prod
```

### EAS Build (Mobile)
```bash
# Installer EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build iOS + Android
eas build --platform all

# Submit aux stores
eas submit --platform ios
eas submit --platform android
```

## 🤖 Prompts IA Recommandés

### Pour créer un nouveau composant
```
Crée un composant React Native TypeScript pour [DESCRIPTION]
- Utilise NativeWind (Tailwind)
- Props typées avec type alias
- Gestion loading et error states
- Accessible (a11y)
```

### Pour débugger
```
J'ai cette erreur dans mon app Expo React Native:
[COLLER L'ERREUR]

Contexte:
- Expo Router
- NativeWind
- Supabase

Aide-moi à résoudre en expliquant la cause.
```

## 📚 Ressources

- [Expo Docs](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [NativeWind](https://www.nativewind.dev/)
- [Clerk Expo](https://clerk.com/docs/quickstarts/expo)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [React Query](https://tanstack.com/query/latest)

## 👥 Équipe

- Dev 1: Frontend (Feed + Events)
- Dev 2: Frontend (Groups + Chat)
- Dev 3: Backend (Spring API)
- Dev 4: DevOps + Full-stack

## 🔄 Workflow Git
```bash
# Créer une branche feature
git checkout -b feature/event-creation

# Commit fréquents
git add .
git commit -m "feat: add event creation form"

# Push
git push origin feature/event-creation

# Merge (fast-forward pour hackathon)
git checkout main
git merge feature/event-creation
```

## ⚠️ Points d'attention Hackathon

1. **Prioriser MVP** - Features essentielles d'abord
2. **Mock data OK** - Si backend pas prêt, utiliser `/mock/data.ts`
3. **Déployer tôt** - Vercel dès H2-H4 pour tester
4. **Types après** - Commenter `@ts-ignore` si blocage, fix après
5. **UI simple** - Fonctionnel > Beau (mais avec NativeWind c'est rapide)

## 🎉 Checklist MVP (H12)

- [ ] Login/Logout (Clerk) fonctionne
- [ ] Liste événements visible (Supabase ou mock)
- [ ] Création événement basique
- [ ] Liste groupes visible
- [ ] Chat groupe avec messages temps réel
- [ ] Profil utilisateur (lecture)
- [ ] **Fonctionne sur mobile (Expo Go) ET web**

---

**Dernière mise à jour:** 30 janvier 2026
**Version:** 1.0.0 (Hackathon MVP)