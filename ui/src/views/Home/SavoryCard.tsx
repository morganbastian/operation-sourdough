import React from 'react';

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  product_type: string;
}

interface AddOn {
  add_on_id: number;
  name: string;
  price: number;
}

interface Props {
  product: Product;
  addOns: AddOn[]; 
}

const SavoryCard: React.FC<Props> = ({ product, addOns }) => {
  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      {addOns.length > 0 && (
        <div>
          <h3>Add-Ons:</h3>
          <ul>
            {addOns.map((addOn) => (
              <li key={addOn.add_on_id}>
                {addOn.name} - ${addOn.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SavoryCard;

