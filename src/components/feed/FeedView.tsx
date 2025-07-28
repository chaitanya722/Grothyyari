import React from 'react';
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { VideoReel } from './VideoReel';
import { CreatePost } from '../content/CreatePost';
import { ConnectionRequest } from '../connections/ConnectionRequest';
import { VideoReel as VideoReelType, User, Post } from '../../types';
import { apiClient } from '../../config/api';

interface FeedViewProps {
  onBookSession: (userId: string) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({ onBookSession }) => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showConnectionRequest, setShowConnectionRequest] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Mock video reels data
  const videoReels: VideoReelType[] = [
    {
      id: '1',
      userId: '1',
      user: {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        profession: 'UX Designer',
        expertise: ['User Experience', 'Design Systems', 'Prototyping'],
        rating: 4.9,
        reviewCount: 42,
        isVerified: true,
        bio: 'Senior UX Designer with 8+ years experience'
      },
      title: '5 UX Principles Every Designer Should Know',
      description: 'In this quick reel, I share the top 5 UX principles that have transformed my design process and helped me create better user experiences.',
      videoUrl: 'https://example.com/video1.mp4',
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
      likes: 1234,
      views: 15600,
      comments: 89,
      createdAt: new Date('2024-01-15'),
      tags: ['UX', 'Design', 'Tips']
    },
    {
      id: '2',
      userId: '2',
      user: {
        id: '2',
        name: 'Mike Chen',
        email: 'mike@example.com',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        profession: 'Product Manager',
        expertise: ['Product Strategy', 'Agile', 'Data Analysis'],
        rating: 4.7,
        reviewCount: 28,
        isVerified: true,
        bio: 'Product Manager at tech startup'
      },
      title: 'How to Prioritize Features Like a Pro',
      description: 'Learn my proven framework for feature prioritization that has helped me launch successful products at scale.',
      videoUrl: 'https://example.com/video2.mp4',
      thumbnail: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
      likes: 856,
      views: 12300,
      comments: 67,
      createdAt: new Date('2024-01-14'),
      tags: ['Product', 'Strategy', 'Prioritization']
    },
    {
      id: '3',
      userId: '3',
      user: {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily@example.com',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        profession: 'Marketing Director',
        expertise: ['Digital Marketing', 'Brand Strategy', 'Content Marketing'],
        rating: 4.8,
        reviewCount: 35,
        isVerified: true,
        bio: 'Marketing Director with growth focus'
      },
      title: 'Building a Personal Brand on Social Media',
      description: 'Step-by-step guide to building an authentic personal brand that attracts opportunities and grows your network.',
      videoUrl: 'https://example.com/video3.mp4',
      thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
      likes: 2100,
      views: 28400,
      comments: 156,
      createdAt: new Date('2024-01-13'),
      tags: ['Marketing', 'Personal Brand', 'Social Media']
    }
  ];

  // Load feed data
  useEffect(() => {
    const loadFeed = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiClient.getFeed(page);
        if (result.success && result.data) {
          if (page === 1) {
            setPosts(result.data.posts);
          } else {
            setPosts(prev => [...prev, ...result.data.posts]);
          }
        } else {
          setError(result.error || 'Failed to load feed');
        }
      } catch (error) {
        setError('Failed to load feed');
        console.error('Feed load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, [page]);

  const handleLike = (reelId: string) => {
    // Handle like functionality
    console.log('Liked reel:', reelId);
  };

  const handleCreatePost = (postData: { type: 'video' | 'thought' | 'image'; content: string; caption?: string; tags: string[] }) => {
    const createPost = async () => {
      try {
        const result = await apiClient.createPost(postData);
        if (result.success && result.data) {
          setPosts(prev => [result.data.post, ...prev]);
          setShowCreatePost(false);
        } else {
          console.error('Failed to create post:', result.error);
        }
      } catch (error) {
        console.error('Post creation error:', error);
      }
    };

    createPost();
  };

  const handleConnect = (user: User) => {
    setSelectedUser(user);
    setShowConnectionRequest(true);
  };

  const handleSendConnectionRequest = (userId: string, message: string, requestFreeCall: boolean) => {
    const sendRequest = async () => {
      try {
        const result = await apiClient.sendConnectionRequest(userId, message);
        if (result.success) {
          console.log('Connection request sent successfully');
        }
      } catch (error) {
        console.error('Failed to send connection request:', error);
      }
    };
    sendRequest();
    setShowConnectionRequest(false);
    setSelectedUser(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Professional Insights</h2>
            <p className="text-sm sm:text-base text-gray-600">Discover expert knowledge and connect with industry leaders</p>
          </div>
          <button
            onClick={() => setShowCreatePost(true)}
            className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Create Post</span>
            <span className="sm:hidden">Post</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
          <button onClick={() => setPage(1)} className="text-red-700 underline text-sm mt-2">
            Try again
          </button>
        </div>
      )}

      {/* User's Posts */}
      {posts.length > 0 && (
        <div className="space-y-6 mb-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={post.user.avatar}
                    alt={post.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                    <p className="text-sm text-gray-600">{post.user.profession}</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-auto">
                    {post.createdAt.toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-800">{post.content}</p>
                  {post.caption && (
                    <p className="text-gray-600 mt-2">{post.caption}</p>
                  )}
                </div>
                
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                    <span>{post.shares} shares</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      )}

      <div className="space-y-8">
        {videoReels.map((reel) => (
          <VideoReel
            key={reel.id}
            reel={reel}
            onLike={handleLike}
            onBookSession={onBookSession}
            onConnect={handleConnect}
          />
        ))}
      </div>

      {/* Modals */}
      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          onCreatePost={handleCreatePost}
        />
      )}

      {showConnectionRequest && selectedUser && (
        <ConnectionRequest
          user={selectedUser}
          onClose={() => setShowConnectionRequest(false)}
          onSendRequest={handleSendConnectionRequest}
        />
      )}
    </div>
  );
};