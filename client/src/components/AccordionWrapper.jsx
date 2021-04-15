import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';

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
export default function AccordionWrapper({ header, contents, defaultExpanded }) {
  AccordionWrapper.propTypes = {
    header: PropTypes.string.isRequired,
    contents: PropTypes.node.isRequired,
    defaultExpanded: PropTypes.bool,
  };
  AccordionWrapper.defaultProps = {
    defaultExpanded: false,
  };
  const classes = useStyles();

  return (
    <>
      <Accordion className="bg-theme" defaultExpanded={defaultExpanded}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>{header}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {contents}
        </AccordionDetails>
      </Accordion>
    </>
  );
}
