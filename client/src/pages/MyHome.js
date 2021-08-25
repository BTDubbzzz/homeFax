import React, { useState } from 'react';
import {
	Divider,
	List,
	useTheme,
	CardActionArea,
	CardContent,
	Typography,
	Button,
	Card,
	Grid,
	CardHeader,
	Collapse,
	Link,
	Modal,
	makeStyles,
	IconButton,
	Tooltip,
	Box,
} from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_GET_HOME } from '../utils/queries';
import AddArea from '../components/forms/AddArea';
import AddAttribute from '../components/forms/AddAttribute';
import AddDetail from '../components/forms/AddDetail';
import Transfer from '../components/Transfer';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {
	DELETE_AREA,
	DELETE_ATTRIBUTE,
	DELETE_DETAIL,
	DELETE_HOME,
} from '../utils/mutations';
import Snack from '../components/Snack';
// import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import EditAttribute from '../components/forms/EditAttribute';
import EditDetail from '../components/forms/EditDetail';
import SettingsIcon from '@material-ui/icons/Settings';
import EditArea from '../components/forms/EditArea';
import DescriptionIcon from '@material-ui/icons/Description';
import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';

import { useStoreContext } from '../utils/GlobalState';
import { UPDATE_HOME, REMOVE_HOME_FROM_USER } from '../utils/actions';

const useStyles = makeStyles((theme) => ({
	root: {
		// minWidth: 275,
	},
	margin: {
		margin: theme.spacing(1),
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

function MyHome(props) {
	const [state, dispatch] = useStoreContext();
	const classes = useStyles();
	const { homeid } = useParams();
	const [expandedId, setExpandedId] = useState(-1);
	const [dense] = useState(false);
	const theme = useTheme();

	const [modalIndex, setModalIndex] = useState(-1);
	const [areaModalOpen, setAreaModalOpen] = useState(false);
	const [editAreaModalOpen, setEditAreaModalOpen] = useState(false);
	const [attributeModalOpen, setAttributeModalOpen] = useState(false);
	const [detailModalOpen, setDetailModalOpen] = useState(false);
	const [transferModalOpen, setTransferModalOpen] = useState(false);
	const [detailIndex, setDetailIndex] = useState(-1);
	const [attributeIndex, setAttributeIndex] = useState(-1);
	const [deleteArea] = useMutation(DELETE_AREA);
	const [deleteAttribute] = useMutation(DELETE_ATTRIBUTE);
	const [deleteDetail] = useMutation(DELETE_DETAIL);
	const [deleteHome] = useMutation(DELETE_HOME);
	const [home, setHome] = useState([]);

	const history = useHistory();

	const { loading, error, data } = useQuery(QUERY_GET_HOME, {
		onCompleted: setHome,
		variables: { homeId: homeid },
	});

	function capitalize(str) {
		const lower = str.toLowerCase();
		return str.charAt(0).toUpperCase() + lower.slice(1);
	}

	const [snack, setSnack] = useState({ status: false, message: '' });

	const handleModalOpen = (i) => {
		setModalIndex(i);
	};

	const handleExpandClick = (i) => {
		setExpandedId(expandedId === i ? -1 : i);
	};

	const handleAddAreaModal = () => {
		setAreaModalOpen(true);
	};
	const handleEditAreaModal = () => {
		setEditAreaModalOpen(true);
	};
	const handleAttributeModal = () => {
		setAttributeModalOpen(true);
	};
	const handleEditAttributeModal = (j) => {
		setAttributeIndex(j);
	};
	const handleDetailModal = () => {
		setDetailModalOpen(true);
	};
	const handleEditDetailModal = (k) => {
		setDetailIndex(k);
	};
	const handleTransferModal = () => {
		setTransferModalOpen(true);
	};

	const handleDeleteArea = async (areaId) => {
		try {
			const mutationResponse = await deleteArea({
				variables: {
					areaId: areaId,
				},
			});

			if (mutationResponse) {
				const stateHome = mutationResponse.data.deleteArea;
				dispatch({ type: UPDATE_HOME, home: stateHome });
				const newHomeAfterDelete = {
					home: {
						...mutationResponse.data.deleteArea,
					},
				};

				setHome(newHomeAfterDelete);
				setSnack({ status: true, message: `Area has been deleted.` });
			}
		} catch (e) {
			console.log('error :>> ', e);
		}
	};
	const handleDeleteAttribute = async (attributeId) => {
		try {
			const mutationResponse = await deleteAttribute({
				variables: {
					attributeId: attributeId,
				},
			});

			if (mutationResponse) {
				const stateHome = mutationResponse.data.deleteAttribute;
				dispatch({ type: UPDATE_HOME, home: stateHome });
				const newHomeAfterDelete = {
					home: {
						...mutationResponse.data.deleteAttribute,
					},
				};

				setHome(newHomeAfterDelete);
				setSnack({ status: true, message: `Attribute has been deleted.` });
			}
		} catch (e) {
			console.log('error :>> ', e);
		}
	};
	const handleDeleteDetail = async (detailId) => {
		try {
			const mutationResponse = await deleteDetail({
				variables: {
					detailId: detailId,
				},
			});

			if (mutationResponse) {
				const stateHome = mutationResponse.data.deleteDetail;
				dispatch({ type: UPDATE_HOME, home: stateHome });
				const newHomeAfterDelete = {
					home: {
						...mutationResponse.data.deleteDetail,
					},
				};

				setHome(newHomeAfterDelete);
				setSnack({ status: true, message: `Detail has been deleted.` });
			}
		} catch (e) {
			console.log('error :>> ', e);
		}
	};

	const handleDeleteHome = async () => {
		try {
			const mutationResponse = await deleteHome({
				variables: {
					homeId: homeid,
				},
			});

			if (mutationResponse) {
				// console.log(mutationResponse.data.deleteHome._id);
				const stateHome = mutationResponse.data.deleteHome._id;
				dispatch({ type: REMOVE_HOME_FROM_USER, home: stateHome });
				history.push('/home');
			}
		} catch (e) {
			console.log('error :>> ', e);
		}
	};

	const homeData = home.home;

	const _formatArea = (data) => {
		let formattedData = [];
		formattedData.push([
			{ text: data.address.street1, style: 'address' },
			{ text: data.address.street2, style: 'address' },
			{
				text: `${data.address.city}, ${data.address.state}, ${data.address.zip}`,
				style: 'address',
			},
		]);
		for (let i = 0; i < data.areas.length; i++) {
			formattedData.push({
				text: `${data.areas[i].name}`,
				style: 'areaHeader',
				margin: [5, 2, 0, 0],
			});
			for (let j = 0; j < data.areas[i].attributes.length; j++) {
				formattedData.push({
					text: `${data.areas[i].attributes[j].type}`,
					style: 'attributeHeader',
					margin: [25, 2, 0, 0],
				});
				for (let k = 0; k < data.areas[i].attributes[j].detail.length; k++) {
					if (data.areas[i].attributes[j].detail[k].date) {
						formattedData.push({
							text: `${data.areas[i].attributes[j].detail[k].date}`,
							style: 'detailDate',
							margin: [50, 2, 0, 0],
						});
					}
					formattedData.push({
						text: [
							{
								text: `${data.areas[i].attributes[j].detail[k].key}:`,
								bold: true,
								alignment: 'left',
								color: 'white',
								background: 'black',
							},

							{
								text: `  ${data.areas[i].attributes[j].detail[k].value}`,
								style: 'detailValue',
							},
						],
						margin: [75, 2, 0, 2],
					});
				}
			}
		}

		return formattedData;
	};

	function GenerateReport() {
		const { vfs } = vfsFonts.pdfMake;
		pdfMake.vfs = vfs;

		// const homeAddress = _formatAddress(homeData);
		const homeArea = _formatArea(homeData);

		const documentDefinition = {
			pageSize: 'A4',
			pageOrientation: 'portrait',
			styles: {
				header: {
					fontSize: 22,
					bold: true,
					alignment: 'center',
				},
				address: {
					fontSize: 16,
					alignment: 'left',
				},
				areaHeader: {
					fontSize: 16,
					alignment: 'left',
					bold: true,
					background: '#AAB7B8',
				},
				attributeHeader: {
					fontSize: 16,
					alignment: 'left',
					background: '#D5DBDB',
				},
				detailDate: {
					fontSize: 12,
					alignment: 'left',
				},
				detailValue: {
					fontSize: 12,
					alignment: 'left',
				},
			},
			content: [{ text: 'HomeFax Report', style: 'header' }, '\n', homeArea],
		};

		pdfMake.createPdf(documentDefinition).open();
	}

	return (
		<React.Fragment>
			{loading ? (
				<h1>Loading...</h1>
			) : (
				<React.Fragment>
					<Grid container alignItems='stretch' spacing={3}>
						<React.Fragment>
							<Grid item xs={12} style={{ borderBottom: 'black solid 1px' }}>
								<Grid container justifyContent='center'>
									<Grid item>
										<Typography variant='h2'>
											{data.home.address.street1}
											<br></br>
										</Typography>
										<Typography variant='h4'>
											{data.home.address.city}, {data.home.address.state}
										</Typography>
										<Typography variant='h4'>
											{data.home.address.zip}
										</Typography>
									</Grid>
								</Grid>
								<Button
									onClick={GenerateReport}
									variant='contained'
									color='primary'
									startIcon={<DescriptionIcon />}
									className={classes.button}
								>
									Generate Report
								</Button>
							</Grid>

							{home.home?.areas.map((area, i) => (
								<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={area._id}>
									<Card>
										<CardHeader
											action={
												expandedId !== i ? (
													<IconButton onClick={() => handleExpandClick(i)}>
														<ExpandMoreIcon></ExpandMoreIcon>
													</IconButton>
												) : (
													<IconButton
														onClick={() => {
															handleExpandClick(i);
														}}
													>
														{' '}
														<ExpandLessIcon></ExpandLessIcon>
													</IconButton>
												)
											}
											title={capitalize(area.name)}
										></CardHeader>
										<Divider variant='middle'></Divider>
										{expandedId !== i && (
											<CardContent>
												<Typography variant='body2'>
													{area.attributes.length +
														(area.attributes.length === 1
															? ' attribute'
															: ' attributes')}
												</Typography>
											</CardContent>
										)}
										<Collapse in={expandedId === i}>
											<CardContent>
												<Typography variant='h5'>Attributes</Typography>
												<Divider></Divider>
												<List dense={dense}>
													{area.attributes.map((attribute, j) => (
														<React.Fragment key={attribute._id}>
															<Grid item xs={12}>
																<Box
																	display='flex'
																	alignItems='center'
																	justifyContent='space-between'
																>
																	<Box style={{ maxWidth: '50%' }}>
																		<Typography
																			style={{
																				overflow: 'hidden',
																				textOverflow: 'ellipsis',
																			}}
																			variant='body1'
																		>
																			<Link
																				onClick={() => {
																					handleModalOpen(j);
																				}}
																				style={{
																					textDecoration: 'none',
																					cursor: 'pointer',
																				}}
																			>
																				{capitalize(attribute.type)}
																			</Link>
																		</Typography>
																	</Box>

																	<Box>
																		<IconButton
																			onClick={() =>
																				handleEditAttributeModal(j)
																			}
																		>
																			<EditIcon
																				fontSize='small'
																				style={{
																					color: theme.palette.success.main,
																				}}
																			></EditIcon>
																		</IconButton>
																		<Modal
																			style={{
																				display: 'flex',
																				justifyContent: 'center',
																				alignContent: 'center',
																				alignItems: 'center',
																			}}
																			onClose={() => setAttributeIndex(-1)}
																			open={
																				expandedId === i && attributeIndex === j
																			}
																		>
																			<Grid
																				xs={10}
																				md={6}
																				justifyContent='center'
																				item
																				container
																			>
																				<Grid item xs={12}>
																					<EditAttribute
																						attId={attribute._id}
																						attType={attribute.type}
																						setHome={setHome}
																						setAttributeIndex={
																							setAttributeIndex
																						}
																					></EditAttribute>
																				</Grid>
																			</Grid>
																		</Modal>
																		<IconButton
																			onClick={() =>
																				handleDeleteAttribute(attribute._id)
																			}
																		>
																			<DeleteForeverIcon
																				fontSize='small'
																				style={{
																					color: theme.palette.secondary.main,
																				}}
																			></DeleteForeverIcon>
																		</IconButton>
																	</Box>
																</Box>
															</Grid>
															<Divider></Divider>
															<br></br>
															<Grid item xs={12}>
																<Modal
																	style={{
																		display: 'flex',
																		justifyContent: 'center',
																		alignContent: 'center',
																		alignItems: 'center',
																	}}
																	onClose={() => setModalIndex(-1)}
																	open={modalIndex === j && expandedId === i}
																>
																	<Grid
																		xs={10}
																		md={8}
																		container
																		item
																		spacing={4}
																		justifyContent='center'
																		alignItems='center'
																	>
																		<Grid
																			item
																			xs={12}
																			style={{
																				maxHeight: '80vh',
																				overflowY: 'auto',
																			}}
																		>
																			<Card
																				className={classes.root}
																				variant='outlined'
																			>
																				<CardContent>
																					<div className={classes.gridRoot}>
																						<Grid container spacing={1}>
																							<Grid item xs={12}>
																								<Typography variant='h3'>
																									{attribute.type} Details
																								</Typography>
																								<Divider />
																							</Grid>
																							<Grid item xs={12} s={6}>
																								{attribute.detail.map(
																									(detail, k) => (
																										<Box
																											key={detail._id}
																											my={3}
																											display='flex'
																											justifyContent='space-between'
																										>
																											<Box
																												style={{
																													maxWidth: '50%',
																												}}
																											>
																												<Typography
																													gutterBottom={true}
																													variant='h6'
																												>
																													{capitalize(
																														detail.key
																													) +
																														': ' +
																														capitalize(
																															detail.value
																														)}
																												</Typography>
																											</Box>
																											<Box>
																												<IconButton
																													onClick={() =>
																														handleEditDetailModal(
																															k
																														)
																													}
																												>
																													<EditIcon
																														fontSize='small'
																														style={{
																															color:
																																theme.palette
																																	.success.main,
																														}}
																													></EditIcon>
																												</IconButton>
																												<Modal
																													style={{
																														display: 'flex',
																														justifyContent:
																															'center',
																														alignContent:
																															'center',
																														alignItems:
																															'center',
																													}}
																													onClose={() =>
																														setDetailIndex(-1)
																													}
																													open={
																														expandedId === i &&
																														modalIndex === j &&
																														detailIndex === k
																													}
																												>
																													<Grid
																														container
																														item
																														xs={10}
																														md={6}
																														justifyContent='center'
																													>
																														<Grid item xs={12}>
																															<EditDetail
																																detailId={
																																	detail._id
																																}
																																detailKey={
																																	detail.key
																																}
																																detailValue={
																																	detail.value
																																}
																																detailDate={
																																	detail.date
																																}
																																setHome={
																																	setHome
																																}
																																setDetailIndex={
																																	setDetailIndex
																																}
																															></EditDetail>
																														</Grid>
																													</Grid>
																												</Modal>
																												<IconButton
																													onClick={() =>
																														handleDeleteDetail(
																															detail._id
																														)
																													}
																												>
																													<DeleteForeverIcon color='secondary'></DeleteForeverIcon>
																												</IconButton>
																											</Box>
																										</Box>
																									)
																								)}

																								<Button
																									variant='contained'
																									color='primary'
																									style={{
																										textDecoration: 'none',
																										cursor: 'pointer',
																									}}
																									onClick={handleDetailModal}
																								>
																									Add Detail
																								</Button>
																								<Modal
																									style={{
																										display: 'flex',
																										justifyContent: 'center',
																										alignItems: 'center',
																										alignContent: 'center',
																									}}
																									onClose={() =>
																										setDetailModalOpen(false)
																									}
																									open={
																										detailModalOpen &&
																										expandedId === i &&
																										modalIndex === j
																									}
																								>
																									<Grid
																										container
																										item
																										xs={10}
																										md={6}
																										justifyContent='center'
																									>
																										<Grid item xs={12}>
																											<AddDetail
																												attributeName={
																													attribute.type
																												}
																												attributeId={
																													attribute._id
																												}
																												setHome={setHome}
																												setDetailModalOpen={
																													setDetailModalOpen
																												}
																											></AddDetail>
																										</Grid>
																									</Grid>
																								</Modal>
																							</Grid>
																						</Grid>
																					</div>
																				</CardContent>
																			</Card>
																		</Grid>
																	</Grid>
																</Modal>
															</Grid>
														</React.Fragment>
													))}
												</List>
												<Box
													mt={2}
													display='flex'
													alignItems='center'
													justifyContent='space-between'
												>
													<Typography variant='body1'>
														<Button
															onClick={handleAttributeModal}
															variant='contained'
															color='primary'
														>
															Add Attribute
														</Button>
														<Modal
															style={{
																display: 'flex',
																justifyContent: 'center',
																alignContent: 'center',
																alignItems: 'center',
															}}
															onClose={() => setAttributeModalOpen(false)}
															open={attributeModalOpen && expandedId === i}
														>
															<Grid
																container
																item
																xs={10}
																md={8}
																justifyContent='center'
															>
																<Grid item xs={12}>
																	<AddAttribute
																		areaName={area.name}
																		areaId={area._id}
																		setHome={setHome}
																		setAttributeModalOpen={
																			setAttributeModalOpen
																		}
																	></AddAttribute>
																</Grid>
															</Grid>
														</Modal>
													</Typography>
													<Tooltip title='Delete Area'>
														<IconButton
															onClick={() => {
																handleDeleteArea(area._id);
															}}
														>
															<HighlightOffIcon
																fontSize='large'
																color='secondary'
															></HighlightOffIcon>
														</IconButton>
													</Tooltip>
												</Box>
												<Box mt={2}>
													<Grid container justifyContent='center'>
														<Grid item>
															<Tooltip title='Edit Area'>
																<IconButton
																	onClick={() => {
																		handleEditAreaModal();
																	}}
																>
																	<SettingsIcon
																		style={{
																			color: theme.palette.success.main,
																		}}
																	></SettingsIcon>
																</IconButton>
															</Tooltip>
															<Modal
																style={{
																	display: 'flex',
																	justifyContent: 'center',
																	alignItems: 'center',
																	alignContent: 'center',
																}}
																onClose={() => setEditAreaModalOpen(false)}
																open={editAreaModalOpen && expandedId === i}
															>
																<Grid
																	container
																	item
																	xs={10}
																	md={6}
																	justifyContent='center'
																>
																	<Grid item xs={12}>
																		<EditArea
																			areaId={area._id}
																			areaName={area.name}
																			areaIcon={area.icon}
																			setHome={setHome}
																			setEditAreaModalOpen={
																				setEditAreaModalOpen
																			}
																		></EditArea>
																	</Grid>
																</Grid>
															</Modal>
														</Grid>
													</Grid>
												</Box>
											</CardContent>
										</Collapse>
									</Card>
								</Grid>
							))}
							<Grid item xs={12} sm={6} md={4} lg={3} xl={2}></Grid>
							<Modal
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignContent: 'center',
									alignItems: 'center',
								}}
								onClose={() => setAreaModalOpen(false)}
								open={areaModalOpen}
							>
								<Grid container item xs={10} md={6} justifyContent='center'>
									<Grid item xs={12}>
										<AddArea
											setAreaModalOpen={setAreaModalOpen}
											homeId={data.home._id}
											setHome={setHome}
										></AddArea>
									</Grid>
								</Grid>
							</Modal>
							<Grid item xs={12} sm={6} md={4} lg={3} xl={2}></Grid>
						</React.Fragment>
					</Grid>
					<br></br>
					<Box mt={12}>
						<Grid container>
							<Grid item>
								<Button
									onClick={handleAddAreaModal}
									variant='contained'
									color='primary'
									className={classes.margin}
								>
									{/* <Tooltip title='Add Area'> */}
									{/* <CardActionArea
											style={{ display: 'flex', justifyContent: 'center' }}
											onClick={handleAddAreaModal}
											variant='contained'
										> */}
									{/* <IconButton> */}
									{/* <AddIcon color='primary' fontSize='large' /> */}
									Add Area
									{/* </IconButton> */}
									{/* </CardActionArea> */}
									{/* </Tooltip> */}
								</Button>
							</Grid>
							<Grid item>
								<Button
									onClick={handleTransferModal}
									variant='contained'
									color='secondary'
									className={classes.margin}
								>
									Transfer Home
								</Button>
								<Modal
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										alignContent: 'center',
									}}
									onClose={() => setTransferModalOpen(false)}
									open={transferModalOpen}
								>
									<Transfer
										home={data.home}
										setTransferModalOpen={setTransferModalOpen}
									></Transfer>
								</Modal>
							</Grid>
							<Grid item>
								<Button
									onClick={handleDeleteHome}
									variant='contained'
									color='secondary'
									className={classes.margin}
								>
									Delete Home
								</Button>
							</Grid>
						</Grid>
					</Box>
				</React.Fragment>
			)}
			{snack.status ? (
				<Snack
					setOpen={setSnack}
					status={snack.status}
					message={snack.message}
				></Snack>
			) : null}
		</React.Fragment>
	);
}

export default MyHome;
