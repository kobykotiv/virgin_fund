import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "black";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: getSystemTheme(),
      setTheme: (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        set({ theme });
      },
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        // Set up listener for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
          if (!state) return;
          const newTheme = e.matches ? 'dark' : 'light';
          document.documentElement.setAttribute("data-theme", newTheme);
          state.setTheme(newTheme);
        });
      }
    },
  ),
);
