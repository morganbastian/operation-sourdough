import React, { useEffect, useState } from 'react';
import api from '../../utility/api';

interface Props {}

const SweetCard: React.FC<Props> = ({}) => {
  const [productData, setProductData] = useState([])
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await api.get('/products')
				setProductData(response.data)
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : 'An error occurred'
				setError(`Error fetching product data: ${errorMessage}`)
			}
		}
		fetchProducts()
	}, [])
	if (error) {
		return <div>{error}</div>
	}

  return (
    <div>
    {productData.map((product: any) => {
      if (product.product_type === 'sweet') {
        return (
          <div key={product.product_id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>{product.price}</p>
          </div>
        );
      }
    })}
  </div>
  );
};

export default SweetCard;