import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Divider,
	Card,
	CardContent,
	Button,
	Grid,
	TextField,
	MenuItem,
} from '@material-ui/core';
import Snack from '../Snack';
import { useMutation } from '@apollo/client';
import { ADD_HOME, TRANSFER_HOME } from '../../utils/mutations';
import { useStoreContext } from '../../utils/GlobalState';
import { ADD_HOME_TO_USER } from '../../utils/actions';
import Auth from '../../utils/auth';

const unitedStates = [
	{
		name: 'Alabama',
		abbreviation: 'AL',
	},
	{
		name: 'Alaska',
		abbreviation: 'AK',
	},
	{
		name: 'American Samoa',
		abbreviation: 'AS',
	},
	{
		name: 'Arizona',
		abbreviation: 'AZ',
	},
	{
		name: 'Arkansas',
		abbreviation: 'AR',
	},
	{
		name: 'California',
		abbreviation: 'CA',
	},
	{
		name: 'Colorado',
		abbreviation: 'CO',
	},
	{
		name: 'Connecticut',
		abbreviation: 'CT',
	},
	{
		name: 'Delaware',
		abbreviation: 'DE',
	},
	{
		name: 'District Of Columbia',
		abbreviation: 'DC',
	},
	{
		name: 'Federated States Of Micronesia',
		abbreviation: 'FM',
	},
	{
		name: 'Florida',
		abbreviation: 'FL',
	},
	{
		name: 'Georgia',
		abbreviation: 'GA',
	},
	{
		name: 'Guam',
		abbreviation: 'GU',
	},
	{
		name: 'Hawaii',
		abbreviation: 'HI',
	},
	{
		name: 'Idaho',
		abbreviation: 'ID',
	},
	{
		name: 'Illinois',
		abbreviation: 'IL',
	},
	{
		name: 'Indiana',
		abbreviation: 'IN',
	},
	{
		name: 'Iowa',
		abbreviation: 'IA',
	},
	{
		name: 'Kansas',
		abbreviation: 'KS',
	},
	{
		name: 'Kentucky',
		abbreviation: 'KY',
	},
	{
		name: 'Louisiana',
		abbreviation: 'LA',
	},
	{
		name: 'Maine',
		abbreviation: 'ME',
	},
	{
		name: 'Marshall Islands',
		abbreviation: 'MH',
	},
	{
		name: 'Maryland',
		abbreviation: 'MD',
	},
	{
		name: 'Massachusetts',
		abbreviation: 'MA',
	},
	{
		name: 'Michigan',
		abbreviation: 'MI',
	},
	{
		name: 'Minnesota',
		abbreviation: 'MN',
	},
	{
		name: 'Mississippi',
		abbreviation: 'MS',
	},
	{
		name: 'Missouri',
		abbreviation: 'MO',
	},
	{
		name: 'Montana',
		abbreviation: 'MT',
	},
	{
		name: 'Nebraska',
		abbreviation: 'NE',
	},
	{
		name: 'Nevada',
		abbreviation: 'NV',
	},
	{
		name: 'New Hampshire',
		abbreviation: 'NH',
	},
	{
		name: 'New Jersey',
		abbreviation: 'NJ',
	},
	{
		name: 'New Mexico',
		abbreviation: 'NM',
	},
	{
		name: 'New York',
		abbreviation: 'NY',
	},
	{
		name: 'North Carolina',
		abbreviation: 'NC',
	},
	{
		name: 'North Dakota',
		abbreviation: 'ND',
	},
	{
		name: 'Northern Mariana Islands',
		abbreviation: 'MP',
	},
	{
		name: 'Ohio',
		abbreviation: 'OH',
	},
	{
		name: 'Oklahoma',
		abbreviation: 'OK',
	},
	{
		name: 'Oregon',
		abbreviation: 'OR',
	},
	{
		name: 'Palau',
		abbreviation: 'PW',
	},
	{
		name: 'Pennsylvania',
		abbreviation: 'PA',
	},
	{
		name: 'Puerto Rico',
		abbreviation: 'PR',
	},
	{
		name: 'Rhode Island',
		abbreviation: 'RI',
	},
	{
		name: 'South Carolina',
		abbreviation: 'SC',
	},
	{
		name: 'South Dakota',
		abbreviation: 'SD',
	},
	{
		name: 'Tennessee',
		abbreviation: 'TN',
	},
	{
		name: 'Texas',
		abbreviation: 'TX',
	},
	{
		name: 'Utah',
		abbreviation: 'UT',
	},
	{
		name: 'Vermont',
		abbreviation: 'VT',
	},
	{
		name: 'Virgin Islands',
		abbreviation: 'VI',
	},
	{
		name: 'Virginia',
		abbreviation: 'VA',
	},
	{
		name: 'Washington',
		abbreviation: 'WA',
	},
	{
		name: 'West Virginia',
		abbreviation: 'WV',
	},
	{
		name: 'Wisconsin',
		abbreviation: 'WI',
	},
	{
		name: 'Wyoming',
		abbreviation: 'WY',
	},
];
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
	select: {
		margin: theme.spacing(1),
		width: '25ch',
	},
	gridRoot: {
		flexGrow: 1,
	},
}));

export default function AddHome({ userId, handleNext, setHomeData }) {
	const [state, dispatch] = useStoreContext();
	const classes = useStyles();
	const [snack, setSnack] = useState({ status: false, message: '' });
	const [formState, setFormState] = useState({
		street1: '',
		street2: '',
		city: '',
		state: '',
		zip: '',
	});
	const [addHome, { addError }] = useMutation(ADD_HOME);
	const [assignHome, { assignError }] = useMutation(TRANSFER_HOME);

	const handleFormSubmit = async (event) => {
		event.preventDefault();
		if (userId && formState.zip.length == 5 && /^[0-9]+$/.test(formState.zip)) {
			try {
				const mutationResponse = await addHome({
					variables: {
						address: formState,
						areas: [],
					},
				});
				if (mutationResponse) {
					const stateHome = mutationResponse.data.addHome;
					dispatch({ type: ADD_HOME_TO_USER, home: stateHome });
					setHomeData(stateHome);
					const userEmail = Auth.getProfile().data.email
					const user = await assignHome({
						variables: {
							receiver: userEmail,
							home: stateHome._id,
						},
					});
					setSnack({ status: true, message: 'Home added' });
					handleNext();
				}
			} catch (e) {
				console.log(e);
			}
		} else {
			setSnack({
				status: true,
				message:
					'Something went wrong. Please check your information and try again.',
			});
		}
	};

	const handleChange = (event) => {
		const { id, value } = event.target;
		setFormState({
			...formState,
			[id]: value,
		});
	};

	const [open, setOpen] = useState();
	const handleClose = () => {
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleHomeState = (event) => {
		setFormState({
			...formState,
			state: event.target.value,
		});
	};
	return (
		<>
			<Card className={classes.root} variant='outlined'>
				<CardContent>
					<div className={classes.gridRoot}>
						<Grid container spacing={1}>
							<Grid item xs={12}>
								<h3>Add home</h3>
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
											id='street1'
											label='Street(1)'
											variant='standard'
											onChange={handleChange}
										/>
										<TextField
											id='street2'
											label='Street(2)'
											variant='standard'
											onChange={handleChange}
										/>
										<TextField
											required
											id='city'
											label='City'
											variant='standard'
											onChange={handleChange}
										/>
										{/* <TextField
                                    required
                                    id="state"
                                    label="State"
                                    variant="standard"
                                    onChange={handleChange}
                                /> */}
										{/* <InputLabel required id="stateLabel">State</InputLabel> */}
										<TextField
											required
											id='state'
											label='State'
											open={open}
											onChange={handleHomeState}
											value={formState.state}
											select
										>
											<MenuItem value=''>Select a State</MenuItem>
											{unitedStates.map((state, index) => (
												<MenuItem key={index} value={state.abbreviation}>
													{state.name}
												</MenuItem>
											))}
										</TextField>

										<TextField
											required
											id='zip'
											label='Zip'
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
										Save Home
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
