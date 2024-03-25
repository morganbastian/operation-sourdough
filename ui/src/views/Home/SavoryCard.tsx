import React, { useState, useRef, useEffect } from 'react'
import {
	Card,
	Typography,
	CardContent,
	FormControl,
	FormControlLabel,
	RadioGroup,
	Radio,
	Button,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

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

interface Props {
	product: Product
	addOns: AddOn[]
}

const SavoryCard: React.FC<Props> = ({ product, addOns }) => {
	const [selectedAddOn, setSelectedAddOn] = useState('')
	const [counter, setCounter] = useState(0)
	const cardRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
				setSelectedAddOn('')
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handleAddOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedAddOn(event.target.value)
	}

	const handleIncrement = () => setCounter((prevCounter) => prevCounter + 1)
	const handleDecrement = () =>
		setCounter((prevCounter) => Math.max(0, prevCounter - 1))

	const handleAddToCart = () => {
		// Logic for adding to cart goes here. For now, we log the selections.
		console.log({
			productId: product.product_id,
			selectedAddOn,
			quantity: counter,
		})
	}

	return (
		<Card
			sx={{
				display: 'flex',
				flexDirection: 'column',
				width: '300px',
				height: '450px',
				margin: '25px',
			}}
			ref={cardRef}
		>
			<CardContent>
				<Typography variant='h5'>{product.name}</Typography>
				<Typography color='text.secondary'>{product.description}</Typography>
				<Typography>Price: ${product.price}</Typography>
				{addOns.length > 0 && (
					<FormControl component='fieldset' sx={{ mt: 2 }}>
						<Typography variant='h6'>Add-Ons:</Typography>
						<RadioGroup
							aria-label='add-ons'
							name='add-ons'
							value={selectedAddOn}
							onChange={handleAddOnChange}
						>
							{addOns.map((addOn) => (
								<FormControlLabel
									key={addOn.add_on_id}
									value={String(addOn.add_on_id)}
									control={<Radio />}
									label={`${addOn.name} - $${addOn.price}`}
								/>
							))}
						</RadioGroup>
					</FormControl>
				)}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						marginTop: '16px',
					}}
				>
					<Button
						variant='outlined'
						onClick={handleDecrement}
						sx={{ minWidth: '36px' }}
					>
						<RemoveIcon />
					</Button>
					<Typography sx={{ marginX: '12px' }}>{counter}</Typography>
					<Button
						variant='outlined'
						onClick={handleIncrement}
						sx={{ minWidth: '36px' }}
					>
						<AddIcon />
					</Button>
				</div>
				{/* Center the Add to Cart Button */}
				<div
					style={{
						display: 'flex',
						justifyContent: 'center', // This centers the button horizontally
						marginTop: '20px', // Adds some space above the button
					}}
				>
					<Button variant='contained' color='primary' onClick={handleAddToCart}>
						Add to Cart
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

export default SavoryCard
