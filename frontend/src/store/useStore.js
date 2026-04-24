import { create } from 'zustand';

const useStore = create((set) => ({
  // Theme State
  theme: localStorage.getItem('theme') || 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    return { theme: newTheme };
  }),

  // Auth State Migration
  user: JSON.parse(localStorage.getItem('userInfo')) || null,
  login: (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    set({ user: userData });
  },
  logout: () => {
    localStorage.removeItem('userInfo');
    set({ user: null });
  },
  
  // Notification State
  notifications: [],
  addNotification: (notification) => set((state) => ({ 
    notifications: [notification, ...state.notifications].slice(0, 5) 
  })),
  removeNotification: (id) => set((state) => ({ 
    notifications: state.notifications.filter((n) => n.id !== id) 
  })),
  
  // Sidebar State (Mobile)
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

export default useStore;
