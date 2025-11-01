import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProviderCard } from '../provider-card';
import { TooltipProvider } from '../ui/tooltip';

const renderWithTooltipProvider = (component: React.ReactElement) => {
  return render(<TooltipProvider>{component}</TooltipProvider>);
};

describe('ProviderCard', () => {
  const mockProps = {
    name: 'John Doe',
    title: 'MD',
    city: 'New York',
    years: 10,
    phone: '5551234567',
    specialties: ['Bipolar', 'LGBTQ'],
    imageUrl: 'https://example.com/image.jpg',
  };

  it('renders provider information', () => {
    renderWithTooltipProvider(<ProviderCard {...mockProps} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('MD')).toBeInTheDocument();
    expect(screen.getByText(/New York/)).toBeInTheDocument();
    expect(screen.getByText(/10 years experience/)).toBeInTheDocument();
  });

  it('formats phone number correctly', () => {
    renderWithTooltipProvider(<ProviderCard {...mockProps} />);
    
    expect(screen.getByText('(555)-123-4567')).toBeInTheDocument();
  });

  it('displays specialties as badges', () => {
    renderWithTooltipProvider(<ProviderCard {...mockProps} />);
    
    expect(screen.getByText('Bipolar')).toBeInTheDocument();
    expect(screen.getByText('LGBTQ')).toBeInTheDocument();
  });

  it('displays specialty without parentheses in badge', () => {
    const propsWithParentheses = {
      ...mockProps,
      specialties: ['General Mental Health (anxiety, depression)'],
    };
    
    renderWithTooltipProvider(<ProviderCard {...propsWithParentheses} />);
    
    expect(screen.getByText('General Mental Health')).toBeInTheDocument();
  });

  it('renders contact button', () => {
    renderWithTooltipProvider(<ProviderCard {...mockProps} />);
    
    expect(screen.getByRole('button', { name: /contact/i })).toBeInTheDocument();
  });

  it('displays single year correctly', () => {
    const propsWithOneYear = {
      ...mockProps,
      years: 1,
    };
    
    renderWithTooltipProvider(<ProviderCard {...propsWithOneYear} />);
    
    expect(screen.getByText(/1 year experience/)).toBeInTheDocument();
  });
});

