import React, { useState } from 'react';
import { useEffect } from 'react';
import { Search, Filter, Users, Star, MapPin, Briefcase, Clock, Video } from 'lucide-react';
import { User } from '../../types';
import { apiClient } from '../../config/api';

interface SearchViewProps {
  onBookSession: (userId: string) => void;
  onConnect: (user: User) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ onBookSession, onConnect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [rating, setRating] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [professionals, setProfessionals] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Categories', icon: Users },
    { id: 'business-coach', name: 'Business Coach', icon: Briefcase },
    { id: 'tech-developer', name: 'Tech Developer', icon: Users },
    { id: 'designer', name: 'Designer', icon: Users },
    { id: 'marketing', name: 'Marketing', icon: Users },
    { id: 'product-manager', name: 'Product Manager', icon: Users },
    { id: 'consultant', name: 'Consultant', icon: Users },
    { id: 'entrepreneur', name: 'Entrepreneur', icon: Users },
    { id: 'data-scientist', name: 'Data Scientist', icon: Users },
    { id: 'sales', name: 'Sales Expert', icon: Users }
  ];

  const expertiseAreas = [
    'All Expertise',
    'Strategy & Planning',
    'Leadership Development',
    'Business Growth',
    'Digital Transformation',
    'Product Development',
    'User Experience',
    'Frontend Development',
    'Backend Development',
    'Mobile Development',
    'DevOps & Cloud',
    'Data Analysis',
    'Machine Learning',
    'Digital Marketing',
    'Content Strategy',
    'Brand Development',
    'Social Media',
    'SEO & SEM',
    'Sales Strategy',
    'Customer Success',
    'Financial Planning',
    'Investment Strategy',
    'Startup Funding',
    'Team Building',
    'Project Management',
    'Agile & Scrum',
    'Design Thinking',
    'Innovation',
    'Brainstorming & Ideation',
    'Problem Solving',
    'Communication Skills',
    'Public Speaking',
    'Negotiation',
    'Career Development'
  ];

  // Load professionals from API
  useEffect(() => {
    const searchProfessionals = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params: any = {};
        if (searchQuery) params.q = searchQuery;
        if (selectedCategory !== 'all') params.profession = selectedCategory.replace('-', ' ');
        if (selectedExpertise !== 'all') params.expertise = selectedExpertise;
        if (rating !== 'all') params.rating = rating.replace('+', '');
        
        const result = await apiClient.searchUsers(params);
        if (result.success && result.data) {
          setProfessionals(result.data.users);
        } else {
          setError(result.error || 'Failed to search professionals');
        }
      } catch (error) {
        setError('Failed to search professionals');
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchProfessionals, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, selectedExpertise, rating]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Find Professionals</h2>
        <p className="text-sm sm:text-base text-gray-600">Connect with experts across various fields and specializations</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, profession, skills, or keywords..."
            className="w-full pl-12 pr-20 sm:pr-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-lg"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full transition-colors text-xs sm:text-sm ${
                selectedCategory === category.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <category.icon className="h-3 sm:h-4 w-3 sm:w-4" />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mb-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Filters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expertise Area</label>
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {expertiseAreas.map((area) => (
                  <option key={area} value={area === 'All Expertise' ? 'all' : area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Any Rating</option>
                <option value="4+">4.0+ Stars</option>
                <option value="4.5+">4.5+ Stars</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Price</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Any Price</option>
                <option value="free">Free Sessions Available</option>
                <option value="under-50">Under $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="over-100">Over $100</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm sm:text-base text-gray-600">
          {professionals.length} professional{professionals.length !== 1 ? 's' : ''} found
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Searching professionals...</p>
        </div>
      )}

      {/* Professional Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {professionals.map((professional) => (
          <div key={professional.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-4 sm:p-6">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={professional.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
                  alt={professional.name}
                  className="w-12 sm:w-16 h-12 sm:h-16 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">{professional.name}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">{professional.profession}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Star className="h-3 sm:h-4 w-3 sm:w-4 text-yellow-500 fill-current" />
                    <span className="text-xs sm:text-sm font-medium">{professional.rating}</span>
                    <span className="text-xs sm:text-sm text-gray-500">({professional.reviewCount})</span>
                    {professional.isVerified && (
                      <span className="text-xs bg-green-100 text-green-800 px-1 sm:px-2 py-1 rounded-full">Verified</span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-3">{professional.bio}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {professional.expertise.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {professional.expertise.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{professional.expertise.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onConnect(professional)}
                  className="flex-1 flex items-center justify-center space-x-1 px-2 sm:px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  <Users className="h-3 sm:h-4 w-3 sm:w-4" />
                  <span>Connect</span>
                </button>
                <button
                  onClick={() => onBookSession(professional.id)}
                  className="flex-1 flex items-center justify-center space-x-1 px-2 sm:px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Video className="h-3 sm:h-4 w-3 sm:w-4" />
                  <span>Book</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && professionals.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No professionals found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
};