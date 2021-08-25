import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';
import { useMutation } from '@apollo/client';
import { EDIT_AREA } from '../../utils/mutations';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_HOME } from '../../utils/actions';

import Snack from '../Snack';

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

export default function EditArea({
	areaId,
	areaName,
	areaIcon,
	setHome,
	setEditAreaModalOpen,
}) {
	const [state, dispatch] = useStoreContext();
	const classes = useStyles();
	const [snack, setSnack] = useState({ status: false, message: '' });
	const [formState, setFormState] = useState({
		areaId: areaId,
		name: areaName,
		icon: areaIcon,
	});
	const [editArea, { error }] = useMutation(EDIT_AREA);

	const handleFormSubmit = async (event) => {
		event.preventDefault();
		if (formState.name) {
			try {
				const mutationResponse = await editArea({
					variables: {
						areaId: formState.areaId,
						name: formState.name,
						icon: formState.icon,
					},
				});
				if (mutationResponse) {
					const stateHome = mutationResponse.data.editArea;
					dispatch({ type: UPDATE_HOME, home: stateHome });
					const newHome = {
						home: {
							...mutationResponse.data.editArea,
						},
					};
					setHome(newHome);
					setEditAreaModalOpen(false);
					setSnack({
						status: true,
						message: `${formState.name} has been updated`,
					});
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
								<h3>Edit area</h3>
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
											id='name'
											label='Name'
											defaultValue={areaName}
											helperText='Area name'
											variant='standard'
											onChange={handleChange}
										/>
										<TextField
											disabled
											id='icon'
											label='Icon'
											defaultValue={areaIcon}
											helperText='Area icon'
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
										Edit Area
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
