import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import PermMediaOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActual';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';

const token = null;

const styles = (theme) => ({
	categoryHeader: {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
	},
	categoryHeaderPrimary: {
		color: theme.palette.common.white,
	},
	item: {
		'paddingTop': 1,
		'paddingBottom': 1,
		'color': 'rgba(255, 255, 255, 0.7)',
		'&:hover,&:focus': {
			backgroundColor: 'rgba(255, 255, 255, 0.08)',
		},
	},
	itemCategory: {
		backgroundColor: '#232f3e',
		boxShadow: '0 -1px 0 #404854 inset',
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
	},
	firebase: {
		fontSize: 24,
		padding: theme.spacing(2),
		color: theme.palette.common.white,
	},
	itemActiveItem: {
		color: '#4fc3f7',
	},
	itemPrimary: {
		fontSize: 'inherit',
	},
	itemIcon: {
		minWidth: 'auto',
		marginRight: theme.spacing(2),
	},
	divider: {
		marginTop: theme.spacing(2),
	},
	button: {
		'fontSize': 'inherit',
		'paddingTop': 1,
		'paddingBottom': 1,
		'color': 'rgba(255, 255, 255, 0.7)',
		'&:hover,&:focus': {
			backgroundColor: 'rgba(255, 255, 255, 0.08)',
		},
		'marginLeft': theme.spacing(1),
		'marginTop': theme.spacing(2),
	},
});
const categories = [
	{
		id: 'Home Section',
		children: [
			{
				id: 'My Homes',
				icon: <PermMediaOutlinedIcon />,
				path: '/myhomes',
				active: false,
			},
			{
				id: 'Profile',
				icon: <PeopleIcon />,
				path: '/profile',
				active: false,
			},
		],
	},
];

function Navigator(props) {
	const { classes, ...other } = props;

	const isActive = (value) => {
		return window.location.pathname === value;
	};

	return (
		<Drawer variant='permanent' {...other}>
			<List disablePadding>
				<ListItem
					className={clsx(classes.firebase, classes.item, classes.itemCategory)}
				>
					<Link
						to={'/home'}
						style={{ color: 'inherit', textDecoration: 'inherit' }}
					>
						<ListItemIcon className={classes.itemIcon}>
							<HomeIcon />
						</ListItemIcon>
						HomeFax
					</Link>
				</ListItem>

				{categories.map(({ id, children }) =>
					Auth.loggedIn() ? (
						<React.Fragment key={id}>
							<ListItem className={classes.categoryHeader}>
								<ListItemText
									classes={{
										primary: classes.categoryHeaderPrimary,
									}}
								>
									{id}
								</ListItemText>
							</ListItem>
							{children.map(({ id: childId, icon, active, path }, index) => (
								<ListItem
									key={childId}
									component={Link}
									to={path}
									button
									className={clsx(
										classes.item,
										isActive(path) && classes.itemActiveItem
									)}
								>
									<ListItemIcon className={classes.itemIcon}>
										{icon}
									</ListItemIcon>
									<ListItemText
										classes={{
											primary: classes.itemPrimary,
										}}
									>
										{childId}
									</ListItemText>
								</ListItem>
							))}

							<Divider className={classes.divider} />
						</React.Fragment>
					) : null
				)}
			</List>
		</Drawer>
	);
}

Navigator.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigator);
