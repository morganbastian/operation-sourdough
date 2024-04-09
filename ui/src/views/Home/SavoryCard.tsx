import React, { useState, useRef, useEffect } from 'react'
import { useCart } from '../Cart/CartContext'
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
	const [selectedAddOnId, setSelectedAddOnId] = useState<string | null>(null)
	const [counter, setCounter] = useState(0)
	const cardRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
				setSelectedAddOnId(null)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handleAddOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedAddOnId(event.target.value)
	}

	const handleIncrement = () => setCounter((prevCounter) => prevCounter + 1)
	const handleDecrement = () =>
		setCounter((prevCounter) => Math.max(0, prevCounter - 1))

	const { addToCart } = useCart()

	const handleAddToCart = () => {
		const selectedAddOn = addOns.find(
			(addOn) => String(addOn.add_on_id) === selectedAddOnId
		)

		const item = {
			product_id: product.product_id,
			name: product.name,
			description: product.description,
			price: product.price,
			product_type: product.product_type,
			selectedAddOn: selectedAddOn || null,
			quantity: counter,
		}

		addToCart(item)
		console.log('Item added to cart:', item, 'type of price:', typeof(item.price))
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
							value={selectedAddOnId || ''}
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
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: '20px',
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
