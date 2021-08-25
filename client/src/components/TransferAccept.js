import React from 'react';
import { useMutation } from '@apollo/client';
import {
	Card,
	CardContent,
	Typography,
	makeStyles,
	Grid,
	Box,
	Button,
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import { TRANSFER_HOME } from '../utils/mutations';
import HomeCard from './HomeCard';
import { useStoreContext } from '../utils/GlobalState';
import { UPDATE_TRANSFERS, UPDATE_USER } from '../utils/actions';

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
	margin: {
		margin: theme.spacing(1),
	},
}));

function TransferAccept({ home, transfer, setTransferModalOpen }) {
	const classes = useStyles();
	const [state, dispatch] = useStoreContext();

	const [acceptTransfer, { error }] = useMutation(TRANSFER_HOME);

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const mutationResponse = await acceptTransfer({
				variables: {
					transferer: transfer.transferer[0],
					receiver: transfer.receiver[0],
					home: transfer.home._id,
				},
			});
			if (mutationResponse) {
				const stateTransfers = mutationResponse.data.transferHome.transfers;
				const stateUser = mutationResponse.data.transferHome.user;
				setTransferModalOpen(false);
				dispatch({ type: UPDATE_TRANSFERS, transfers: stateTransfers });
				dispatch({ type: UPDATE_USER, user: stateUser });
			}
		} catch (e) {
			console.log(e);
		}
	};

	const handleCancel = (event) => {
		setTransferModalOpen(false);
	};

	const handleReject = (event) => {
		setTransferModalOpen(false);
	};

	return (
		<>
			<Card key={'homeId'} className={classes.root} variant='outlined'>
				<CardContent>
					<div className={classes.gridRoot}>
						<Grid container spacing={1}>
							{transfer ? (
								<div>
									<h3>Transfer</h3>
									<HomeCard home={home} />
								</div>
							) : (
								<h3>No Homes</h3>
							)}
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

							<Box mx={2} paddingTop={2} alignItems='center'>
								<Button
									variant='contained'
									color='secondary'
									size='small'
									className={classes.margin}
								>
									<Typography variant='button' onClick={handleCancel}>
										Cancel
									</Typography>
								</Button>

								{home ? (
									<Button
										variant='contained'
										color='primary'
										size='small'
										className={classes.margin}
									>
										<Typography variant='button' onClick={handleSubmit}>
											Accept
										</Typography>
									</Button>
								) : (
									''
								)}
								{home ? (
									<Button
										variant='contained'
										color='primary'
										size='small'
										className={classes.margin}
									>
										<Typography variant='button' onClick={handleReject}>
											Reject
										</Typography>
									</Button>
								) : (
									''
								)}
							</Box>
						</Grid>
					</div>
				</CardContent>
			</Card>
		</>
	);
}

export default TransferAccept;
