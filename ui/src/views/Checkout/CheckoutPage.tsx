import React, { useState } from 'react'
import {
	Container,
	Typography,
	Paper,
	Grid,
	TextField,
	Button,
	List,
	ListItem,
	ListItemText,
	Divider,
} from '@mui/material'
import { useCart } from '../Cart/CartContext' // Correctly import useCart

const CheckoutPage: React.FC = () => {
	const { cart, calculateTotal } = useCart() // Use calculateTotal from the cart context
	const [customerDetails, setCustomerDetails] = useState({
		name: '',
		address: '',
		zipCode: '',
		email: '',
		phone: '',
	})

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target
		setCustomerDetails((prevDetails) => ({
			...prevDetails,
			[name]: value,
		}))
	}

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		console.log('Customer Details:', customerDetails)
		// Process checkout here, like sending data to a backend server
	}

	// Use calculateTotal from context to get the total price
	const totalPrice = calculateTotal ? calculateTotal() : 0
	const formattedTotalPrice = totalPrice.toFixed(2)

	return (
		<Container maxWidth='sm'>
			<Paper elevation={3} sx={{ p: 4, my: 4 }}>
				<Typography variant='h5' component='h3' sx={{ mb: 3 }}>
					Checkout
				</Typography>
				<List disablePadding>
					{cart.map((item, index) => (
						<React.Fragment key={index}>
							<ListItem sx={{ py: 1, px: 0 }}>
								<ListItemText
									primary={item.name}
									secondary={`Quantity: ${item.quantity}`}
								/>
								<Typography variant='body2'>
									$
									{(
										item.price +
										(item.selectedAddOn ? item.selectedAddOn.price : 0)
									).toFixed(2)}
								</Typography>
							</ListItem>
							{index < cart.length - 1 && <Divider />}
						</React.Fragment>
					))}
					<ListItem sx={{ py: 1, px: 0 }}>
						<ListItemText primary='Total' />
						<Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>
							${formattedTotalPrice}
						</Typography>
					</ListItem>
				</List>

				<Typography variant='h6' component='h4' sx={{ mt: 3, mb: 2 }}>
					Customer Details
				</Typography>

				<form onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						{Object.entries(customerDetails).map(([key, value]) => (
							<Grid
								item
								xs={key === 'zipCode' || key === 'phone' ? 6 : 12}
								key={key}
							>
								<TextField
									label={
										key.charAt(0).toUpperCase() +
										key
											.slice(1)
											.replace(/([A-Z])/g, ' $1')
											.trim()
									} // Convert camelCase to words
									name={key}
									variant='outlined'
									fullWidth
									required
									value={value}
									onChange={handleInputChange}
								/>
							</Grid>
						))}
					</Grid>
					<Button
						type='submit'
						variant='contained'
						color='primary'
						fullWidth
						sx={{ mt: 3 }}
					>
						Submit Order
					</Button>
				</form>
			</Paper>
		</Container>
	)
}

export default CheckoutPage
