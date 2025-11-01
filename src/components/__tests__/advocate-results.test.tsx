import { render, screen } from '@testing-library/react';
import { AdvocateResults } from '../advocate-results';
import { Advocate } from '@/types';

describe('AdvocateResults', () => {
  const mockAdvocates: Advocate[] = [
    {
      firstName: 'John',
      lastName: 'Doe',
      city: 'New York',
      degree: 'MD',
      specialties: ['Bipolar', 'LGBTQ'],
      yearsOfExperience: 10,
      phoneNumber: 5551234567,
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      city: 'Los Angeles',
      degree: 'PhD',
      specialties: ['Trauma & PTSD'],
      yearsOfExperience: 5,
      phoneNumber: 5559876543,
    },
  ];

  it('renders advocate cards when advocates are provided', () => {
    render(<AdvocateResults advocates={mockAdvocates} isLoading={false} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('displays loading skeletons when loading', () => {
    render(<AdvocateResults advocates={[]} isLoading={true} />);
    
    const skeletons = screen.getAllByRole('listitem');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays empty state when no advocates found', () => {
    render(<AdvocateResults advocates={[]} isLoading={false} />);
    
    expect(screen.getByText(/No advocates found/i)).toBeInTheDocument();
  });

  it('displays error state when error occurs', () => {
    const errorMessage = 'Failed to load advocates';
    render(<AdvocateResults advocates={[]} isLoading={false} error={errorMessage} />);
    
    expect(screen.getByText(/Error loading advocates/i)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders correct number of advocate cards', () => {
    render(<AdvocateResults advocates={mockAdvocates} isLoading={false} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});

