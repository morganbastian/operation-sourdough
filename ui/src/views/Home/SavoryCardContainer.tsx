import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import { fetchSavoryProductsAndAddOns } from '../../utility/api'
import SavoryCard from './SavoryCard'

interface Product {
	product_id: number
	name: string
	description: string
	price: number
	product_type: string
}

interface AddOn {
	add_on_id: number
	name: string
	price: number
}

interface ProductWithAddOns extends Product {
	addOns: AddOn[]
}

const SavoryCardContainer: React.FC = () => {
	const [products, setProducts] = useState<ProductWithAddOns[]>([])
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchProductsAndAddOns = async () => {
			try {
				// Use the fetchSavoryProductsAndAddOns function to get products and their add-ons
				const productsWithAddOns = await fetchSavoryProductsAndAddOns()
				setProducts(productsWithAddOns)
			} catch (error) {
				// Handle errors
				const errorMessage =
					error instanceof Error ? error.message : 'An error occurred'
				setError(`Error fetching product and add-on data: ${errorMessage}`)
			}
		}

		fetchProductsAndAddOns()
	}, [])

	if (error) {
		return <div>{error}</div>
	}

	return (
		<Grid container spacing={3}>
			{products.map((product) => (
				<Grid item xs={12} sm={6} md={4} key={product.product_id}>
					<SavoryCard product={product} addOns={product.addOns} />
				</Grid>
			))}
		</Grid>
	)
}

export default SavoryCardContainer
