// Core types for the GrowthYari platform
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  profession?: string;
  expertise: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  location?: string;
  experience?: string;
  field?: string;
}

export interface VideoReel {
  id: string;
  userId: string;
  user: User;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  likes: number;
  views: number;
  comments: number;
  createdAt: Date;
  tags: string[];
}

export interface Session {
  id: string;
  expertId: string;
  clientId: string;
  expert: User;
  client: User;
  title: string;
  description: string;
  duration: number; // in minutes
  price: number; // 0 for free sessions
  scheduledAt: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meetingLink?: string;
  notes?: string;
}

export interface Review {
  id: string;
  sessionId: string;
  reviewerId: string;
  revieweeId: string;
  reviewer: User;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface BookingSlot {
  id: string;
  expertId: string;
  date: Date;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  price: number;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  type: 'video' | 'thought' | 'image';
  content: string;
  caption?: string;
  mediaUrl?: string;
  thumbnail?: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  tags: string[];
}

export interface ConnectionRequest {
  id: string;
  senderId: string;
  receiverId: string;
  sender: User;
  receiver: User;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

export interface Connection {
  id: string;
  userId1: string;
  userId2: string;
  user1: User;
  user2: User;
  connectedAt: Date;
}

// YariConnect types
export interface YariConnectSession {
  id: string;
  user1Id: string;
  user2Id: string;
  user1: User;
  user2: User;
  startedAt: Date;
  endedAt?: Date;
  duration: number; // in seconds
  status: 'active' | 'ended';
}

export interface YariConnectFilters {
  jobProfile: string;
  field: string;
  location: string;
  experience: string;
  availability: string;
}