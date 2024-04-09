import React, { createContext, useContext, useState, ReactNode } from 'react'

// Assuming the AddOn and Product interfaces are defined as follows:
interface AddOn {
	add_on_id: number
	name: string
	price: number
}

interface Product {
	product_id: number
	name: string
	description: string
	price: number
	product_type: string
}

// The CartItem interface now includes an optional selectedAddOn of type AddOn or null
export interface CartItem extends Product {
	selectedAddOn?: AddOn | null
	quantity: number
}

// Type definition for the cart context state
interface CartContextType {
	cart: CartItem[]
	addToCart: (item: CartItem) => void
	removeFromCart: (productId: number) => void
	calculateTotal: () => number
}

// Creating the context with a default value for when it's used without a provider
const CartContext = createContext<CartContextType | undefined>(undefined)

// Props interface for the CartProvider component
interface CartProviderProps {
	children: ReactNode
}

// Implementation of the CartProvider, providing state management for the cart
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
	const [cart, setCart] = useState<CartItem[]>([])

	const addToCart = (item: CartItem) => {
		setCart((currentCart) => {
			// Find the index of the item in the cart, considering add-ons
			const existingItemIndex = currentCart.findIndex(
				(cartItem) =>
					cartItem.product_id === item.product_id &&
					((cartItem.selectedAddOn &&
						item.selectedAddOn &&
						cartItem.selectedAddOn.add_on_id ===
							item.selectedAddOn.add_on_id) ||
						(!cartItem.selectedAddOn && !item.selectedAddOn)) // Ensure both items either have or do not have add-ons
			)

			if (existingItemIndex > -1) {
				// Update quantity if item exists
				const newCart = [...currentCart]
				newCart[existingItemIndex].quantity += item.quantity
				return newCart
			} else {
				// Add new item to the cart
				return [...currentCart, item]
			}
		})
	}

	const removeFromCart = (productId: number) => {
		setCart((currentCart) =>
			currentCart.filter((item) => item.product_id !== productId)
		)
	}

	const calculateTotal = () => {
		return cart.reduce((total, item) => {
			// Check if there's a selected add-on and include its price with the product price
			const itemTotalPrice = item.price + (item.selectedAddOn ? item.selectedAddOn.price : 0);
			return total + itemTotalPrice * item.quantity;
		}, 0);
	};
	

	// The value provided to consumers of the context
	const value = { cart, addToCart, removeFromCart, calculateTotal }

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Custom hook for easy consumption of the cart context
export const useCart = (): CartContextType => {
	const context = useContext(CartContext)
	if (context === undefined) {
		throw new Error('useCart must be used within a CartProvider')
	}
	return context
}
