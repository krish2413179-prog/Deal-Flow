import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export const useClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('claims')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Clean quoted values from database
      const cleanedData = data.map(claim => ({
        ...claim,
        status: claim.status?.replace(/"/g, '') || '',
        user_email: claim.user_email?.replace(/"/g, '') || '',
        subject: claim.subject?.replace(/"/g, '') || '',
        reason: claim.reason?.replace(/"/g, '') || '',
        tx_hash: claim.tx_hash?.replace(/"/g, '') || ''
      }));

      setClaims(cleanedData);
    } catch (err) {
      console.error('Error fetching claims:', err);
      setError(err.message || 'Failed to fetch claims');
    } finally {
      setLoading(false);
    }
  };

  const refreshClaims = () => {
    fetchClaims();
  };

  useEffect(() => {
    fetchClaims();

    // Set up real-time subscription
    const subscription = supabase
      .channel('claims_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'claims' 
        }, 
        (payload) => {
          console.log('Real-time update:', payload);
          fetchClaims(); // Refresh data when changes occur
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    claims,
    loading,
    error,
    refreshClaims
  };
};