import React from 'react';
import Content from '../components/Content';
import Auth from '../utils/auth';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
import { Card, CardActionArea, Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { Link } from '@material-ui/core';
import { CardActions } from '@material-ui/core';

function Homes(props) {
	const me = Auth.getProfile().data;
	const { loading, data } = useQuery(QUERY_USER);
	let user;
	if (!loading) {
		user = data.user;
		console.log('user :>> ', user);
		const newArray = user.homes.map((home) => console.log('home :>> ', home));
	}

	return (
		<React.Fragment>
			{loading ? (
				<h1>Loading...</h1>
			) : (
				<React.Fragment>
					<h1>Homes</h1>
					<Grid container spacing={4}>
						{user.homes.map((home) => (
							<Grid item xs={12}>
								<CardActionArea
									style={{ textDecoration: 'none' }}
									href={'/myhomes/' + home._id}
								>
									<Card>
										<Typography>{home.address.street1}</Typography>
										<Typography>{home.address.street2}</Typography>
										<Typography>
											{home.address.city + ', ' + home.address.state}
										</Typography>
										<Typography>{home.address.zip}</Typography>
									</Card>
								</CardActionArea>
							</Grid>
						))}
					</Grid>
				</React.Fragment>
			)}
		</React.Fragment>
	);
}

export default Homes;
