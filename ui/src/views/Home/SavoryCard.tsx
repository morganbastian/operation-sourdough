import React, { useState } from 'react'
import {
	Card,
	Typography,
	CardContent,
	FormControl,
	FormControlLabel,
	RadioGroup,
	Radio,
} from '@mui/material'

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

	const handleAddOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedAddOn(event.target.value)
	}

	return (
		<Card sx={{ display: 'flex', flexDirection: 'column' }}>
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
			</CardContent>
		</Card>
	)
}

export default SavoryCard
