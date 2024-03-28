import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' 
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './views/Cart/CartContext' 
import './index.css'

const rootElement = document.getElementById('root')
if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<React.StrictMode>
			<BrowserRouter>
				<CartProvider>
					<App />
				</CartProvider>
			</BrowserRouter>
		</React.StrictMode>
	)
} else {
	console.error('Failed to find the root element')
}
