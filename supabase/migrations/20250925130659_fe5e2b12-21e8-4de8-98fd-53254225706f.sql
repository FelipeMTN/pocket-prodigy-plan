-- Create expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT gen_random_uuid(),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create goals table
CREATE TABLE public.goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  deadline DATE,
  category TEXT NOT NULL,
  color TEXT DEFAULT 'from-blue-400 to-blue-600',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create investments table
CREATE TABLE public.investments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT gen_random_uuid(),
  ticker TEXT NOT NULL,
  name TEXT NOT NULL,
  shares INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  sector TEXT,
  purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- Create policies for expenses
CREATE POLICY "Users can view their own expenses" 
ON public.expenses 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own expenses" 
ON public.expenses 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own expenses" 
ON public.expenses 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete their own expenses" 
ON public.expenses 
FOR DELETE 
USING (true);

-- Create policies for goals
CREATE POLICY "Users can view their own goals" 
ON public.goals 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own goals" 
ON public.goals 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own goals" 
ON public.goals 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete their own goals" 
ON public.goals 
FOR DELETE 
USING (true);

-- Create policies for investments
CREATE POLICY "Users can view their own investments" 
ON public.investments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own investments" 
ON public.investments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own investments" 
ON public.investments 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete their own investments" 
ON public.investments 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_investments_updated_at
  BEFORE UPDATE ON public.investments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.expenses (amount, description, category, date) VALUES
  (45.67, 'Almoço no café', 'food', '2024-01-15'),
  (120.00, 'Posto de gasolina', 'transport', '2024-01-14'),
  (85.50, 'Supermercado', 'shopping', '2024-01-13'),
  (25.30, 'Café da manhã', 'food', '2024-01-12'),
  (180.00, 'Conta de luz', 'utilities', '2024-01-11'),
  (60.00, 'Cinema', 'entertainment', '2024-01-10');

INSERT INTO public.goals (title, target_amount, current_amount, deadline, category, color) VALUES
  ('Reserva de Emergência', 15000, 8500, '2024-12-31', 'Segurança', 'from-blue-400 to-blue-600'),
  ('Notebook Novo', 3000, 1200, '2024-08-31', 'Tecnologia', 'from-purple-400 to-purple-600'),
  ('Viagem para Europa', 8000, 3200, '2025-06-30', 'Viagem', 'from-green-400 to-green-600'),
  ('Entrada da Casa', 50000, 22000, '2025-12-31', 'Casa', 'from-orange-400 to-orange-600');

INSERT INTO public.investments (ticker, name, shares, price, sector) VALUES
  ('PETR4.SA', 'Petrobras', 100, 28.45, 'Energy'),
  ('AAPL', 'Apple Inc.', 10, 189.25, 'Technology'),
  ('VALE3.SA', 'Vale', 50, 65.80, 'Materials');