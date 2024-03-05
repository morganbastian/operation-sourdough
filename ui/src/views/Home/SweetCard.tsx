import React, { useEffect, useState } from 'react';
import api from '../../utility/api';

interface Props {}

const SweetCard: React.FC<Props> = ({}) => {
	const [productData, setProudctData] = useState([])


  useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await api.get('/products')
        setProudctData(response.data)
			} catch (error) {
				console.error('Error fetching product data:', error)
			}
		}
		fetchProducts()
	}, [])

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