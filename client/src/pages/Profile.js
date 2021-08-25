import React from 'react';
import Auth from '../utils/auth';
import { Card } from '@material-ui/core';
import { CardHeader } from '@material-ui/core';
import { CardContent } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Collapse } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { Link } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { useState } from 'react';
import { Box } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import {
	DELETE_PROFILE,
	UPDATE_PASSWORD,
	UPDATE_USER,
} from '../utils/mutations';

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

function Profile(props) {
	const { email, username, firstName, lastName, _id } = Auth.getProfile().data;
	const classes = useStyles();
	const [expanded, setExpanded] = useState(false);
	const [contactExpanded, setContactExpanded] = useState(false);
	const [passwordExpanded, setPasswordExpanded] = useState(false);
	const [deleteExpanded, setDeleteExpanded] = useState(false);
	const [updateUser] = useMutation(UPDATE_USER);
	const [changePassword] = useMutation(UPDATE_PASSWORD);
	const [deleteUser] = useMutation(DELETE_PROFILE);

	// Modify e.currentTarget. <- dataId attr
	const handleExpandClick = (e) => {
		switch (e.currentTarget.id) {
			case 'personal':
				setExpanded(!expanded);
				break;
			case 'contact':
				setContactExpanded(!contactExpanded);
				break;
			case 'passwordandsecurity':
				setPasswordExpanded(!passwordExpanded);
				break;
			case 'deleteprofile':
				setDeleteExpanded(!deleteExpanded);
				break;

			default:
				break;
		}
	};

	async function updateProfile() {
		const { data } = await updateUser({
			variables: {
				email: formState.email,
				username,
				firstName: formState.firstName,
				lastName: formState.lastName,
			},
		});
		const token = data.updateUser.token;
		localStorage.setItem('id_token', token);
		setContactExpanded(false);
		setExpanded(false);
	}

	const updateEmail = async () => {
		// Using formState.email and _id, find and update the users email via Apollo and Graphql
		updateProfile();
		setExpanded(false);
	};

	const updateContact = async () => {
		updateProfile();
		setContactExpanded(false);
	};

	const updatePassword = async () => {
		try {
			if (formState.newpassword1 !== formState.newpassword2) {
				alert('password does not match');
			} else {
				const { data } = await changePassword({
					variables: {
						password: formState.currentpassword,
						currentPassword: formState.newpassword2,
					},
				});
				const token = data.updatePassword.token;
				localStorage.setItem('id_token', token);
				setPasswordExpanded(false);
			}
		} catch (error) {
			alert(error);
		}
	};

	const deleteProfile = async () => {
		try {
			const { data } = await deleteUser({
				variables: {
					password: formState.currentpassword,
				},
			});
			if (data.deleteProfile) {
				Auth.logout();
				// window.location.assign('/');
			}
			setDeleteExpanded(false);
		} catch (error) {
			alert(error);
		}
	};

	const [formState, setFormState] = useState({
		dob: '',
		firstName: firstName,
		lastName: lastName,
		username: '',
		email: email,
		password: '',
	});

	const handleChange = (event) => {
		const { name, value } = event.target;

		setFormState({
			...formState,
			[name]: value,
		});
	};

	return (
		<Grid container spacing={4}>
			<Grid item xs={12}>
				<Typography variant='h2'>Profile Settings</Typography>
			</Grid>
			<Grid item xs={2} md={2} lg={2}>
				<Box></Box>
			</Grid>
			<Grid item xs={12} md={8} lg={6}>
				<Card>
					<CardHeader
						action={
							expanded ? (
								<Link
									id='personal'
									style={{ cursor: 'pointer' }}
									onClick={handleExpandClick}
									variant='body2'
								>
									Close
								</Link>
							) : (
								<Link
									id='personal'
									style={{ cursor: 'pointer' }}
									onClick={handleExpandClick}
									variant='body2'
								>
									Update
								</Link>
							)
						}
						title='Personal information'
					/>
					<CardContent>
						{!expanded && (
							<Typography color='textSecondary' variant='h4'>
								{firstName + ' ' + lastName}
							</Typography>
						)}
					</CardContent>
					<Collapse in={expanded} timeout='auto' unmountOnExit>
						<CardContent>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<TextField
										name='firstName'
										variant='standard'
										fullWidth
										id='firstName'
										label='First Name'
										defaultValue={firstName}
										autoFocus
										onChange={handleChange}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										variant='standard'
										fullWidth
										id='lastName'
										label='Last Name'
										name='lastName'
										defaultValue={lastName}
										onChange={handleChange}
									/>
								</Grid>
								<Grid container justifyContent='flex-end'>
									<Box mx={3}>
										<Button
											variant='contained'
											color='secondary'
											onClick={() => setExpanded(!expanded)}
										>
											<Typography variant='button'>Cancel</Typography>
										</Button>
									</Box>
									<Button variant='contained' color='primary'>
										<Typography variant='button' onClick={updateContact}>
											Save & Close
										</Typography>
									</Button>
								</Grid>
							</Grid>
						</CardContent>
					</Collapse>
				</Card>
			</Grid>
			<Grid item xs={2} md={2} lg={4}>
				<Box></Box>
			</Grid>
			<Grid item xs={2} md={2} lg={2}>
				<Box></Box>
			</Grid>
			<Grid item xs={12} md={8} lg={6}>
				<Card>
					<CardHeader
						action={
							contactExpanded ? (
								<Link
									// Add Data Id Attr
									id='contact'
									style={{ cursor: 'pointer' }}
									onClick={handleExpandClick}
									variant='body2'
								>
									Close
								</Link>
							) : (
								<Link
									id='contact'
									style={{ cursor: 'pointer' }}
									onClick={handleExpandClick}
									variant='body2'
								>
									Update
								</Link>
							)
						}
						title='Contact Settings'
						// subheader='Let us know the best way to contact you'
					/>
					<CardContent>
						{!contactExpanded && (
							<Box>
								{/* <Typography color='textPrimary' variant='h4'>
									Email
								</Typography> */}
								<Typography color='textSecondary' variant='h4'>
									{email}
								</Typography>
							</Box>
						)}
					</CardContent>
					<Collapse in={contactExpanded} timeout='auto' unmountOnExit>
						<CardContent>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<TextField
										name='email'
										variant='standard'
										fullWidth
										id='email'
										label='Email'
										defaultValue={email}
										autoFocus
										onChange={handleChange}
									/>
								</Grid>
								<Grid container justifyContent='flex-end'>
									<Box mx={3}>
										<Button
											variant='contained'
											color='secondary'
											onClick={() => setContactExpanded(!contactExpanded)}
										>
											<Typography variant='button'>Cancel</Typography>
										</Button>
									</Box>
									<Button
										variant='contained'
										color='primary'
										id='contact'
										onClick={updateEmail}
									>
										<Typography variant='button'>Save & Close</Typography>
									</Button>
								</Grid>
							</Grid>
						</CardContent>
					</Collapse>
				</Card>
			</Grid>
			<Grid item xs={2} md={2} lg={4}>
				<Box></Box>
			</Grid>
			<Grid item xs={2} md={2} lg={2}>
				<Box></Box>
			</Grid>
			<Grid item xs={12} md={8} lg={6}>
				<Card>
					<CardHeader
						action={
							passwordExpanded ? (
								<Link
									id='passwordandsecurity'
									style={{ cursor: 'pointer' }}
									onClick={handleExpandClick}
									variant='body2'
								>
									Close
								</Link>
							) : (
								<Link
									id='passwordandsecurity'
									style={{ cursor: 'pointer' }}
									onClick={handleExpandClick}
									variant='body2'
								>
									Update
								</Link>
							)
						}
						title='Password and security'
						subheader='Manage your sign in and security settings.'
					/>

					<Collapse in={passwordExpanded} timeout='auto' unmountOnExit>
						<CardContent>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<TextField
										name='currentpassword'
										variant='standard'
										fullWidth
										id='currentpassword'
										label='Current Password'
										autoFocus
										onChange={handleChange}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										name='newpassword1'
										variant='standard'
										fullWidth
										id='newpassword1'
										label='Your New Password'
										autoFocus
										onChange={handleChange}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										name='newpassword2'
										variant='standard'
										fullWidth
										id='newpassword2'
										label='Confirm New Password'
										autoFocus
										onChange={handleChange}
									/>
								</Grid>
								<Grid container justifyContent='flex-end'>
									<Box mx={3}>
										<Button
											variant='contained'
											color='secondary'
											onClick={() => setPasswordExpanded(!passwordExpanded)}
										>
											<Typography variant='button'>Cancel</Typography>
										</Button>
									</Box>
									<Button
										variant='contained'
										color='primary'
										onClick={updatePassword}
									>
										<Typography variant='button'>Save & Close</Typography>
									</Button>
								</Grid>
							</Grid>
						</CardContent>
					</Collapse>
				</Card>
			</Grid>
			<Grid item xs={2} md={2} lg={4}>
				<Box></Box>
			</Grid>
			<Grid item xs={2} md={2} lg={2}>
				<Box></Box>
			</Grid>
			<Grid item xs={12} md={8} lg={6}>
				<Card>
					<CardHeader
						action={
							deleteExpanded ? (
								<Link
									id='deleteprofile'
									style={{ cursor: 'pointer' }}
									onClick={handleExpandClick}
									variant='body2'
								>
									Close
								</Link>
							) : (
								<Link
									id='deleteprofile'
									style={{ cursor: 'pointer', textDecoration: 'underline' }}
									onClick={handleExpandClick}
									variant='body1'
									color='error'
								>
									Delete
								</Link>
							)
						}
						title='Delete my profile'
						subheader='Proceeding will delete your profile data.'
					/>

					<Collapse in={deleteExpanded} timeout='auto' unmountOnExit>
						<CardContent>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<TextField
										name='currentpassword'
										variant='standard'
										fullWidth
										id='currentpassword'
										label='Confirm password'
										autoFocus
										helperText='Your password must match'
										onChange={handleChange}
									/>
								</Grid>
								<Grid container justifyContent='flex-end'>
									<Box mx={3}>
										<Button
											variant='contained'
											color='primary'
											onClick={() => setDeleteExpanded(!deleteExpanded)}
										>
											<Typography variant='button'>Cancel</Typography>
										</Button>
									</Box>
									<Button
										variant='contained'
										color='secondary'
										onClick={deleteProfile}
									>
										<Typography variant='button'>Delete Profile</Typography>
									</Button>
								</Grid>
							</Grid>
						</CardContent>
					</Collapse>
				</Card>
			</Grid>
			<Grid item xs={2} md={2} lg={4}>
				<Box></Box>
			</Grid>
		</Grid>
	);
}

export default Profile;
