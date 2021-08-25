import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function SignUp() {
	const classes = useStyles();
	const history = useHistory();

	const [formState, setFormState] = useState({
		dob: '',
		firstName: '',
		lastName: '',
		username: '',
		email: '',
		password: '',
	});
	const [addUser, { error, data }] = useMutation(ADD_USER);

	const handleChange = (event) => {
		const { name, value } = event.target;

		setFormState({
			...formState,
			[name]: value,
		});
	};

	const handleFormSubmit = async (event) => {
		event.preventDefault();

		if (
			formState.password &&
			formState.password2 &&
			formState.firstName &&
			formState.lastName &&
			formState.dob &&
			formState.email &&
			formState.username
		) {
			if (formState.password !== formState.password2) {
				setFormState({ ...formState, errorMsg: 'Passwords do not match' });
			}
			if (formState.password === formState.password2) {
				try {
					const { data } = await addUser({
						variables: {
							email: formState.email.toLowerCase(),
							firstName: formState.firstName,
							lastName: formState.lastName,
							dob: formState.dob,
							username: formState.username.toLowerCase(),
							password: formState.password,
							password2: formState.password2,
						},
					});
					Auth.login(data.addUser.token);
					history.push('/home');
				} catch (e) {
					setFormState({
						...formState,
						errorMsg: 'Something went wrong signing up',
					});
					console.error(e);
				}
			}
		}
		if (
			!formState.password ||
			!formState.password2 ||
			!formState.firstName ||
			!formState.lastName ||
			!formState.dob ||
			!formState.email ||
			!formState.username
		) {
			setFormState({
				...formState,
				errorMsg: 'Must fill in all required fields',
			});
		}
	};

	return (
		<Container component='main' maxWidth='xs'>
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component='h1' variant='h5'>
					Sign up
				</Typography>
				<form onSubmit={handleFormSubmit} className={classes.form} noValidate>
					<Grid container spacing={1}>
						<Grid item xs={12}>
							<TextField
								autoComplete='fname'
								name='firstName'
								variant='outlined'
								required
								fullWidth
								id='firstName'
								label='First Name'
								autoFocus
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant='outlined'
								required
								fullWidth
								id='lastName'
								label='Last Name'
								name='lastName'
								autoComplete='lname'
								onChange={handleChange}
							/>
						</Grid>
						<label htmlFor='dob'>Date of Birth</label>
						<Grid item xs={12}>
							<TextField
								variant='outlined'
								required
								fullWidth
								id='dob'
								// label="Date of Birth"
								placeholder='asdfasdf'
								name='dob'
								type='date'
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant='outlined'
								required
								fullWidth
								id='email'
								label='Email Address'
								name='email'
								autoComplete='email'
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant='outlined'
								required
								fullWidth
								id='username'
								label='Username'
								name='username'
								autoComplete='username'
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant='outlined'
								required
								fullWidth
								name='password'
								label='Password'
								type='password'
								id='password'
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant='outlined'
								required
								fullWidth
								name='password2'
								label='Confirm Password'
								type='password'
								id='password2'
								onChange={handleChange}
							/>
						</Grid>
					</Grid>
					<br></br>
					<Typography variant='body1' color='error'>
						{formState.errorMsg}
					</Typography>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						color='primary'
						className={classes.submit}
					>
						Sign Up
					</Button>
				</form>
			</div>
		</Container>
	);
}
