import React from 'react'
import SavoryCard from './SavoryCard'
import SweetCard from './SweetCard'
import Logo from '../../assets/operations-sourdough-logo.jpg'
import { Typography, Button, Grid, Container, Paper } from '@mui/material'
import { Link } from 'react-router-dom'
import SavoryCardContainer from './SavoryCardContainer'
import SweetCardContainer from './SweetCardConatiner'

interface Props {}

const Home: React.FC<Props> = ({}) => {
	return (
		<div>
			<Paper>
      <img src={Logo} alt="Logo" />
				<Typography variant='h1'>Operation Sourdough</Typography>
				<Typography variant='h3'>About Me</Typography>
				<Typography variant='h5'>
					Hi! My name is Lillian Hsu. I am a third year surgery resident at MUSC
					who has recently discovered her passion for all things sourdough!
				</Typography>
				<Typography variant='h4'>Savory</Typography>
				<SavoryCardContainer></SavoryCardContainer>
				<Typography variant='h4'>Sweet</Typography>
				<SweetCardContainer></SweetCardContainer>
				<Button variant='contained'>Checkout</Button>
			</Paper>
		</div>
	)
}

export default Home
