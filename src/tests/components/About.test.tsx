import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import About from '../../pages/About';

describe('About Page', () => {
  it('renders the about page content', () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );
    expect(screen.getByText(/About/i)).toBeInTheDocument();
  });
});
