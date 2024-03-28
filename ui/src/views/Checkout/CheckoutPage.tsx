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
import { useCart } from '../Cart/CartContext' // Make sure the path matches your file structure

const CheckoutPage: React.FC = () => {
	const { cart } = useCart() // Retrieve cart items using useCart hook
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
		// Process checkout here
	}

	// Calculate the total price of the cart items
	const totalPrice = cart.reduce((total, item) => total + item.price, 0)

	return (
		<Container maxWidth='sm'>
			<Paper elevation={3} sx={{ p: 4, my: 4 }}>
				<Typography variant='h5' component='h3' sx={{ mb: 3 }}>
					Checkout
				</Typography>

				<List disablePadding>
					{cart.map((item, index) => (
						<ListItem key={index} sx={{ py: 1, px: 0 }}>
							<ListItemText
								primary={item.name}
								secondary={`Quantity: ${item.quantity}`}
							/>
							<Typography variant='body2'>${item.price}</Typography>
						</ListItem>
					))}
					<Divider sx={{ my: 2 }} />
					<ListItem sx={{ py: 1, px: 0 }}>
						<ListItemText primary='Total' />
						<Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>
							${totalPrice}
						</Typography>
					</ListItem>
				</List>

				<Typography variant='h6' component='h4' sx={{ mt: 3, mb: 2 }}>
					Customer Details
				</Typography>

				<form onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								label='Name'
								name='name'
								variant='outlined'
								fullWidth
								required
								value={customerDetails.name}
								onChange={handleInputChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label='Address'
								name='address'
								variant='outlined'
								fullWidth
								required
								value={customerDetails.address}
								onChange={handleInputChange}
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								label='Zip Code'
								name='zipCode'
								variant='outlined'
								fullWidth
								required
								value={customerDetails.zipCode}
								onChange={handleInputChange}
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								label='Phone Number'
								name='phone'
								variant='outlined'
								fullWidth
								required
								value={customerDetails.phone}
								onChange={handleInputChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label='Email'
								name='email'
								type='email'
								variant='outlined'
								fullWidth
								required
								value={customerDetails.email}
								onChange={handleInputChange}
							/>
						</Grid>
					</Grid>
					<Button
						type='submit'
						variant='contained'
						color='primary'
						fullWidth
						sx={{ mt: 3 }}
					>
						Proceed
					</Button>
				</form>
			</Paper>
		</Container>
	)
}

export default CheckoutPage
