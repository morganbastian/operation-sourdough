import React, { useState, useRef, useEffect } from 'react'
import {
	Card,
	CardContent,
	Typography,
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

const SweetCard: React.FC<Props> = ({ product, addOns }) => {
	const [selectedAddOn, setSelectedAddOn] = useState('')
	const [counter, setCounter] = useState(0)

	const radioGroupRef = useRef<HTMLFieldSetElement>(null)
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				radioGroupRef.current &&
				!radioGroupRef.current.contains(event.target as Node)
			) {
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

	return (
		<Card
			sx={{
				display: 'flex',
				flexDirection: 'column',
				width: '300px',
				height: '400px',
			}}
		>
			<CardContent>
				<Typography variant='h5'>{product.name}</Typography>
				<Typography color='text.secondary'>{product.description}</Typography>
				<Typography>Price: ${product.price}</Typography>
				{addOns.length > 0 && (
					<FormControl component='fieldset' sx={{ mt: 2 }} ref={radioGroupRef}>
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
			</CardContent>
		</Card>
	)
}

export default SweetCard
