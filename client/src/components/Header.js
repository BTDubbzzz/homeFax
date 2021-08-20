import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import HelpIcon from '@material-ui/icons/Help';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
// import Tab from '@material-ui/core/Tab';
// import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Auth from '../utils/auth';
import { MenuItem } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { useState } from 'react';
import { Menu } from '@material-ui/core';

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
										href='#'
										variant='body2'
									>
										Logout
									</Link>
								) : (
									<Link></Link>
								)}
							</Grid>
							{Auth.loggedIn() && (
								<Grid item>
									<Tooltip
										title={
											transferCount > 0 ? 'Pending Transfer' : 'No Transfers'
										}
									>
										<IconButton color='inherit'>
											<Badge badgeContent={transferCount} color='secondary'>
												<NotificationsIcon />
											</Badge>
										</IconButton>
									</Tooltip>
								</Grid>
							)}
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
											<MenuItem id='profile' onClick={handleClose}>
												Profile
											</MenuItem>
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
