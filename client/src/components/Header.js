import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import Auth from '../utils/auth';
import { MenuItem, Menu, Modal } from '@material-ui/core';
import TransferAccept from './TransferAccept';

import { Link } from 'react-router-dom';

import HomeIcon from '@material-ui/icons/Home';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useStoreContext } from '../utils/GlobalState';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = (theme) => ({
	secondaryBar: {
		zIndex: 0,
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(1.25),
	},
	menuButton: {
		marginLeft: -theme.spacing(1),
	},
	iconButtonAvatar: {
		padding: 4,
	},
	link: {
		'textDecoration': 'none',
		'color': lightColor,
		'&:hover': {
			color: theme.palette.common.white,
		},
	},
	button: {
		borderColor: lightColor,
	},
});

function Header(props) {
	const { classes, onDrawerToggle, transferCount } = props;
	const [state, dispatch] = useStoreContext();
	let transferHome = {};
	if (state.transfers.length) {
		transferHome = state.transfers[0].home;
	}

	const [transferAcceptModalOpen, setTransferAcceptModalOpen] = useState(false);

	const handleTransferAcceptModal = () => {
		if (state.transfers.length) {
			setTransferAcceptModalOpen(!transferAcceptModalOpen);
		}
	};

	const [anchorEl, setAnchorEl] = useState(null);
	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const open = Boolean(anchorEl);

	const handleClose = (event) => {
		if (event.target.id === 'profile') {
			window.location.replace('/profile');
		}
		if (event.target.id === 'logout') {
			Auth.logout();
		}
		setAnchorEl(null);
	};

	return (
		<React.Fragment>
			<AppBar color='primary' position='sticky' elevation={0}>
				{Auth.loggedIn() && (
					<Toolbar className={classes.secondaryBar}>
						<Grid container spacing={1} alignItems='center'>
							<Hidden smUp>
								<Grid item>
									<IconButton
										color='inherit'
										aria-label='open drawer'
										onClick={onDrawerToggle}
										className={classes.menuButton}
									>
										<MenuIcon />
									</IconButton>
								</Grid>
							</Hidden>
							<Grid item xs />
							<Grid item>
								{Auth.loggedIn() ? (
									<Link
										onClick={Auth.logout}
										className={classes.link}
										to='#'
										variant='body2'
									>
										<span className={classes.link}>Logout</span>
									</Link>
								) : null}
							</Grid>
							{Auth.loggedIn() && (
								<Grid item>
									<Link to='/createHome'>
										<Button variant='contained'>
											<AddCircleIcon />
											<HomeIcon />
										</Button>
									</Link>
								</Grid>
							)}
							{Auth.loggedIn() && (
								<Grid item>
									<Tooltip
										title={
											transferCount.length > 0
												? 'Pending Transfer'
												: 'No Transfers'
										}
									>
										<IconButton
											style={{ color: '#fff' }}
											onClick={handleTransferAcceptModal}
										>
											<Badge badgeContent={transferCount} color='secondary'>
												<NotificationsIcon />
											</Badge>
										</IconButton>
									</Tooltip>
								</Grid>
							)}
							<Modal
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignContent: 'center',
									alignItems: 'center',
								}}
								onClose={handleTransferAcceptModal}
								open={transferAcceptModalOpen}
							>
								<TransferAccept
									home={transferHome}
									transfer={state.transfers[0]}
									setTransferModalOpen={setTransferAcceptModalOpen}
								></TransferAccept>
							</Modal>
							{Auth.loggedIn() && (
								<Grid item>
									<div>
										<IconButton
											aria-label='account of current user'
											aria-controls='menu-appbar'
											aria-haspopup='true'
											onClick={handleMenu}
											color='inherit'
											className={classes.iconButtonAvatar}
										>
											<Avatar
												src='/static/images/avatar/1.jpg'
												alt='My Avatar'
											/>

											{/* <AccountCircle /> */}
										</IconButton>
										<Menu
											id='menu-appbar'
											anchorEl={anchorEl}
											anchorOrigin={{
												vertical: 'top',
												horizontal: 'right',
											}}
											keepMounted
											transformOrigin={{
												vertical: 'top',
												horizontal: 'right',
											}}
											open={open}
											onClose={handleClose}
										>
											<Link to='/profile'>
												<MenuItem id='profile'>Profile</MenuItem>
											</Link>
											<MenuItem id='logout' onClick={handleClose}>
												Logout
											</MenuItem>
										</Menu>
									</div>
									{/* <IconButton color="inherit" className={classes.iconButtonAvatar}>
								<Avatar src="/static/images/avatar/1.jpg" alt="My Avatar" />
							</IconButton> */}
								</Grid>
							)}
						</Grid>
					</Toolbar>
				)}
			</AppBar>
		</React.Fragment>
	);
}

Header.propTypes = {
	classes: PropTypes.object.isRequired,
	onDrawerToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(Header);
