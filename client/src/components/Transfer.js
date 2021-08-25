import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import {
	Card,
	CardContent,
	Typography,
	makeStyles,
	Grid,
	TextField,
	Box,
	Button,
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import { CREATE_TRANSFER } from '../utils/mutations';
import HomeCard from '../components/HomeCard';

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 345,
	},
	media: {
		height: 0,
		paddingTop: '56.25%', // 16:9
	},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
	avatar: {
		backgroundColor: red[500],
	},
}));

function Transfer({ home, setTransferModalOpen }) {
	const { email } = Auth.getProfile().data;
	const classes = useStyles();
	const [formState, setFormState] = useState({
		transferEmail: '',
	});

	const [createTransfer, { error }] = useMutation(CREATE_TRANSFER);

	const handleChange = (event) => {
		const { id, value } = event.target;
		setFormState({
			...formState,
			[id]: value,
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (formState.transferEmail) {
			try {
				const mutationResponse = await createTransfer({
					variables: {
						transferer: email,
						receiver: formState.transferEmail,
						home: home._id,
					},
				});
				if (mutationResponse) {
					setTransferModalOpen(false);
				}
			} catch (e) {
				console.log(e);
			}
		}
	};

	const handleCancel = (event) => {
		setTransferModalOpen(false);
	};

	return (
		<>
			<Card key={'homeId'} className={classes.root} variant='outlined'>
				<CardContent>
					<div className={classes.gridRoot}>
						<Grid container spacing={1}>
							<h3>Transfer</h3>
							<HomeCard home={home} />
							<Grid item xs={12}>
								<Box
									display='flex'
									justifyContent='center'
									alignItems='center'
									xs={12}
									md={2}
									lg={3}
								>
									<TransferWithinAStationIcon fontSize='large' />
								</Box>
							</Grid>
							<Grid item xs={12}>
								<Box
									display='flex'
									justifyContent='center'
									alignItems='center'
									ml={2}
								>
									<Card>
										<CardContent>
											<TextField
												name='transferEmail'
												variant='standard'
												fullWidth
												id='transferEmail'
												label='Email of Receiver'
												defaultValue=''
												onChange={handleChange}
											/>
										</CardContent>
									</Card>
								</Box>
							</Grid>

							<Box mx={3} paddingTop={2} alignItems='center'>
								<Button variant='contained' color='secondary'>
									<Typography variant='button' onClick={handleCancel}>
										Cancel
									</Typography>
								</Button>

								<Button variant='contained' color='primary'>
									<Typography variant='button' onClick={handleSubmit}>
										Save & Close
									</Typography>
								</Button>
							</Box>
						</Grid>
					</div>
				</CardContent>
			</Card>
		</>
	);
}

export default Transfer;
