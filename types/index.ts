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
  LocationSort,
  LocationQueryParams,
  RatingResponse,
  RatingCreateRequest,
  RatingUpdateRequest,
  RatingListResponse,
  GroupMemberResponse,
  GroupMemberCreateRequest,
  GroupMemberListResponse,
  ReactionResponse,
  ReactionCreateRequest,
  ReactionListResponse,
  PollCreateRequest,
  PollUpdateRequest,
  PollOptionCreateRequest,
  PollVoteCreateRequest,
  PollVoteResponse,
  PollOptionResponse,
  PollResponse,
  PollListResponse,
  PollOptionListResponse,
  PollVoteListResponse,
} from './api';

// ============================================
// Comment Types
// ============================================

export type Comment = {
  id: number;
  content: string;
  authorId: number;
  targetId: number; // postId or locationId
  targetType: 'post' | 'location';
  createdAt: string;
  author?: {
      firstName: string;
      lastName: string;
      profilePictureUrl?: string;
  }
};

export type NewComment = {
  content: string;
  targetId: number;
  targetType: 'post' | 'location';
  authorId: number;
};

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
  description?: string;
  memberCount?: number;
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
  groupId: number | null;
  backgroundImageUrl: string | null;
  createdAt: string | null;
};

export type NewDiscussion = {
  groupId?: number;
  backgroundImageUrl?: string;
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

// Note: We don't use `export type { LocationResponse as Location }` because
// `Location` conflicts with the browser's global Location type in web environments.
// Instead, we define the type explicitly here, matching LocationResponse from api.ts.
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
  discussionId: number | null;
  createdAt: string | null;
};

export type NewProposal = {
  discussionId?: number;
};

// ============================================
// Rating Types (aligned with backend RatingResponse)
// ============================================

export type Rating = {
  id: number | null;
  ratingValue: number | null;
  userId: number | null;
  locationId: number | null;
  createdAt: string | null;
};

export type NewRating = {
  ratingValue?: number;
  userId?: number;
  locationId?: number;
};

// ============================================
// GroupMember Types (aligned with backend GroupMemberResponse)
// ============================================

export type GroupMember = {
  groupId: number;
  userId: number;
  joinedAt: string | null;
};

export type NewGroupMember = {
  groupId: number;
  userId: number;
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
  onLongPress?: () => void;
  reactions?: Reaction[];
  onReactionPress?: (emoji: string) => void;
};

export type Reaction = {
  id: number | null;
  emoji: string;
  userId: number;
  messageId: number;
  createdAt: string | null;
};

export type NewReaction = {
  emoji: string;
  userId: number;
  messageId: number;
};

// ============================================
// Poll Types (aligned with backend PollDto)
// ============================================

export type Poll = {
  id: number | null;
  title: string;
  description: string | null;
  discussionId: number | null;
  creatorId: number | null;
  createdAt: string | null;
  isActive: boolean;
  closedAt: string | null;
  options: PollOption[];
  totalVotes: number;
};

export type PollOption = {
  id: number | null;
  pollId: number | null;
  locationId: number | null;
  locationName: string | null;
  locationAddress: string | null;
  locationPictureUrl: string | null;
  addedByUserId: number | null;
  createdAt: string | null;
  voteCount: number;
  voters: PollVote[];
};

export type PollVote = {
  id: number | null;
  pollOptionId: number | null;
  userId: number | null;
  createdAt: string | null;
};

export type NewPoll = {
  title: string;
  description?: string;
  discussionId: number;
  creatorId: number;
};

export type NewPollOption = {
  pollId: number;
  locationId: number;
  addedByUserId: number;
};

export type NewPollVote = {
  pollOptionId: number;
  userId: number;
};

// ============================================
// Poll Component Props Types
// ============================================

export type PollCardProps = {
  poll: Poll;
  currentUserId: number;
  onVote: (optionId: number) => void;
  onRemoveVote: (optionId: number) => void;
  onAddOption: (pollId: number) => void;
};
