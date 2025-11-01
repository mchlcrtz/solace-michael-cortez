import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';
import { Advocate } from '@/types';

global.fetch = jest.fn();

jest.mock('@/components/provider-card', () => ({
  ProviderCard: ({ name, city, years }: { name: string; city: string; years: number }) => (
    <div data-testid="provider-card">
      <div data-testid="provider-name">{name}</div>
      <div data-testid="provider-city">{city}</div>
      <div data-testid="provider-years">{years}</div>
    </div>
  ),
}));

describe('Home', () => {
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

  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ 
        data: mockAdvocates,
        pagination: {
          page: 1,
          limit: 25,
          total: mockAdvocates.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page title', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Solace Advocates')).toBeInTheDocument();
    });
  });

  it('fetches and displays advocates', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getAllByTestId('provider-card')).toHaveLength(2);
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('displays pagination controls when multiple pages exist', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: mockAdvocates,
        pagination: {
          page: 1,
          limit: 25,
          total: 50,
          totalPages: 2,
          hasNextPage: true,
          hasPrevPage: false
        }
      }),
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/Page 1 of 2/i)).toBeInTheDocument();
    });
  });

  it('calls API with correct pagination parameters', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1'),
        expect.any(Object)
      );
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=25'),
        expect.any(Object)
      );
    });
  });
});

