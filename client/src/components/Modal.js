import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import HomeList from './HomeList';

function getModalStyle() {
	return {
		top: `50%`,
		left: `50%`,
		transform: `translate(-50%, -50%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));

export default function SimpleModal({ home }) {
	const classes = useStyles();
	const [modalStyle] = React.useState(getModalStyle);
	const [open, setOpen] = React.useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<span onClick={handleOpen}>View Areas</span>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby='simple-modal-title'
				aria-describedby='simple-modal-description'
			>
				<HomeList home={home} />
			</Modal>
		</div>
	);
}
