import React, { useState } from 'react';
import {
	Avatar,
	Button,
	CssBaseline,
	TextField,
	Link,
	Grid,
	Typography,
	Modal,
	InputAdornment,
	IconButton,
	useTheme,
	makeStyles,
} from '@material-ui/core';
import { LockOutlined, Visibility, VisibilityOff } from '@material-ui/icons';
import { useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { LOGIN } from '../utils/mutations';
import { useStoreContext } from '../utils/GlobalState';
import { UPDATE_USER, UPDATE_TRANSFERS } from '../utils/actions';
import { useHistory } from 'react-router-dom';
import SignUp from '../components/SignUp';

const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh',
	},
	paper: {
		margin: theme.spacing(8, 4),
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
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function SignIn() {
	const classes = useStyles();
	const history = useHistory();
	const [state, dispatch] = useStoreContext();
	const theme = useTheme();

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const [open, setOpen] = useState(false);

	const modal = (
		<Grid
			container
			style={{
				justifyContent: 'center',
				backgroundColor: theme.palette.background.paper,
				borderRadius: '1rem',
			}}
		>
			<Grid item xs={6}>
				<SignUp></SignUp>
			</Grid>
		</Grid>
	);

	const [formState, setFormState] = useState({
		identifier: '',
		password: '',
		errorMsg: '',
	});

	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword(!showPassword);
	const handleMouseDownPassword = () => setShowPassword(!showPassword);

	const [login] = useMutation(LOGIN);

	const handleFormSubmit = async (event) => {
		event.preventDefault();
		try {
			const mutationResponse = await login({
				variables: {
					identifier: formState.identifier.toLowerCase(),
					password: formState.password,
				},
			});
			const { user, token, transfers } = mutationResponse.data.login;
			dispatch({ type: UPDATE_USER, user });
			dispatch({ type: UPDATE_TRANSFERS, transfers });
			Auth.login(token);
			history.push('/home');
		} catch (e) {
			setFormState({ ...formState, errorMsg: 'Incorrect Credentials' });
			console.log(e);
		}
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormState({
			...formState,
			[name]: value,
		});
	};

	return (
		<div>
			<CssBaseline />

			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlined />
				</Avatar>
				<Typography component='h1' variant='h5'>
					Sign in
				</Typography>
				<form className={classes.form} noValidate>
					<TextField
						variant='outlined'
						margin='normal'
						required
						fullWidth
						id='identifier'
						label='Email/Username'
						name='identifier'
						autoComplete='identifier'
						autoFocus
						onChange={handleChange}
					/>
					<TextField
						variant='outlined'
						margin='normal'
						required
						fullWidth
						name='password'
						label='Password'
						// showPassword state defaulted to false, will show text (showing) or password (hidden)
						type={showPassword ? 'text' : 'password'}
						id='password'
						autoComplete='current-password'
						onChange={handleChange}
						InputProps={{
							// This is where the toggle button is added.
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton
										aria-label='toggle password visibility'
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
									>
										{showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					<Typography variant='body1' color='error'>
						{formState.errorMsg}
					</Typography>
					<br></br>
					<Button
						onClick={handleFormSubmit}
						type='submit'
						fullWidth
						variant='contained'
						color='primary'
						className={classes.submit}
					>
						Sign In
					</Button>
					<Grid container justifyContent='center'>
						<Grid item>
							<Link href='#' variant='body2' onClick={handleOpen}>
								Or Sign Up
							</Link>
							<Modal
								open={open}
								onClose={handleClose}
								aria-labelledby='simple-modal-title'
								aria-describedby='simple-modal-description'
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<Grid
									container
									style={{
										justifyContent: 'center',
										backgroundColor: theme.palette.background.paper,
										borderRadius: '1rem',
										maxHeight: '80vh',
										maxWidth: '650px',
										overflowY: 'auto',
									}}
								>
									<Grid
										item
										style={{ maxHeight: '80vh', overflowY: 'auto' }}
										xs={12}
									>
										<SignUp></SignUp>
									</Grid>
								</Grid>
							</Modal>
						</Grid>
					</Grid>
				</form>
			</div>
		</div>
	);
}
