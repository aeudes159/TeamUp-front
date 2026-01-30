export const mockUser = {
    id: '1',
    username: 'Jean Dupont',
    email: 'jean@example.com',
    avatar_url: 'https://i.pravatar.cc/150?img=1',
    bio: 'Passionné de team building et innovation'
};

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