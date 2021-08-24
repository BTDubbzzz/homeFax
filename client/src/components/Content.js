import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { useStoreContext } from '../utils/GlobalState';
import Button from '@material-ui/core/Button';
import DescriptionIcon from '@material-ui/icons/Description';
import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';

const styles = (theme) => ({
	paper: {
		maxWidth: 936,
		margin: 'auto',
		overflow: 'hidden',
	},
	searchBar: {
		borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
	},
	searchInput: {
		fontSize: theme.typography.fontSize,
	},
	block: {
		display: 'block',
	},
	addUser: {
		marginRight: theme.spacing(1),
	},
	contentWrapper: {
		margin: '40px 16px',
	},
	button: {
		marginTop: '20px',
	},
});

function Content(props) {
	const { classes } = props;

	const [state] = useStoreContext();

	const homeData = state.user.homes[0];

	// homeData.map((address) => {
	// 	return [
	// 		{ text: address.street1 },
	// 		{ text: address.street2 },
	// 		{ text: address.city },
	// 		{ text: address.state },
	// 		{ text: address.zip },
	// 	];
	// });

	// function getAddress(data) {
	// 	return [
	// 		{ text: data.address.street1 },
	// 		{ text: data.address.street2 },
	// 		{ text: data.address.city },
	// 		{ text: data.address.state },
	// 		{ text: data.address.zip },
	// 	];
	// }
	// console.log(homeData.map(getAddress));
	console.log(homeData.areas);
	const areaData = homeData.areas;
	const addressData = homeData.address;
	const _formatAddress = (data) => {
		return [
			{ text: data.street1 },
			{ text: data.street2 },
			{ text: data.city },
			{ text: data.state },
			{ text: data.zip },
		];
	};
	const _formatArea = (data) => {
		let formattedData = [];
		for (let i = 0; i < data.length; i++) {
			console.log(data[i].name);
			formattedData.push({ text: data[i].name });
			for (let j = 0; j < data[i].attributes.length; j++) {
				console.log(data[i].attributes[j].type);
				formattedData.push({ text: data[i].attributes[j].type });
				for (let k = 0; k < data[i].attributes[j].detail.length; k++) {
					console.log(data[i].attributes[j].detail[k].key);
					if (data[i].attributes[j].detail[k].date) {
						formattedData.push({
							text: `${data[i].attributes[j].detail[k].date}`,
						});
					}
					formattedData.push({
						text: `${data[i].attributes[j].detail[k].key} -- ${data[i].attributes[j].detail[k].value}`,
					});
				}
			}
		}
		return formattedData;
	};

	function GenerateReport() {
		const { vfs } = vfsFonts.pdfMake;
		pdfMake.vfs = vfs;

		const homeAddress = _formatAddress(addressData);
		const homeArea = _formatArea(areaData);

		const documentDefinition = {
			pageSize: 'A4',
			pageOrientation: 'portiat',
			content: [{ text: 'HomeFax Report' }, '\n', homeAddress, '\n', homeArea],
		};

		pdfMake.createPdf(documentDefinition).open();
	}

	return (
		<Paper className={classes.paper}>
			<div className={classes.contentWrapper} align='center'>
				<Typography
					variant='h4'
					style={{ textAlign: 'center', fontWeight: 600 }}
				>
					Welcome to HomeFax!
				</Typography>
				<Divider />
				<br />
				<Typography color='textSecondary' align='center'>
					What Is HomeFax? Homefax is an application designed to help homeowners keep updated records of their homes and all maintenance involved. To start, the user has the option to add a home. Once saved, the user may add an area of that home and in these areas, they can also add an attribute. This is to help keep track of things such as paint color and brand, or part names and model numbers. If the user wants to add a detail to a specific attribute, they have the option as well as the ability to give an associated date. All of this information is stored inside of a database and can be transferred to a new owner if the user decides they want to transfer the home to another person. To do this, all the transferrer needs is the recipient email address of the transferee. The next time the recipient logs in they will be presented with a bell notification displaying how many pending transfers they have waiting. From here they can choose to accept the transfer and it will from then on be listed in their homes page. If a user wants to remove a house from their homes page manually, they can. Users also can update their email address, names, password, and delete their account.
				</Typography>
				<Typography color='textSecondary' align='center'></Typography>

				<Button
					onClick={GenerateReport}
					variant='contained'
					color='primary'
					startIcon={<DescriptionIcon />}
					className={classes.button}
				>
					Generate Report
				</Button>
			</div>
		</Paper>
	);
}

Content.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
