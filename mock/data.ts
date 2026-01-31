import type { Post, User, Location } from '@/types';

export const mockUser = {
    id: '1',
    username: 'Jean Dupont',
    email: 'jean@example.com',
    avatar_url: 'https://i.pravatar.cc/150?img=1',
    bio: 'Passionné de team building et innovation'
};

// Mock users for posts (matching backend User entity)
export const mockUsers: User[] = [
    {
        id: 1,
        firstName: 'Jean',
        lastName: 'Dupont',
        age: 32,
        phoneNumber: '+33612345678',
        address: 'Paris 15ème',
        profilePictureUrl: 'https://i.pravatar.cc/150?img=1',
    },
    {
        id: 2,
        firstName: 'Marie',
        lastName: 'Martin',
        age: 28,
        phoneNumber: '+33698765432',
        address: 'Paris 11ème',
        profilePictureUrl: 'https://i.pravatar.cc/150?img=5',
    },
    {
        id: 3,
        firstName: 'Thomas',
        lastName: 'Bernard',
        age: 35,
        phoneNumber: '+33611223344',
        address: 'Lyon',
        profilePictureUrl: 'https://i.pravatar.cc/150?img=3',
    },
];

// Mock locations for posts
export const mockLocations: Location[] = [
    {
        id: 1,
        name: 'Escape Game Paris',
        address: '15 Rue de la Pompe, 75015 Paris',
        averagePrice: 25,
        pictureUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    },
    {
        id: 2,
        name: 'Bois de Boulogne',
        address: 'Bois de Boulogne, 75016 Paris',
        averagePrice: 0,
        pictureUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
    },
    {
        id: 3,
        name: 'Bureaux Takima',
        address: '42 Avenue des Champs-Élysées, 75008 Paris',
        averagePrice: 0,
        pictureUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
    },
];

// Mock posts (matching backend Post entity)
export const mockPosts: Post[] = [
    {
        id: 1,
        content: 'Incroyable session d\'escape game avec l\'équipe ! On a réussi à sortir en 45 minutes. Prochaine fois on bat le record !',
        imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
        postedAt: '2026-01-30T14:30:00Z',
        authorId: 1,
        locationId: 1,
        discussionId: null,
    },
    {
        id: 2,
        content: 'Course d\'orientation au Bois de Boulogne - 5km parcourus et des fous rires garantis ! L\'équipe rouge a encore gagné.',
        imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
        postedAt: '2026-01-29T16:00:00Z',
        authorId: 2,
        locationId: 2,
        discussionId: null,
    },
    {
        id: 3,
        content: 'Atelier créatif au bureau - brainstorming sur notre prochain projet. Des idées géniales ont émergé !',
        imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
        postedAt: '2026-01-28T11:00:00Z',
        authorId: 3,
        locationId: 3,
        discussionId: null,
    },
    {
        id: 4,
        content: 'Petit déjeuner d\'équipe ce matin. Rien de tel pour bien commencer la semaine !',
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
        postedAt: '2026-01-27T09:15:00Z',
        authorId: 1,
        locationId: 3,
        discussionId: null,
    },
];

// Legacy mock events (deprecated - use mockPosts instead)
export const mockEvents = [
    {
        id: '1',
        title: '🎯 Escape Game Géant',
        description: 'Résolvez des énigmes en équipe dans notre escape game sur mesure !',
        image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
        event_date: '2026-02-15T14:00:00Z',
        location: 'Paris 15ème',
        max_participants: 30,
        created_by: mockUser.id,
        created_at: '2026-01-20T10:00:00Z'
    },
    {
        id: '2',
        title: '🏃 Course d\'Orientation',
        description: 'Défi sportif et stratégique dans le Bois de Boulogne',
        image_url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
        event_date: '2026-02-20T10:00:00Z',
        location: 'Bois de Boulogne',
        max_participants: 50,
        created_by: mockUser.id,
        created_at: '2026-01-22T09:00:00Z'
    },
    {
        id: '3',
        title: '🎨 Atelier Créatif',
        description: 'Session de créativité collective et brainstorming',
        image_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
        event_date: '2026-02-25T16:00:00Z',
        location: 'Bureaux Paris',
        max_participants: 20,
        created_by: mockUser.id,
        created_at: '2026-01-25T11:00:00Z'
    }
];

export const mockGroups = [
    {
        id: '1',
        name: 'Équipe Rouge 🔴',
        description: 'Les stratèges',
        event_id: '1',
        member_count: 8
    },
    {
        id: '2',
        name: 'Équipe Bleue 🔵',
        description: 'Les créatifs',
        event_id: '1',
        member_count: 7
    },
    {
        id: '3',
        name: 'Équipe Verte 🟢',
        description: 'Les rapides',
        event_id: '2',
        member_count: 10
    }
];

export const mockMessages = [
    {
        id: '1',
        group_id: '1',
        user_id: '1',
        username: 'Jean',
        avatar_url: 'https://i.pravatar.cc/150?img=1',
        content: 'Salut l\'équipe ! On se retrouve à 14h ?',
        created_at: '2026-01-30T10:30:00Z'
    },
    {
        id: '2',
        group_id: '1',
        user_id: '2',
        username: 'Marie',
        avatar_url: 'https://i.pravatar.cc/150?img=5',
        content: 'Parfait ! J\'apporte les snacks 🍪',
        created_at: '2026-01-30T10:32:00Z'
    },
    {
        id: '3',
        group_id: '1',
        user_id: '3',
        username: 'Thomas',
        avatar_url: 'https://i.pravatar.cc/150?img=3',
        content: 'Super, on va tout déchirer ! 💪',
        created_at: '2026-01-30T10:35:00Z'
    }
];