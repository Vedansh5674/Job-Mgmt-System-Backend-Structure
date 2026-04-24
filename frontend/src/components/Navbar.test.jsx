import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './Navbar';

// Mock useStore hook
vi.mock('../store/useStore', () => ({
  default: () => ({
    user: null,
    theme: 'dark',
    toggleTheme: vi.fn(),
    isSidebarOpen: false,
    toggleSidebar: vi.fn(),
  }),
}));

describe('Navbar Component', () => {
  it('renders logo text correctly', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText(/JobPortal/i)).toBeInTheDocument();
  });

  it('shows login and signup links when user is not logged in', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText(/Log in/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign up/i)).toBeInTheDocument();
  });
});
