import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Modal } from '@material-ui/core';
import { Link } from 'react-router-dom';
// Forms
import AddHome from './forms/AddHome';
import AddArea from './forms/AddArea';

// Views
import HomeCard from './HomeCard';
import GenericList from './GenericList';

// Data
import Auth from '../utils/auth';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
	},
	button: {
		marginRight: theme.spacing(1),
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
}));

function getSteps() {
	return ['Add a new home', 'Add areas', 'Review home'];
}

function getStepContent(step) {
	switch (step) {
		case 0:
			return <AddHome />;
		case 1:
			return 'Add areas';
		case 2:
			return 'Review home';
		default:
			return 'Unknown step';
	}
}

export default function HorizontalLinearStepper() {
	const userId = Auth.getProfile().data._id;
	const [homeData, setHomeData] = useState({ home: {} });
	const [areaModalOpen, setAreaModalOpen] = useState(false);
	const handleAddAreaModal = () => {
		setAreaModalOpen(!areaModalOpen);
	};

	const classes = useStyles();
	const [activeStep, setActiveStep] = React.useState(0);
	const [skipped, setSkipped] = React.useState(new Set());
	const steps = getSteps();

	const isStepOptional = (step) => {
		return step === 1;
	};

	const isStepSkipped = (step) => {
		return skipped.has(step);
	};

	const handleNext = () => {
		let newSkipped = skipped;
		if (isStepSkipped(activeStep)) {
			newSkipped = new Set(newSkipped.values());
			newSkipped.delete(activeStep);
		}

		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped(newSkipped);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleSkip = () => {
		if (!isStepOptional(activeStep)) {
			// You probably want to guard against something like this,
			// it should never occur unless someone's actively trying to break something.
			throw new Error("You can't skip a step that isn't optional.");
		}

		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped((prevSkipped) => {
			const newSkipped = new Set(prevSkipped.values());
			newSkipped.add(activeStep);
			return newSkipped;
		});
	};

	const handleReset = () => {
		setActiveStep(0);
	};

	return (
		<div className={classes.root}>
			<Stepper activeStep={activeStep}>
				{steps.map((label, index) => {
					const stepProps = {};
					const labelProps = {};
					if (isStepOptional(index)) {
						labelProps.optional = (
							<Typography variant='caption'>Optional</Typography>
						);
					}
					if (isStepSkipped(index)) {
						stepProps.completed = false;
					}
					return (
						<Step key={label} {...stepProps}>
							<StepLabel {...labelProps}>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
			<div>
				{activeStep === 0 ? (
					<div className={classes.instructions}>
						<AddHome
							userId={userId}
							handleNext={handleNext}
							setHomeData={setHomeData}
						/>
					</div>
				) : null}
				{activeStep === 1 ? (
					<div className={classes.instructions}>
						<HomeCard home={homeData} />
						<Modal
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignContent: 'center',
								alignItems: 'center',
							}}
							open={areaModalOpen}
							onClose={handleAddAreaModal}
							aria-labelledby='simple-modal-title'
							aria-describedby='simple-modal-description'
						>
							<AddArea
								setAreaModalOpen={setAreaModalOpen}
								homeId={homeData._id}
								setHomeData={setHomeData}
							></AddArea>
						</Modal>
						<div className={classes.instructions}>
							{homeData.areas ? (
								<GenericList items={homeData.areas} itemsKey={'name'} />
							) : null}
						</div>
						<div className={classes.instructions}>
							<Button
								variant='contained'
								color='primary'
								onClick={handleAddAreaModal}
								className={classes.button}
							>
								Add Area
							</Button>
							<Button
								variant='contained'
								color='primary'
								onClick={handleNext}
								className={classes.button}
							>
								Next
							</Button>
						</div>
					</div>
				) : null}
				{activeStep === 2 ? (
					<div className={classes.instructions}>
						<HomeCard home={homeData} />
						<div className={classes.instructions}>
							{homeData.areas ? (
								<GenericList items={homeData.areas} itemsKey={'name'} />
							) : null}
						</div>
						<div>
							<Button
								disabled={activeStep === 0}
								onClick={handleBack}
								className={classes.button}
							>
								Back
							</Button>
							<Link to={`/myhomes/${homeData._id}`}>
								<Button
									variant='contained'
									color='primary'
									onClick={handleNext}
									className={classes.button}
								>
									Take me to My Home
								</Button>
							</Link>
						</div>
					</div>
				) : null}
				{activeStep === steps.length ? (
					<div>
						<HomeCard home={homeData} />
						<span>ADD LINK TO MYHOMES SECTION</span>
					</div>
				) : null}
			</div>
		</div>
	);
}
