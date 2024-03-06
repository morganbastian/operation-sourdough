import React, { useEffect, useState } from 'react';
import api from '../../utility/api';
import SavoryCard from './SavoryCard';

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

interface ProductWithAddOns extends Product {
  addOns: AddOn[];
}

const SavoryCardContainer: React.FC = () => {
  const [products, setProducts] = useState<ProductWithAddOns[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductsAndAddOns = async () => {
      try {
        // Fetch products
        const productResponse = await api.get('/products');
        const savoryProducts: Product[] = productResponse.data.filter((product: Product) => product.product_type === 'savory');

        // For each product, fetch its add-ons
        const productsWithAddOns: ProductWithAddOns[] = await Promise.all(
          savoryProducts.map(async (product) => {
            try {
              const addOnsResponse = await api.get(`/products/${product.product_id}/add_ons`);
              return { ...product, addOns: addOnsResponse.data };
            } catch (error) {
              console.error(`Failed to fetch add-ons for product ${product.product_id}`, error);
              return { ...product, addOns: [] };
            }
          })
        );

        setProducts(productsWithAddOns);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setError(`Error fetching product and add-on data: ${errorMessage}`);
      }
    };

    fetchProductsAndAddOns();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {products.map((product) => (
        // Pass both product and its add-ons to SavoryCard
        <SavoryCard key={product.product_id} product={product} addOns={product.addOns} />
      ))}
    </div>
  );
};

export default SavoryCardContainer;

