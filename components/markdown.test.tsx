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

describe('Markdown links', () => {
  it('keeps an /en/ link inside the locale the page is served under', () => {
    render(<Markdown locale="nl">{'[case](/en/work/cloud-gateway) [out](https://example.com/en/x)'}</Markdown>);
    expect(screen.getByRole('link', { name: 'case' })).toHaveAttribute('href', '/nl/work/cloud-gateway');
    expect(screen.getByRole('link', { name: 'out' })).toHaveAttribute('href', 'https://example.com/en/x');
  });

  it('leaves links alone without a locale or under English', () => {
    render(<Markdown locale="en">{'[a](/en/work/x)'}</Markdown>);
    expect(screen.getByRole('link', { name: 'a' })).toHaveAttribute('href', '/en/work/x');
  });
});
