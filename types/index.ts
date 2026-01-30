// Types de base pour l'application

export type User = {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  bio?: string;
  created_at?: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  event_date: string;
  location: string;
  max_participants: number;
  created_by: string;
  created_at: string;
};

export type NewEvent = Omit<Event, 'id' | 'created_at'>;

export type Group = {
  id: string;
  name: string;
  description: string;
  event_id: string;
  member_count: number;
  created_at?: string;
};

export type Message = {
  id: string;
  group_id: string;
  user_id: string;
  username: string;
  avatar_url: string;
  content: string;
  created_at: string;
};

export type NewMessage = Omit<Message, 'id' | 'created_at'>;

// Types pour les composants
export type EventCardProps = {
  event: Event;
  onPress?: () => void;
};

export type GroupCardProps = {
  group: Group;
  onPress?: () => void;
};

export type MessageBubbleProps = {
  message: Message;
  isCurrentUser: boolean;
};
