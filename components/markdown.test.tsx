import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Markdown } from '@/components/markdown';

describe('Markdown', () => {
  it('renders markdown to HTML', () => {
    render(<Markdown># Hello world</Markdown>);
    expect(screen.getByRole('heading', { name: 'Hello world' })).toBeInTheDocument();
  });

  it('renders GFM tables', () => {
    render(<Markdown>{'| a | b |\n| - | - |\n| 1 | 2 |'}</Markdown>);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
