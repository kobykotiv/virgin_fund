import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from '@/components/layouts/Sidebar';

jest.mock('next/navigation', () => ({
  usePathname: () => '/overview'
}));

describe('Sidebar', () => {
  it('renders primary nav items', () => {
    render(<Sidebar />);
    expect(screen.getByText(/Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Bots/i)).toBeInTheDocument();
    expect(screen.getByText(/Portfolio/i)).toBeInTheDocument();
  });

  it('expands and collapses nested sections', () => {
    render(<Sidebar />);
    const calculatorsButton = screen.getByRole('button', { name: /Calculators/i });
    fireEvent.click(calculatorsButton);
    expect(screen.getByText(/Financial/i)).toBeInTheDocument();
    fireEvent.click(calculatorsButton);
    // after collapse, Financial link should not be visible
    expect(screen.queryByText(/Financial/i)).not.toBeVisible();
  });

  it('shows active state for current route', () => {
    render(<Sidebar />);
    const overviewLink = screen.getByText('Overview').closest('a');
    expect(overviewLink).toHaveClass('font-semibold');
  });
});
