import axios from 'axios'

// Initialize Axios instance
const axiosInstance = axios.create({
	baseURL: 'http://127.0.0.1:5000',
})

// Define interfaces/types
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

// Function to fetch savory products and their add-ons
export const fetchSavoryProductsAndAddOns = async (): Promise<
	ProductWithAddOns[]
> => {
	try {
		// Fetch products
		const productResponse = await axiosInstance.get('/products')
		const savoryProducts: Product[] = productResponse.data.filter(
			(product: Product) => product.product_type === 'savory'
		)

		// Fetch add-ons for each savory product
		const productsWithAddOns: ProductWithAddOns[] = await Promise.all(
			savoryProducts.map(async (product) => {
				try {
					const addOnsResponse = await axiosInstance.get(
						`/products/${product.product_id}/add_ons`
					)
					return { ...product, addOns: addOnsResponse.data }
				} catch (error) {
					console.error(
						`Failed to fetch add-ons for product ${product.product_id}`,
						error
					)
					return { ...product, addOns: [] } // Return product without add-ons in case of an error
				}
			})
		)

		return productsWithAddOns
	} catch (error) {
		console.error('Error fetching products and add-ons', error)
		throw error // Re-throw the error to be handled by the caller
	}
}

export const fetchSweetProductsAndAddOns = async (): Promise<
	ProductWithAddOns[]
> => {
	try {
		const productResponse = await axiosInstance.get('/products')
		const sweetProducts: Product[] = productResponse.data.filter(
			(product: Product) => product.product_type === 'sweet'
		)

		const productsWithAddOns: ProductWithAddOns[] = await Promise.all(
			sweetProducts.map(async (product) => {
				try {
					const addOnsResponse = await axiosInstance.get(
						`/products/${product.product_id}/add_ons`
					)
					return { ...product, addOns: addOnsResponse.data }
				} catch (error) {
					console.error(
						`Failed to fetch add-ons for product ${product.product_id}`,
						error
					)
					return { ...product, addOns: [] } // Return product without add-ons in case of an error
				}
			})
		)

		return productsWithAddOns
	} catch (error) {
		console.error('Error fetching sweet products and add-ons', error)
		throw error // Re-throw the error to be handled by the caller
	}
}
