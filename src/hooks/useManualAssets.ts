import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ManualAsset {
  id: string;
  name: string;
  type: 'cash' | 'savings' | 'real_estate' | 'vehicle' | 'other';
  value: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useManualAssets = () => {
  const [assets, setAssets] = useState<ManualAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAssets = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('manual_assets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAssets(data as ManualAsset[] || []);
    } catch (error) {
      console.error('Error fetching manual assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAsset = async (asset: Omit<ManualAsset, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('manual_assets')
        .insert([{ ...asset, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      setAssets(prev => [data as ManualAsset, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding asset:', error);
      throw error;
    }
  };

  const updateAsset = async (id: string, updates: Partial<ManualAsset>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('manual_assets')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      setAssets(prev => prev.map(asset => asset.id === id ? data as ManualAsset : asset));
      return data;
    } catch (error) {
      console.error('Error updating asset:', error);
      throw error;
    }
  };

  const deleteAsset = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('manual_assets')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      setAssets(prev => prev.filter(asset => asset.id !== id));
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [user]);

  return { assets, loading, addAsset, updateAsset, deleteAsset, refetch: fetchAssets };
};