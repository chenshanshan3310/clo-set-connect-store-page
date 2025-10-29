import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ContentFilter from './ContentFilter';
import filterReducer from '../../redux/slices/filterSlice';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      filters: filterReducer
    },
    preloadedState: {
      filters: {
        pricingOptions: {
          Paid: false,
          Free: false,
          'View Only': false
        },
        ...initialState
      }
    }
  });
};

const renderWithProvider = (component, { initialState = {} } = {}) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('ContentFilter', () => {
  it('renders pricing filter title', () => {
    renderWithProvider(<ContentFilter />);
    expect(screen.getByText('Pricing Options')).toBeInTheDocument();
  });

  it('renders all pricing options', () => {
    renderWithProvider(<ContentFilter />);
    expect(screen.getByRole('checkbox', { name: 'Paid' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Free' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'View Only' })).toBeInTheDocument();
  });

  it('initial checkbox states match store state', () => {
    const initialState = {
      pricingOptions: {
        Paid: true,
        Free: false,
        'View Only': true
      }
    };
    renderWithProvider(<ContentFilter />, { initialState });
    
    expect(screen.getByRole('checkbox', { name: 'Paid' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Free' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'View Only' })).toBeChecked();
  });

  it('dispatches togglePricingOption when checkbox is clicked', () => {
    const store = createTestStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    
    render(
      <Provider store={store}>
        <ContentFilter />
      </Provider>
    );
    
    fireEvent.click(screen.getByRole('checkbox', { name: 'Paid' }));
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'filters/togglePricingOption',
        payload: 'Paid'
      })
    );
  });

  it('toggles Paid option when clicked', () => {
    renderWithProvider(<ContentFilter />);
    const paidCheckbox = screen.getByRole('checkbox', { name: 'Paid' });
    
    expect(paidCheckbox).not.toBeChecked();
    fireEvent.click(paidCheckbox);
    expect(paidCheckbox).toBeChecked();
  });

  it('toggles Free option when clicked', () => {
    renderWithProvider(<ContentFilter />);
    const freeCheckbox = screen.getByRole('checkbox', { name: 'Free' });
    
    expect(freeCheckbox).not.toBeChecked();
    fireEvent.click(freeCheckbox);
    expect(freeCheckbox).toBeChecked();
  });

  it('toggles View Only option when clicked', () => {
    renderWithProvider(<ContentFilter />);
    const viewOnlyCheckbox = screen.getByRole('checkbox', { name: 'View Only' });
    
    expect(viewOnlyCheckbox).not.toBeChecked();
    fireEvent.click(viewOnlyCheckbox);
    expect(viewOnlyCheckbox).toBeChecked();
  });

  it('applies correct CSS classes', () => {
    renderWithProvider(<ContentFilter />);
    const filterContainer = screen.getByRole('group', { name: /pricing options/i }).parentElement;
    
    expect(filterContainer).toHaveClass('pricing-filter');
    expect(screen.getByText('Pricing Options')).toHaveClass('filter-title');
    expect(screen.getByRole('group', { name: /pricing options/i })).toHaveClass('filter-options');
  });

  it('handles multiple checkbox clicks', () => {
    renderWithProvider(<ContentFilter />);
    const paidCheckbox = screen.getByRole('checkbox', { name: 'Paid' });
    const freeCheckbox = screen.getByRole('checkbox', { name: 'Free' });
    
    fireEvent.click(paidCheckbox);
    fireEvent.click(freeCheckbox);
    
    expect(paidCheckbox).toBeChecked();
    expect(freeCheckbox).toBeChecked();
  });

  it('handles unchecking checkboxes', () => {
    const initialState = {
      pricingOptions: {
        Paid: true,
        Free: false,
        'View Only': false
      }
    };
    renderWithProvider(<ContentFilter />, { initialState });
    const paidCheckbox = screen.getByRole('checkbox', { name: 'Paid' });
    
    fireEvent.click(paidCheckbox);
    expect(paidCheckbox).not.toBeChecked();
  });
});
