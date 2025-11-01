import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdvocateSearch } from './advocate-search';

describe('AdvocateSearch', () => {
  const mockProps = {
    searchTerm: '',
    isLoading: false,
    yearsFilter: 'all',
    titleFilter: 'all',
    sortBy: 'name-asc',
    resultCount: 0,
    onChange: jest.fn(),
    onYearsFilterChange: jest.fn(),
    onTitleFilterChange: jest.fn(),
    onSortByChange: jest.fn(),
    onReset: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input', () => {
    render(<AdvocateSearch {...mockProps} />);
    
    expect(screen.getByPlaceholderText(/search advocates/i)).toBeInTheDocument();
  });

  it('renders filter dropdowns', () => {
    render(<AdvocateSearch {...mockProps} />);
    
    expect(screen.getByText('All experience levels')).toBeInTheDocument();
    expect(screen.getByText('All titles')).toBeInTheDocument();
    expect(screen.getByText('Name (A-Z)')).toBeInTheDocument();
  });

  it('renders reset button', () => {
    render(<AdvocateSearch {...mockProps} />);
    
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('calls onChange when typing in search input', async () => {
    const user = userEvent.setup();
    render(<AdvocateSearch {...mockProps} />);
    
    const input = screen.getByPlaceholderText(/search advocates/i);
    await user.type(input, 'test');
    
    expect(mockProps.onChange).toHaveBeenCalled();
  });

  it('displays search term when provided', () => {
    render(<AdvocateSearch {...mockProps} searchTerm="John" />);
    
    expect(screen.getByText(/searching for:/i)).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('displays loading indicator when loading', () => {
    render(<AdvocateSearch {...mockProps} isLoading={true} />);
    
    expect(screen.getByText(/searching/i)).toBeInTheDocument();
  });

  it('displays result count when not loading', () => {
    render(<AdvocateSearch {...mockProps} resultCount={5} />);
    
    expect(screen.getByText(/5 advocates found/i)).toBeInTheDocument();
  });

  it('displays singular form for single result', () => {
    render(<AdvocateSearch {...mockProps} resultCount={1} />);
    
    expect(screen.getByText(/1 advocate found/i)).toBeInTheDocument();
  });

  it('displays "No advocates found" when result count is 0', () => {
    render(<AdvocateSearch {...mockProps} resultCount={0} />);
    
    expect(screen.getByText(/no advocates found/i)).toBeInTheDocument();
  });

  it('calls onReset when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<AdvocateSearch {...mockProps} />);
    
    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);
    
    expect(mockProps.onReset).toHaveBeenCalled();
  });
});

