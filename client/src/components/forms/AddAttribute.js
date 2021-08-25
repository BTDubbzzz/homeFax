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
import { ADD_ATTRIBUTE } from '../../utils/mutations';
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

export default function AddAttribute({
	areaName,
	areaId,
	setHome,
	setAttributeModalOpen,
}) {
	const [state, dispatch] = useStoreContext();
	const classes = useStyles();
	const [snack, setSnack] = useState({ status: false, message: '' });
	const [formState, setFormState] = useState({ areaId: areaId, type: '' });
	const [addAttribute, { error }] = useMutation(ADD_ATTRIBUTE);
	const handleFormSubmit = async (event) => {
		event.preventDefault();
		if (formState.type) {
			try {
				const mutationResponse = await addAttribute({
					variables: {
						areaId: formState.areaId,
						type: formState.type,
					},
				});
				if (mutationResponse) {
					const stateHome = mutationResponse.data.addAttribute;
					dispatch({ type: UPDATE_HOME, home: stateHome });
					setSnack({
						status: true,
						message: `${formState.type} added to ${areaName}`,
					});
					const newHome = {
						home: {
							...mutationResponse.data.addAttribute,
						},
					};
					setHome(newHome);
					setAttributeModalOpen(false);
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
								<h3>{capitalize(areaName)}</h3>
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
											id='type'
											label='Type'
											helperText='Attribute detail'
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
										Save Attribute
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
							<Grid item xs={12} s={6}>
								<p>
									An attribute is part of an area. For instance in your kitchen
									there are many different things - appliances, dishes, paint
									color, etc. - and these are what we call "attributes".
								</p>
								<p>
									An attribute has a type. Your toaster is an attribute with
									"type" "toaster".
								</p>
							</Grid>
						</Grid>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
