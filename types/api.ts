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
  groupId?: number;
  backgroundImageUrl?: string;
};

export type DiscussionUpdateRequest = {
  groupId?: number;
  backgroundImageUrl?: string;
};

export type DiscussionResponse = {
  id: number | null;
  groupId: number | null;
  backgroundImageUrl: string | null;
  createdAt: string | null;
};

export type DiscussionListResponse = PaginatedResponse<DiscussionResponse>;

// ============================================
// Post Types (matches PostDto.kt)
// ============================================

export type PostCreateRequest = {
  content?: string;
  imageUrl?: string;
  authorId?: number;
  locationId?: number;
  discussionId?: number;
};

export type PostUpdateRequest = {
  content?: string;
  imageUrl?: string;
  locationId?: number;
};

export type PostResponse = {
  id: number | null;
  content: string | null;
  imageUrl: string | null;
  postedAt: string | null;
  authorId: number | null;
  locationId: number | null;
  discussionId: number | null;
};

export type PostListResponse = PaginatedResponse<PostResponse>;

// ============================================
// ActivityFeed Types (matches ActivityFeedDto.kt)
// ============================================

export type ActivityFeedCreateRequest = {
  // ActivityFeed is created empty, posts are added via activity_feed_post
};

export type ActivityFeedUpdateRequest = {
  // ActivityFeed updates are handled via the join table
};

export type ActivityFeedResponse = {
  id: number | null;
};

export type ActivityFeedListResponse = PaginatedResponse<ActivityFeedResponse>;

// ActivityFeed with posts (for detailed view)
export type ActivityFeedWithPostsResponse = {
  id: number | null;
  posts: PostResponse[];
};

// ============================================
// Proposal Types (matches ProposalDto.kt)
// ============================================

export type ProposalCreateRequest = {
  discussionId?: number;
};

export type ProposalUpdateRequest = {
  discussionId?: number;
};

export type ProposalResponse = {
  id: number | null;
  discussionId: number | null;
  createdAt: string | null;
};

export type ProposalListResponse = PaginatedResponse<ProposalResponse>;

// ============================================
// Location Types (matches LocationDto.kt)
// ============================================

export type LocationCreateRequest = {
  name?: string;
  address?: string;
  averagePrice?: number;
  pictureUrl?: string;
};

export type LocationUpdateRequest = {
  name?: string;
  address?: string;
  averagePrice?: number;
  pictureUrl?: string;
};

export type LocationResponse = {
  id: number | null;
  name: string | null;
  address: string | null;
  averagePrice: number | null;
  pictureUrl: string | null;
};

export type LocationListResponse = PaginatedResponse<LocationResponse>;

// ============================================
// Pagination Params
// ============================================

export type PaginationParams = {
  page?: number;
  size?: number;
};

// ============================================
// Rating Types (matches RatingDto.kt)
// ============================================

export type RatingCreateRequest = {
  ratingValue?: number;
  userId?: number;
  locationId?: number;
};

export type RatingUpdateRequest = {
  ratingValue?: number;
};

export type RatingResponse = {
  id: number | null;
  ratingValue: number | null;
  userId: number | null;
  locationId: number | null;
  createdAt: string | null;
};

export type RatingListResponse = PaginatedResponse<RatingResponse>;

// ============================================
// GroupMember Types (matches GroupMemberDto.kt)
// ============================================

export type GroupMemberCreateRequest = {
  groupId: number;
  userId: number;
};

export type GroupMemberResponse = {
  groupId: number;
  userId: number;
  joinedAt: string | null;
};

export type GroupMemberListResponse = PaginatedResponse<GroupMemberResponse>;

export type ReactionCreateRequest = {
  emoji: string;
  userId: number;
  messageId: number;
};

export type ReactionResponse = {
  id: number | null;
  emoji: string;
  userId: number;
  messageId: number;
  createdAt: string | null;
};

export type ReactionListResponse = PaginatedResponse<ReactionResponse>;
