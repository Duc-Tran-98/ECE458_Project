import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CustomFormBuilder from './CustomFormBuilder';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightBold,
  },
}));

// https://material-ui.com/components/accordion/
export default function AccordionDemo() {
  const classes = useStyles();

  return (
    <div style={{ maxWidth: '75%', margin: 'auto' }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Custom Form</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CustomFormBuilder />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
