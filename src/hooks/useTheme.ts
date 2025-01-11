import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTheme() {
      try {
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('theme')
          .single();

        if (preferences?.theme) {
          setTheme(preferences.theme as Theme);
          document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    const userId = (await supabase.auth.getUser()).data?.user?.id;
    
    if (!userId) return;
    
    try {
      await supabase
        .from('user_preferences')
        .upsert({ 
          user_id: userId,
          theme: newTheme,
          updated_at: new Date().toISOString()
        });

      setTheme(newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return { theme, toggleTheme, loading };
}