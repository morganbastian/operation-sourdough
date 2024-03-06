import React, { useEffect, useState } from 'react'
import api from '../../utility/api'
import SweetCard from './SweetCard'
import { Grid } from '@mui/material'

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
		const fetchProductsAndAddOns = async () => {
			try {
				// Fetch products
				const productResponse = await api.get('/products')
				const savoryProducts: Product[] = productResponse.data.filter(
					(product: Product) => product.product_type === 'sweet'
				)

				// For each product, fetch its add-ons
				const productsWithAddOns: ProductWithAddOns[] = await Promise.all(
					savoryProducts.map(async (product) => {
						try {
							const addOnsResponse = await api.get(
								`/products/${product.product_id}/add_ons`
							)
							return { ...product, addOns: addOnsResponse.data }
						} catch (error) {
							console.error(
								`Failed to fetch add-ons for product ${product.product_id}`,
								error
							)
							return { ...product, addOns: [] }
						}
					})
				)

				setProducts(productsWithAddOns)
			} catch (error) {
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
					<SweetCard product={product} addOns={product.addOns} />
				</Grid>
			))}
		</Grid>
	)
}

export default SweetCardContainer
