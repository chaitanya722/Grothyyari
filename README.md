# GrowthYari Social Media Platform

A modern social media platform for professional networking and growth, built with React, TypeScript, and Supabase.

## Features

- **Professional Networking**: Connect with industry experts and professionals
- **Video Reels**: Share insights through video content
- **Session Booking**: Book one-on-one sessions with experts
- **YariConnect**: Real-time video chat with professionals
- **Search & Discovery**: Find professionals by expertise and industry
- **Real-time Notifications**: Stay updated with platform activities

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Build Tool**: Vite
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd growthyari
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your environment variables in `.env`:

```env
VITE_API_URL=your_api_url
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
   - Create a new Supabase project
   - Run the migration file in the Supabase SQL editor
   - The migration will create all necessary tables and policies

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── connections/    # Connection management
│   ├── content/        # Content creation
│   ├── dashboard/      # Dashboard views
│   ├── feed/          # Feed and video reels
│   ├── layout/        # Layout components
│   ├── profile/       # Profile management
│   ├── search/        # Search functionality
│   ├── sessions/      # Session booking
│   └── yariconnect/   # Video chat features
├── config/            # Configuration files
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Database Schema

The application uses Supabase with the following main tables:

- `users` - User profiles and authentication
- `posts` - User posts (video reels, thoughts, images)
- `post_likes` - Post likes tracking
- `post_comments` - Post comments
- `sessions` - Professional sessions/consultations
- `connections` - User connections
- `connection_requests` - Connection requests
- `yari_connect_sessions` - YariConnect video chat sessions
- `notifications` - User notifications

All tables have Row Level Security (RLS) enabled with appropriate policies.

## Features Overview

### Authentication
- Email/password authentication via Supabase Auth
- User profile management
- Role-based access control

### Professional Networking
- Send and receive connection requests
- Manage professional connections
- Search for professionals by expertise

### Content Sharing
- Create video reels, thoughts, and image posts
- Like and comment on posts
- Tag-based content organization

### Session Booking
- Book sessions with industry experts
- Free and paid session options
- Session management and scheduling

### YariConnect
- Real-time video chat matching
- Filter professionals by criteria
- Instant professional connections

### Search & Discovery
- Global search across users and content
- Advanced filtering options
- Trending topics and suggestions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@growthyari.com or join our community Discord.