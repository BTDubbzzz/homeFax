import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
import HomeIcon from '@material-ui/icons/Home';
import Modal from './Modal';

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

export default function OutlinedCard() {
	const { loading, data } = useQuery(QUERY_USER);
	console.log(data);
	let user;
	if (data) {
		user = data.user;
	}

	const classes = useStyles();

	return (
		<>
			{loading ? (
				<span>loading...</span>
			) : (
				user.homes.map((home, index) => (
					<>
						<Card key={home.index} className={classes.root} variant='outlined'>
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
							<CardActions>
								<Button size='small'>
									<Modal home={home} />
								</Button>
							</CardActions>
						</Card>
					</>
				))
			)}
		</>
	);
}
