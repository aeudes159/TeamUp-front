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
  ActivityFeedResponse,
  ActivityFeedCreateRequest,
  ActivityFeedUpdateRequest,
  ActivityFeedListResponse,
  ActivityFeedWithPostsResponse,
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
// Post Types (aligned with backend PostResponse)
// ============================================

export type Post = {
  id: number | null;
  content: string | null;
  imageUrl: string | null;
  postedAt: string | null;
  authorId: number | null;
  locationId: number | null;
  discussionId: number | null;
};

export type NewPost = {
  content?: string;
  imageUrl?: string;
  authorId?: number;
  locationId?: number;
  discussionId?: number;
};

// ============================================
// ActivityFeed Types (aligned with backend ActivityFeedResponse)
// ============================================

export type ActivityFeed = {
  id: number | null;
};

export type ActivityFeedWithPosts = {
  id: number | null;
  posts: Post[];
};

export type NewActivityFeed = {
  // ActivityFeed is created empty, posts are added via the join table
};

// ============================================
// Location Types (aligned with backend LocationResponse)
// ============================================

export type Location = {
  id: number | null;
  name: string | null;
  address: string | null;
  averagePrice: number | null;
  pictureUrl: string | null;
};

export type NewLocation = {
  name?: string;
  address?: string;
  averagePrice?: number;
  pictureUrl?: string;
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

export type PostCardProps = {
  post: Post;
  author?: User;
  location?: Location;
  onPress?: () => void;
};

export type ActivityFeedListProps = {
  posts: Post[];
  onPostPress?: (post: Post) => void;
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
