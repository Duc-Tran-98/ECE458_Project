import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    background: '#86A0D8',
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

export default function ChipsArray() {
  const classes = useStyles();
  const [chipData, setChipData] = React.useState([]);

  const [current, setCurrent] = React.useState('');

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  return (
    <div>
      Enter Asset Tag of Instrument(s) used in this calibration:
      <Input
        type="number"
        color="primary"
        onChange={((event) => {
          setCurrent(event.target.value);
        })}
      />
      <Button onClick={() => {
        setChipData([...chipData, { key: chipData.length, label: current }]);
      }}
      >
        Add
      </Button>
      <Paper component="ul" className={classes.root}>
        {chipData.map((data) => {
          let icon;

          return (
            <div>
              <li key={data.key}>
                <Chip
                  icon={icon}
                  label={data.label}
                  onDelete={handleDelete(data)}
                  className={classes.chip}
                />
              </li>
            </div>
          );
        })}
      </Paper>
    </div>
  );
}
