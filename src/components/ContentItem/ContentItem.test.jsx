import { render, screen } from '@testing-library/react';
import ContentItem from './ContentItem';
import { PricingOption } from '../../enums/pricingOption';

describe('ContentItem', () => {
  const mockItem = {
    id: 1,
    title: 'Test Item',
    creator: 'Test Creator',
    imagePath: '/test-image.jpg',
    pricingOption: PricingOption.PAID,
    price: 99
  };

  it('renders content item with paid pricing', () => {
    render(<ContentItem item={mockItem} />);
    
    expect(screen.getByRole('img')).toHaveAttribute('src', '/test-image.jpg');
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test Item');
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Test Creator')).toBeInTheDocument();
    expect(screen.getByText('$99')).toBeInTheDocument();
  });

  it('renders content item with free pricing', () => {
    const freeItem = {
      ...mockItem,
      pricingOption: PricingOption.FREE
    };
    
    render(<ContentItem item={freeItem} />);
    
    expect(screen.getByText('FREE')).toBeInTheDocument();
    expect(screen.queryByText(/\$\d+/)).not.toBeInTheDocument();
  });

  it('renders content item with view only pricing', () => {
    const viewOnlyItem = {
      ...mockItem,
      pricingOption: PricingOption.VIEW_ONLY
    };
    
    render(<ContentItem item={viewOnlyItem} />);
    
    expect(screen.getByText('View Only')).toBeInTheDocument();
    expect(screen.queryByText(/\$\d+/)).not.toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<ContentItem item={mockItem} />);

    expect(container.firstChild).toHaveClass('content-item');
    expect(container.querySelector('.content-image')).toBeInTheDocument();
    expect(container.querySelector('.content-info')).toBeInTheDocument();
    expect(container.querySelector('.content-title')).toBeInTheDocument();
    expect(container.querySelector('.user-name')).toBeInTheDocument();
    expect(container.querySelector('.pricing-info')).toBeInTheDocument();
  });

  it('handles missing price gracefully', () => {
    const itemWithoutPrice = {
      ...mockItem,
      price: undefined
    };
    
    render(<ContentItem item={itemWithoutPrice} />);
    
   const priceElement = screen.getByText('$');
   expect(priceElement).toBeInTheDocument();
   expect(priceElement).toHaveTextContent('$');
  });

  it('handles missing image path gracefully', () => {
    const itemWithoutImage = {
      ...mockItem,
      imagePath: undefined
    };
    
    render(<ContentItem item={itemWithoutImage} />);
    
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toBeNull();
  });

  it('applies correct pricing label class for free item', () => {
    const freeItem = {
      ...mockItem,
      pricingOption: PricingOption.FREE
    };
    
    render(<ContentItem item={freeItem} />);
    
    const pricingLabel = screen.getByText('FREE');
    expect(pricingLabel).toHaveClass('pricing-label');
    expect(pricingLabel).toHaveClass('unknown');
  });

  it('applies correct pricing label class for view only item', () => {
    const viewOnlyItem = {
      ...mockItem,
      pricingOption: PricingOption.VIEW_ONLY
    };
    
    render(<ContentItem item={viewOnlyItem} />);
    
    const pricingLabel = screen.getByText('View Only');
    expect(pricingLabel).toHaveClass('pricing-label');
    expect(pricingLabel).toHaveClass('unknown');
  });

  it('handles unknown pricing option', () => {
    const unknownItem = {
      ...mockItem,
      pricingOption: 'UNKNOWN'
    };
    
    render(<ContentItem item={unknownItem} />);
    
    const pricingLabel = screen.getByText('View Only');
    expect(pricingLabel).toHaveClass('pricing-label');
    expect(pricingLabel).toHaveClass('unknown');
  });
});
