import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import { fetchSweetProductsAndAddOns } from '../../utility/api' 
import SweetCard from './SweetCard'

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

const SweetCardContainer: React.FC = () => {
	const [products, setProducts] = useState<ProductWithAddOns[]>([])
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const initFetch = async () => {
			try {
				const productsWithAddOns = await fetchSweetProductsAndAddOns()
				setProducts(productsWithAddOns)
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : 'An error occurred'
				setError(
					`Error fetching sweet product and add-on data: ${errorMessage}`
				)
			}
		}

		initFetch()
	}, [])

	if (error) {
		return <div>{error}</div>
	}

	return (
		<Grid container spacing={3}>
			{products.map((product) => (
				<Grid item xs={12} sm={6} md={4} key={product.product_id}>
					<SweetCard product={product} addOns={product.addOns} />
				</Grid>
			))}
		</Grid>
	)
}

export default SweetCardContainer
