# Freelanza - Freelancer & Employer Platform

Freelanza is a modern web platform that connects freelancers with employers, making it easy to find work or hire talent.

## Features

- User authentication with NextAuth.js
- Freelancer profiles with skills and portfolio
- Employer profiles with company information
- Job posting and application system
- Real-time messaging
- Search and filter functionality
- Responsive design with Tailwind CSS

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Supabase (Database & Authentication)
- NextAuth.js

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/freelanza.git
cd freelanza
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and copy the contents from `.env.example`:
```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local` with your own values:
- Get your Supabase URL and anon key from your Supabase project settings
- Generate a random string for NEXTAUTH_SECRET

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Create the following tables:
   - users
   - freelancer_profiles
   - employer_profiles
   - jobs
   - applications
   - messages

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
