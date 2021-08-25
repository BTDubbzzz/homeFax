import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';
import { useMutation } from '@apollo/client';
import { EDIT_DETAIL } from '../../utils/mutations';
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

export default function EditDetail({
	detailId,
	detailKey,
	detailValue,
	detailDate,
	setHome,
	setDetailIndex,
}) {
	const [state, dispatch] = useStoreContext();
	const classes = useStyles();
	const [snack, setSnack] = useState({ status: false, message: '' });
	const [formState, setFormState] = useState({
		detailId: detailId,
		key: detailKey,
		value: detailValue,
		date: detailDate,
	});
	const [editDetail, { error }] = useMutation(EDIT_DETAIL);
	const handleFormSubmit = async (event) => {
		event.preventDefault();
		if (formState.key && formState.value) {
			try {
				const mutationResponse = await editDetail({
					variables: {
						detailId: formState.detailId,
						key: formState.key,
						value: formState.value,
						date: formState.date,
					},
				});
				if (mutationResponse) {
					const stateHome = mutationResponse.data.editDetail;
					dispatch({ type: UPDATE_HOME, home: stateHome });
					const newHome = {
						home: {
							...mutationResponse.data.editDetail,
						},
					};
					console.log('newHome :>> ', newHome);
					setHome(newHome);
					setDetailIndex(-1);
					console.log(mutationResponse);
					setSnack({ status: true, message: 'Detail updated' });
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
								<h3>Edit Detail</h3>
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
											id='key'
											label='Detail'
											defaultValue={detailKey}
											helperText='Attribute detail'
											variant='standard'
											onChange={handleChange}
										/>
										<TextField
											id='value'
											label='Value'
											defaultValue={detailValue}
											helperText='Attribute detail value'
											onChange={handleChange}
											variant='standard'
										/>
										{detailDate ? (
											<TextField
												id='date'
												type='date'
												defaultValue={detailDate}
												helperText='Associated date'
												variant='standard'
												onChange={handleChange}
											/>
										) : (
											<TextField
												id='date'
												type='date'
												helperText='Associated date'
												variant='standard'
												onChange={handleChange}
											/>
										)}
									</div>
									<Button
										color='primary'
										variant='outlined'
										size='large'
										type='submit'
										onClick={handleFormSubmit}
									>
										Edit Detail
									</Button>
									{snack.status ? (
										<Snack
											setOpen={setSnack}
											status={snack.status}
											message={snack.message}
										/>
									) : null}
								</form>
							</Grid>
						</Grid>
					</div>
				</CardContent>
				{/* <CardActions>
                <Button
                color="primary"
                variant="outlined"
                size="large"
                onSubmit={handleFormSubmit}>
                    Save Detail
                </Button>
                {snack.status ? (
                    <Snack
                    setOpen={setSnack}
                    status={snack.status}
                    attributeName={attributeName}
                    detailKey={formState.key}
                    />
                ) : (
                    null
                )}
            </CardActions> */}
			</Card>
		</>
	);
}
