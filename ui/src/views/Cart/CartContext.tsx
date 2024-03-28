import React, { createContext, useContext, useState, ReactNode } from 'react';

// Interface for items in the cart
interface CartItem {
    productId: number;
    selectedAddOn?: string;
    quantity: number;
    // You can add more properties as needed
}

// Type definition for the cart context state
interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: number) => void;
}

// Creating the context with an initial undefined state to enforce provider usage
const CartContext = createContext<CartContextType | undefined>(undefined);

// Props interface for the CartProvider component
interface CartProviderProps {
    children: ReactNode;
}

// Implementation of the CartProvider, providing state management for the cart
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Function to add an item to the cart
      const addToCart = (item: CartItem) => {
        setCart((currentCart) => [...currentCart, item]);
      };

      // Function to remove an item from the cart based on productId
      const removeFromCart = (productId: number) => {
        setCart((currentCart) => currentCart.filter(item => item.productId !== productId));
      };

      // The value provided to consumers of the context
      const value = { cart, addToCart, removeFromCart };

      return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
      );
    };

// Custom hook for easy consumption of the cart context
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        // Ensuring the hook is used within a provider
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
