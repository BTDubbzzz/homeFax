import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';
import { useMutation } from '@apollo/client';
import { EDIT_ATTRIBUTE } from '../../utils/mutations';
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

export default function EditAttribute({
	attType,
	attId,
	setHome,
	setAttributeIndex,
}) {
	const [state, dispatch] = useStoreContext();
	const classes = useStyles();
	const [snack, setSnack] = useState({ status: false, message: '' });
	const [formState, setFormState] = useState({ attId: attId, type: attType });
	const [editAttribute, { error }] = useMutation(EDIT_ATTRIBUTE);
	const handleFormSubmit = async (event) => {
		event.preventDefault();
		if (formState.type) {
			try {
				const mutationResponse = await editAttribute({
					variables: {
						attributeId: formState.attId,
						type: formState.type,
					},
				});
				if (mutationResponse) {
					const stateHome = mutationResponse.data.editAttribute;
					dispatch({ type: UPDATE_HOME, home: stateHome });
					const newHome = {
						home: {
							...mutationResponse.data.editAttribute,
						},
					};
					setHome(newHome);
					setAttributeIndex(-1);
					setSnack({ status: true, message: 'Attribute updated' });
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
								<h3>Edit Attribute</h3>
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
											id='type'
											label='Type'
											defaultValue={attType}
											helperText='Attribute type'
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
										Edit Attribute
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
