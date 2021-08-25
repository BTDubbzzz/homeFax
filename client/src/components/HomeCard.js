import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import HomeIcon from '@material-ui/icons/Home';

const useStyles = makeStyles({
	root: {
		minWidth: 275,
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},
});

export default function OutlinedCard({ home }) {
	const classes = useStyles();

	return (
		<>
			<Card className={classes.root} variant='outlined'>
				<CardContent>
					<Typography
						className={classes.title}
						color='textSecondary'
						gutterBottom
					>
						<HomeIcon />
					</Typography>
					<Typography variant='h5' component='h2'>
						{home.address.street1}
					</Typography>
					<Typography className={classes.pos} color='textSecondary'>
						{home.address.street2}
					</Typography>
					<Typography variant='body2' component='p'>
						{home.address.city}, {home.address.state} {home.address.zip}
					</Typography>
				</CardContent>
			</Card>
		</>
	);
}
