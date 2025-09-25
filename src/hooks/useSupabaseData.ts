import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Hook for expenses data
export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: any) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([expense])
        .select()
        .single();
      
      if (error) throw error;
      setExpenses(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return { expenses, loading, addExpense, deleteExpense, refetch: fetchExpenses };
};

// Hook for goals data
export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goal: any) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert([goal])
        .select()
        .single();
      
      if (error) throw error;
      setGoals(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  };

  const updateGoal = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setGoals(prev => prev.map(goal => goal.id === id ? data : goal));
      return data;
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setGoals(prev => prev.filter(goal => goal.id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return { goals, loading, addGoal, updateGoal, deleteGoal, refetch: fetchGoals };
};

// Hook for investments data
export const useInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvestments = async () => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setInvestments(data || []);
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const addInvestment = async (investment: any) => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .insert([investment])
        .select()
        .single();
      
      if (error) throw error;
      setInvestments(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding investment:', error);
      throw error;
    }
  };

  const deleteInvestment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setInvestments(prev => prev.filter(inv => inv.id !== id));
    } catch (error) {
      console.error('Error deleting investment:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  return { investments, loading, addInvestment, deleteInvestment, refetch: fetchInvestments };
};