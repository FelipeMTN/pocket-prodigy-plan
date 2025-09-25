-- Create user profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  currency text DEFAULT 'BRL',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create partnerships table for collaborative features
CREATE TABLE public.partnerships (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  invited_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

-- Enable RLS on partnerships
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;

-- Create policies for partnerships
CREATE POLICY "Users can view their partnerships" 
ON public.partnerships 
FOR SELECT 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create partnerships" 
ON public.partnerships 
FOR INSERT 
WITH CHECK (auth.uid() = invited_by AND (auth.uid() = user1_id OR auth.uid() = user2_id));

CREATE POLICY "Users can update their partnerships" 
ON public.partnerships 
FOR UPDATE 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Create manual assets table for user-editable assets
CREATE TABLE public.manual_assets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('cash', 'savings', 'real_estate', 'vehicle', 'other')),
  value numeric NOT NULL DEFAULT 0,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on manual assets
ALTER TABLE public.manual_assets ENABLE ROW LEVEL SECURITY;

-- Create policies for manual assets
CREATE POLICY "Users can manage their own assets" 
ON public.manual_assets 
FOR ALL 
USING (auth.uid() = user_id);

-- Create manual liabilities table
CREATE TABLE public.manual_liabilities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('mortgage', 'car_loan', 'credit_card', 'personal_loan', 'other')),
  balance numeric NOT NULL DEFAULT 0,
  interest_rate numeric,
  monthly_payment numeric,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on manual liabilities
ALTER TABLE public.manual_liabilities ENABLE ROW LEVEL SECURITY;

-- Create policies for manual liabilities
CREATE POLICY "Users can manage their own liabilities" 
ON public.manual_liabilities 
FOR ALL 
USING (auth.uid() = user_id);

-- Create AI chat history table
CREATE TABLE public.ai_chat_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  response text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on AI chat history
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;

-- Create policies for AI chat history
CREATE POLICY "Users can manage their own chat history" 
ON public.ai_chat_history 
FOR ALL 
USING (auth.uid() = user_id);

-- Update existing tables to link to authenticated users
UPDATE public.expenses SET user_id = '00000000-0000-0000-0000-000000000000'::uuid WHERE user_id IS NULL;
UPDATE public.goals SET user_id = '00000000-0000-0000-0000-000000000000'::uuid WHERE user_id IS NULL;
UPDATE public.investments SET user_id = '00000000-0000-0000-0000-000000000000'::uuid WHERE user_id IS NULL;

-- Create trigger for profile auto-creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp triggers for new tables
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partnerships_updated_at
BEFORE UPDATE ON public.partnerships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_manual_assets_updated_at
BEFORE UPDATE ON public.manual_assets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_manual_liabilities_updated_at
BEFORE UPDATE ON public.manual_liabilities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();