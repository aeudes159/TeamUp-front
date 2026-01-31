/**
 * API Request and Response Types
 * 
 * These types match the Kotlin backend DTOs from TeamUp-back
 */

// ============================================
// Generic Paginated Response
// ============================================

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  size: number;
};

// ============================================
// User Types (matches UserDto.kt)
// ============================================

export type UserCreateRequest = {
  firstName?: string;
  lastName?: string;
  age?: number;
  phoneNumber?: string;
  address?: string;
  profilePictureUrl?: string;
};

export type UserUpdateRequest = {
  firstName?: string;
  lastName?: string;
  age?: number;
  phoneNumber?: string;
  address?: string;
  profilePictureUrl?: string;
};

export type UserResponse = {
  id: number | null;
  firstName: string | null;
  lastName: string | null;
  age: number | null;
  phoneNumber: string | null;
  address: string | null;
  profilePictureUrl: string | null;
};

export type UserListResponse = PaginatedResponse<UserResponse>;

// ============================================
// Group Types (matches GroupDto.kt)
// ============================================

export type GroupCreateRequest = {
  name: string;
  coverPictureUrl?: string;
  isPublic: boolean;
};

export type GroupUpdateRequest = {
  name?: string;
  coverPictureUrl?: string;
  isPublic?: boolean;
};

export type GroupResponse = {
  id: number | null;
  name: string;
  coverPictureUrl: string | null;
  createdAt: string | null;
  isPublic: boolean;
};

export type GroupListResponse = PaginatedResponse<GroupResponse>;

// ============================================
// Message Types (matches MessageDto.kt)
// ============================================

export type MessageCreateRequest = {
  content?: string;
  imageUrl?: string;
  senderId?: number;
  discussionId?: number;
};

export type MessageUpdateRequest = {
  content?: string;
  imageUrl?: string;
};

export type MessageResponse = {
  id: number | null;
  content: string | null;
  imageUrl: string | null;
  sentAt: string | null;
  senderId: number | null;
  discussionId: number | null;
};

export type MessageListResponse = PaginatedResponse<MessageResponse>;

// ============================================
// Discussion Types (matches DiscussionDto.kt)
// ============================================

export type DiscussionCreateRequest = {
  name?: string;
  groupId?: number;
};

export type DiscussionUpdateRequest = {
  name?: string;
};

export type DiscussionResponse = {
  id: number | null;
  name: string | null;
  createdAt: string | null;
  groupId: number | null;
};

export type DiscussionListResponse = PaginatedResponse<DiscussionResponse>;

// ============================================
// Post Types (matches PostDto.kt)
// ============================================

export type PostCreateRequest = {
  title?: string;
  content?: string;
  imageUrl?: string;
  authorId?: number;
};

export type PostUpdateRequest = {
  title?: string;
  content?: string;
  imageUrl?: string;
};

export type PostResponse = {
  id: number | null;
  title: string | null;
  content: string | null;
  imageUrl: string | null;
  createdAt: string | null;
  authorId: number | null;
};

export type PostListResponse = PaginatedResponse<PostResponse>;

// ============================================
// Proposal Types (matches ProposalDto.kt)
// ============================================

export type ProposalCreateRequest = {
  title?: string;
  description?: string;
  discussionId?: number;
  authorId?: number;
};

export type ProposalUpdateRequest = {
  title?: string;
  description?: string;
};

export type ProposalResponse = {
  id: number | null;
  title: string | null;
  description: string | null;
  createdAt: string | null;
  discussionId: number | null;
  authorId: number | null;
};

export type ProposalListResponse = PaginatedResponse<ProposalResponse>;

// ============================================
// Location Types (matches LocationDto.kt)
// ============================================

export type LocationCreateRequest = {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
};

export type LocationUpdateRequest = {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
};

export type LocationResponse = {
  id: number | null;
  name: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type LocationListResponse = PaginatedResponse<LocationResponse>;

// ============================================
// Pagination Params
// ============================================

export type PaginationParams = {
  page?: number;
  size?: number;
};
