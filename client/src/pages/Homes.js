import React from 'react';
import Auth from '../utils/auth';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
import { Card, CardActionArea, Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import HomeCard from '../components/HomeCard';
import { Link } from 'react-router-dom';

function Homes(props) {
	const { loading, data } = useQuery(QUERY_USER);
	let user;
	if (!loading) {
		user = data.user;
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
							<Grid item xs={12} key={`home_${home._id}`}>
								<Link
									to={'/myhomes/' + home._id}
								>
									<HomeCard home={home} />
								</Link>
							</Grid>
						))}
					</Grid>
				</React.Fragment>
			)}
		</React.Fragment>
	);
}

export default Homes;
