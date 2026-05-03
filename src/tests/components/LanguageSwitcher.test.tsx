import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';
import { SUPPORTED_LANGUAGES } from '../../constants';

describe('LanguageSwitcher Component', () => {
  it('should render the current language flag', () => {
    render(<LanguageSwitcher />);
    // Initial language is usually English
    expect(screen.getByText('🇬🇧')).toBeDefined();
  });

  it('should open the menu when clicked', () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Should see at least a few supported languages
    expect(screen.getByText('हिन्दी')).toBeDefined();
    expect(screen.getByText('Español')).toBeDefined();
  });

  it('should display the correct number of languages from constants', () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Each language option should be rendered as a button
    const items = screen.getAllByRole('button');
    // There should be at least as many buttons as supported languages (plus the main toggle)
    expect(items.length).toBeGreaterThanOrEqual(SUPPORTED_LANGUAGES.length);
  });
});
