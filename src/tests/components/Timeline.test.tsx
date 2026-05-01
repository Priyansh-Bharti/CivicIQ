import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Timeline } from '../../../src/pages/Timeline';
import { useAuth } from '../../../src/hooks/useAuth';
import { useTimeline } from '../../../src/hooks/useTimeline';

const mockSetActivePhase = vi.fn();

vi.mock('../../../src/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({ user: null, isAuthenticated: false }))
}));

vi.mock('../../../src/hooks/useTimeline', () => ({
  useTimeline: vi.fn(() => ({
    phases: [
      { id: '1', name: 'Primary Elections', duration: 'Jan-Jun', description: 'Desc 1', keyActors: [], steps: [], status: 'completed' },
      { id: '2', name: 'National Conventions', duration: 'Jul-Aug', description: 'Desc 2', keyActors: [], steps: [], status: 'active' },
    ],
    activePhaseId: '1',
    progress: { '1': true },
    setActivePhase: mockSetActivePhase,
    markPhaseViewed: vi.fn(),
  }))
}));

describe('Timeline Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders phase nodes', () => {
    render(
      <BrowserRouter>
        <Timeline />
      </BrowserRouter>
    );
    // Use getAllByText and check if length > 0
    expect(screen.getAllByText(/Primary Elections/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/National Conventions/i).length).toBeGreaterThan(0);
  });

  it('clicking a node updates the detail panel', () => {
    render(
      <BrowserRouter>
        <Timeline />
      </BrowserRouter>
    );
    
    // Find the node in the list specifically if possible, or just the second occurrence
    const nodes = screen.getAllByText(/National Conventions/i);
    fireEvent.click(nodes[0]);
    expect(mockSetActivePhase).toHaveBeenCalledWith('2');
  });

  it('aria-current is set on active node', () => {
    render(
      <BrowserRouter>
        <Timeline />
      </BrowserRouter>
    );
    const activeNode = screen.getByLabelText(/Phase 1: Primary Elections/i);
    expect(activeNode).toHaveAttribute('aria-current', 'step');
  });

  it('keyboard navigation between nodes works', () => {
    render(
      <BrowserRouter>
        <Timeline />
      </BrowserRouter>
    );
    
    const node = screen.getByLabelText(/Phase 2: National Conventions/i);
    fireEvent.keyDown(node, { key: 'Enter' });
    expect(mockSetActivePhase).toHaveBeenCalledWith('2');
  });
});
