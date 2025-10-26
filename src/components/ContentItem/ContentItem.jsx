import { PricingOption } from '../../enums/pricingOption';
import './ContentItem.css';

const ContentItem = ({ item }) => {
    return (
      <div className="content-item">
        <div className="content-image">
          <img src={item.imagePath} alt={item.title} />
        </div>
        <div className="content-info">
          <div>
            <h3 className="content-title">{item.title}</h3>
            <div className="user-name">{item.creator}</div>
          </div>
          <div className="pricing-info">
            {item.pricingOption === PricingOption.PAID ? (
              <span className="price">${item.price}</span>
            ) : (
                <span className={`pricing-label ${
                    typeof item?.pricingOption === 'string' 
                      ? item.pricingOption.toLowerCase().replace(' ', '-') 
                      : 'unknown'
                  }`}>
                    {item?.pricingOption === PricingOption.FREE ? 'FREE' : 'View Only'}
                  </span>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default ContentItem;