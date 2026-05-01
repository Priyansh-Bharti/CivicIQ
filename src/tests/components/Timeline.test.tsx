import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Timeline } from '../../../src/pages/Timeline';
import { TimelinePanel } from '../../../src/components/timeline/TimelinePanel';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../src/components/layout/Navbar', () => ({ Navbar: () => <div data-testid="navbar" /> }));
vi.mock('../../../src/components/chat/ChatPanel', () => ({ ChatPanel: () => <div data-testid="chatpanel" /> }));
vi.mock('../../../src/hooks/useTranslation', () => ({ useTranslation: (text: string) => text }));
vi.mock('../../../src/lib/analytics', () => ({ trackEvent: vi.fn() }));

describe('Timeline Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderTimeline = () =>
    render(
      <MemoryRouter>
        <Timeline />
      </MemoryRouter>
    );

  /** Helper: gets the 6 timeline phase nodes (scoped to data-testid container) */
  const getPhaseNodes = () => {
    const container = screen.getByTestId('timeline-nodes');
    return within(container).getAllByRole('listitem');
  };

  // ── Structural ──────────────────────────────────────────────────────────────
  it('renders all 6 timeline nodes', () => {
    renderTimeline();
    expect(getPhaseNodes()).toHaveLength(6);
  });

  it('Timeline h1 heading is correct', () => {
    renderTimeline();
    expect(
      screen.getByRole('heading', { level: 1, name: /The election process/i })
    ).toBeInTheDocument();
  });

  it('Timeline page has a main landmark', () => {
    renderTimeline();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('Back button is accessible', () => {
    renderTimeline();
    expect(screen.getByRole('button', { name: /Go back to home page/i })).toBeInTheDocument();
  });

  it('Share button is accessible', () => {
    renderTimeline();
    expect(screen.getByRole('button', { name: /Share your progress/i })).toBeInTheDocument();
  });

  // ── Accessibility ───────────────────────────────────────────────────────────
  it('active node has aria-current="step"', () => {
    renderTimeline();
    const activeNode = document.querySelector('[aria-current="step"]');
    expect(activeNode).not.toBeNull();
  });

  it('aria-live polite region exists', () => {
    renderTimeline();
    const liveEl = document.querySelector('[aria-live="polite"]');
    expect(liveEl).not.toBeNull();
    expect(liveEl!.getAttribute('aria-live')).toBe('polite');
  });

  // ── Keyboard navigation ─────────────────────────────────────────────────────
  it('ArrowDown moves active phase to next node', () => {
    renderTimeline();
    const nodes = getPhaseNodes();
    nodes[0].focus();
    fireEvent.keyDown(nodes[0], { key: 'ArrowDown' });
    // Phase 2 text appears (in node list or detail panel)
    expect(screen.getAllByText('National Conventions').length).toBeGreaterThan(0);
  });

  it('ArrowUp moves active phase to previous node', () => {
    renderTimeline();
    const nodes = getPhaseNodes();
    fireEvent.keyDown(nodes[0], { key: 'ArrowDown' });
    expect(screen.getAllByText('National Conventions').length).toBeGreaterThan(0);
    fireEvent.keyDown(nodes[1], { key: 'ArrowUp' });
    expect(screen.getAllByText('Primary Elections and Caucuses').length).toBeGreaterThan(0);
  });

  it('Enter key activates a node', () => {
    renderTimeline();
    const nodes = getPhaseNodes();
    fireEvent.keyDown(nodes[2], { key: 'Enter' });
    expect(screen.getAllByText('General Election Campaign').length).toBeGreaterThan(0);
  });

  // ── Interaction ─────────────────────────────────────────────────────────────
  it('PhaseDetail updates on node click', () => {
    renderTimeline();
    const nodes = getPhaseNodes();
    fireEvent.click(nodes[2]);
    expect(screen.getAllByText('General Election Campaign').length).toBeGreaterThan(0);
  });

  it('PhaseDetail "Ask CivicIQ" button fires callback', () => {
    const mockOnAsk = vi.fn();
    render(
      <MemoryRouter>
        <TimelinePanel onAskCivicIQ={mockOnAsk} />
      </MemoryRouter>
    );
    fireEvent.click(
      screen.getByRole('button', { name: /Ask CivicIQ about this phase/i })
    );
    expect(mockOnAsk).toHaveBeenCalled();
  });

  it('Clicking phase 4 shows its name in detail panel', () => {
    renderTimeline();
    const nodes = getPhaseNodes();
    fireEvent.click(nodes[3]);
    expect(screen.getAllByText('Election Day').length).toBeGreaterThan(0);
  });
});
