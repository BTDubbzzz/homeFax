import React from 'react';
import Content from '../components/Content';
import {
	CardActionArea,
	CardContent,
	Menu,
	Typography,
} from '@material-ui/core';
import { Button } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_GET_HOME } from '../utils/queries';
import { Card } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { CardHeader } from '@material-ui/core';
import { Collapse } from '@material-ui/core';
import { useState } from 'react';
import { Link } from '@material-ui/core';
import { Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import SignUp from '../components/SignUp';

const useStyles = makeStyles((theme) => ({
	modal: {
		width: '50%',
		justifyContent: 'center',
		backgroundColor: theme.palette.background.paper,
		borderRadius: '1rem',
	},
}));

function MyHome(props) {
	const classes = useStyles();
	const { homeid } = useParams();
	const [expandedId, setExpandedId] = useState(-1);
	const [open, setOpen] = useState(false);
	const [modalIndex, setModalIndex] = useState(-1);

	const { loading, error, data } = useQuery(QUERY_GET_HOME, {
		variables: { homeId: homeid },
	});

	function capitalize(str) {
		const lower = str.toLowerCase();
		return str.charAt(0).toUpperCase() + lower.slice(1);
	}

	if (!loading) {
		console.log('data :>> ', data);
	}

	const handleModalOpen = (i) => {
		setModalIndex(i);
	};

	const handleExpandClick = (i) => {
		setExpandedId(expandedId === i ? -1 : i);
	};

	return (
		<React.Fragment>
			<Grid container spacing={3}>
				{loading ? (
					<h1>Loading...</h1>
				) : (
					<React.Fragment>
						<Grid item xs={12}>
							<h1>{data.home.address.street1}</h1>
							<h1>{data.home.address.city + ', ' + data.home.address.state}</h1>
							<h1>{data.home.address.zip}</h1>
							<br></br>
							<h3>Areas</h3>
						</Grid>

						{data.home.areas.map((area, i) => (
							<React.Fragment>
								<Grid item xs={3}>
									<Card>
										<CardHeader
											action={
												<Link
													style={{ cursor: 'pointer' }}
													onClick={() => {
														// console.log('i :>> ', i);
														handleExpandClick(i);
													}}
												>
													Inspect
												</Link>
											}
											title={capitalize(area.name)}
										></CardHeader>
										{expandedId !== i && (
											<CardContent>
												{area.attributes.length +
													(area.attributes.length === 1 ? ' attribute' : 'attributes')}
											</CardContent>
										)}
										<Collapse in={expandedId === i}>
											<CardContent>
												{area.attributes.map((attribute, j) => (
													<React.Fragment>
														<Grid item xs={12}>
															<Typography gutterBottom="true" variant="p" xs={12}>
																<Link
																	onClick={() => {
																		console.log('i :>> ', i);
																		console.log('j :>> ', j);
																		handleModalOpen(j);
																	}}
																	style={{ textDecoration: 'none', cursor: 'pointer' }}
																>
																	{capitalize(attribute.type)}
																</Link>
															</Typography>
														</Grid>
														<br></br>
														<Grid item xs={3}>
															<Modal
																onClose={() => setModalIndex(-1)}
																open={modalIndex === j && expandedId === i}
															>
																<div className={classes.modal}>
																	{attribute.detail.map((detail) => (
																		<h1>{detail.key + ': ' + detail.value}</h1>
																	))}
																</div>
															</Modal>
														</Grid>
													</React.Fragment>
												))}
												<Typography variant="p">
													<Button variant="contained" color="primary">
														Add Attribute
													</Button>
												</Typography>
											</CardContent>
										</Collapse>
									</Card>
								</Grid>
							</React.Fragment>
						))}
						<Grid item xs={3}>
							<Card>
								<CardActionArea variant="contained">Add Area</CardActionArea>
							</Card>
						</Grid>
					</React.Fragment>
				)}
			</Grid>
		</React.Fragment>
	);
}

export default MyHome;
