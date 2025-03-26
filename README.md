# 10,000 Hours - Master Tracker

Track your journey to mastery with the 10,000 hours rule. A productivity application that helps you track time spent on tasks and visualize your progress toward mastery in different skills.

## Features

- Track time spent on different tasks using a stopwatch timer
- Categorize tasks (development, UI/UX design, copywriting, etc.)
- Monitor your progress toward the 10,000-hour goal
- Authentication to save your personal progress
- Dashboard with statistics and visualizations

## Tech Stack

- Next.js for the frontend
- Tailwind CSS for styling
- Supabase for authentication and database

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)

### Supabase Setup

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Once your project is created, go to the SQL Editor and run the following SQL to create the tables:

```sql
-- Create tables for the application
-- Enable RLS
ALTER DATABASE postgres SET "app.settings.app_id" = 'ten_thousand_hours_app';

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  hours_spent FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create time_entries table
CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  task_id UUID REFERENCES tasks NOT NULL,
  duration_seconds INTEGER NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles: Users can only view and update their own profiles
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Tasks: Users can CRUD their own tasks
CREATE POLICY "Users can view their own tasks" 
  ON tasks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks" 
  ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
  ON tasks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
  ON tasks FOR DELETE USING (auth.uid() = user_id);

-- Time Entries: Users can CRUD their own time entries
CREATE POLICY "Users can view their own time entries" 
  ON time_entries FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own time entries" 
  ON time_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own time entries" 
  ON time_entries FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own time entries" 
  ON time_entries FOR DELETE USING (auth.uid() = user_id);

-- Create a function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (new.id, new.email, '', '');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

3. From your Supabase project:
   - Go to Settings > API to get your URL and public anon key
   - Create a `.env.local` file based on `.env.local.example` with these credentials

### Application Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.local.example` to `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000 in your browser

## Usage

1. Sign up with an email and password
2. Create your first task with a category
3. Start tracking time with the timer
4. View your progress on the dashboard

## License

This project is licensed under the MIT License.
