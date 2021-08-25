import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Card,
	CardContent,
	Button,
	Grid,
	Divider,
	TextField,
} from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { ADD_DETAIL } from '../../utils/mutations';
import Snack from '../Snack';

import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_HOME } from '../../utils/actions';

const useStyles = makeStyles((theme) => ({
	root: {
		// minWidth: 275,
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},
	inputRoot: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: '25ch',
		},
	},
	gridRoot: {
		flexGrow: 1,
	},
}));

function capitalize(str) {
	const lower = str.toLowerCase();
	return str.charAt(0).toUpperCase() + lower.slice(1);
}

export default function AddDetail({
	attributeName,
	attributeId,
	setHome,
	setDetailModalOpen,
}) {
	const [state, dispatch] = useStoreContext();
	const classes = useStyles();
	const [snack, setSnack] = useState({ status: false, message: '' });
	const [formState, setFormState] = useState({
		attributeId: attributeId,
		key: '',
		value: '',
		date: '',
	});
	const [addDetail, { error }] = useMutation(ADD_DETAIL);
	const handleFormSubmit = async (event) => {
		event.preventDefault();
		if (formState.key && formState.value) {
			try {
				const mutationResponse = await addDetail({
					variables: {
						attributeId: formState.attributeId,
						key: formState.key,
						value: formState.value,
						date: formState.date,
					},
				});
				if (mutationResponse) {
					const stateHome = mutationResponse.data.addDetail;
					dispatch({ type: UPDATE_HOME, home: stateHome });
					setSnack({
						status: true,
						message: `${formState.key} has been added to ${attributeName}`,
					});
					const newHome = {
						home: {
							...mutationResponse.data.addDetail,
						},
					};
					setHome(newHome);
					setDetailModalOpen(false);
				}
			} catch (e) {
				console.log(e);
			}
		}
	};

	const handleChange = (event) => {
		const { id, value } = event.target;
		setFormState({
			...formState,
			[id]: value,
		});
	};

	return (
		<>
			<Card className={classes.root} variant='outlined'>
				<CardContent>
					<div className={classes.gridRoot}>
						<Grid container spacing={1}>
							<Grid item xs={12}>
								<h1>{capitalize(attributeName)}</h1>
								<Divider />
							</Grid>
							<Grid item xs={12} s={6}>
								<form
									className={classes.inputRoot}
									noValidate
									autoComplete='off'
								>
									<div>
										<TextField
											required
											id='key'
											label='Detail'
											helperText='Attribute detail'
											variant='standard'
											onChange={handleChange}
										/>
										<TextField
											required
											id='value'
											label='Value'
											helperText='Attribute detail value'
											onChange={handleChange}
											variant='standard'
										/>
										<TextField
											id='date'
											type='date'
											helperText='Associated date'
											variant='standard'
											onChange={handleChange}
										/>
									</div>
									<Button
										color='primary'
										variant='outlined'
										size='large'
										type='submit'
										onClick={handleFormSubmit}
									>
										Save Detail
									</Button>
								</form>
								{snack.status ? (
									<Snack
										setOpen={setSnack}
										status={snack.status}
										message={snack.message}
									/>
								) : null}
							</Grid>
						</Grid>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
