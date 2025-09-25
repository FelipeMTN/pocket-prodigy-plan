import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ManualLiability {
  id: string;
  name: string;
  type: 'mortgage' | 'car_loan' | 'credit_card' | 'personal_loan' | 'other';
  balance: number;
  interest_rate?: number;
  monthly_payment?: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useManualLiabilities = () => {
  const [liabilities, setLiabilities] = useState<ManualLiability[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchLiabilities = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('manual_liabilities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setLiabilities(data as ManualLiability[] || []);
    } catch (error) {
      console.error('Error fetching manual liabilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const addLiability = async (liability: Omit<ManualLiability, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('manual_liabilities')
        .insert([{ ...liability, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      setLiabilities(prev => [data as ManualLiability, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding liability:', error);
      throw error;
    }
  };

  const updateLiability = async (id: string, updates: Partial<ManualLiability>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('manual_liabilities')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      setLiabilities(prev => prev.map(liability => liability.id === id ? data as ManualLiability : liability));
      return data;
    } catch (error) {
      console.error('Error updating liability:', error);
      throw error;
    }
  };

  const deleteLiability = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('manual_liabilities')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      setLiabilities(prev => prev.filter(liability => liability.id !== id));
    } catch (error) {
      console.error('Error deleting liability:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchLiabilities();
  }, [user]);

  return { liabilities, loading, addLiability, updateLiability, deleteLiability, refetch: fetchLiabilities };
};