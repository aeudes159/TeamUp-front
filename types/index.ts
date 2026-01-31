/**
 * Core Types for TeamUp Application
 * 
 * These types are used throughout the frontend application.
 * They are designed to match the backend DTOs while providing
 * a clean interface for UI components.
 */

// Re-export API types for convenience
export type {
  PaginatedResponse,
  PaginationParams,
  UserResponse,
  UserCreateRequest,
  UserUpdateRequest,
  UserListResponse,
  GroupResponse,
  GroupCreateRequest,
  GroupUpdateRequest,
  GroupListResponse,
  MessageResponse,
  MessageCreateRequest,
  MessageUpdateRequest,
  MessageListResponse,
  DiscussionResponse,
  DiscussionCreateRequest,
  DiscussionUpdateRequest,
  DiscussionListResponse,
  PostResponse,
  PostCreateRequest,
  PostUpdateRequest,
  PostListResponse,
  ProposalResponse,
  ProposalCreateRequest,
  ProposalUpdateRequest,
  ProposalListResponse,
  LocationResponse,
  LocationCreateRequest,
  LocationUpdateRequest,
  LocationListResponse,
} from './api';

// ============================================
// User Types (aligned with backend UserResponse)
// ============================================

export type User = {
  id: number | null;
  firstName: string | null;
  lastName: string | null;
  age: number | null;
  phoneNumber: string | null;
  address: string | null;
  profilePictureUrl: string | null;
};

export type NewUser = {
  firstName?: string;
  lastName?: string;
  age?: number;
  phoneNumber?: string;
  address?: string;
  profilePictureUrl?: string;
};

// ============================================
// Group Types (aligned with backend GroupResponse)
// ============================================

export type Group = {
  id: number | null;
  name: string;
  coverPictureUrl: string | null;
  createdAt: string | null;
  isPublic: boolean;
};

export type NewGroup = {
  name: string;
  coverPictureUrl?: string;
  isPublic: boolean;
};

// ============================================
// Message Types (aligned with backend MessageResponse)
// ============================================

export type Message = {
  id: number | null;
  content: string | null;
  imageUrl: string | null;
  sentAt: string | null;
  senderId: number | null;
  discussionId: number | null;
};

export type NewMessage = {
  content?: string;
  imageUrl?: string;
  senderId?: number;
  discussionId?: number;
};

// ============================================
// Discussion Types (aligned with backend DiscussionResponse)
// ============================================

export type Discussion = {
  id: number | null;
  name: string | null;
  createdAt: string | null;
  groupId: number | null;
};

export type NewDiscussion = {
  name?: string;
  groupId?: number;
};

// ============================================
// Event Types (TODO: Backend endpoint coming soon)
// ============================================

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

// ============================================
// Post Types (aligned with backend PostResponse)
// ============================================

export type Post = {
  id: number | null;
  title: string | null;
  content: string | null;
  imageUrl: string | null;
  createdAt: string | null;
  authorId: number | null;
};

export type NewPost = {
  title?: string;
  content?: string;
  imageUrl?: string;
  authorId?: number;
};

// ============================================
// Proposal Types (aligned with backend ProposalResponse)
// ============================================

export type Proposal = {
  id: number | null;
  title: string | null;
  description: string | null;
  createdAt: string | null;
  discussionId: number | null;
  authorId: number | null;
};

export type NewProposal = {
  title?: string;
  description?: string;
  discussionId?: number;
  authorId?: number;
};

// ============================================
// Component Props Types
// ============================================

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
  senderName?: string;
  senderAvatar?: string;
};
