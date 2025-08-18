import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useSession() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) setSession(data.session ?? null);
      } catch (e) {
        console.error('useSession init error', e);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, payload) => {
      setSession(payload.session ?? null);
    });

    return () => {
      mounted = false;
      try {
        listener?.subscription?.unsubscribe();
      } catch (e) {}
    };
  }, []);

  return session;
}
