import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

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

const SweetCard: React.FC<Props> = ({ product, addOns }) => {
  return (
    <Card>
			<CardContent sx={{ flex: '1 0 auto' }}>
				<Typography variant='h5'>{product.name}</Typography>
				<Typography color='text.secondary'>{product.description}</Typography>
				<Typography>Price: ${product.price}</Typography>
				{addOns.length > 0 && (
					<>
						<Typography variant='h6' sx={{ mt: 2 }}>
							Add-Ons:
						</Typography>
						<ul>
							{addOns.map((addOn) => (
								<li key={addOn.add_on_id}>
									{addOn.name} - ${addOn.price}
								</li>
							))}
						</ul>
					</>
				)}
			</CardContent>
		</Card>
  )
}

export default SweetCard;
