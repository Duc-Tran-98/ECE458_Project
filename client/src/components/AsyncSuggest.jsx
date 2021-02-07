import React from 'react';
// import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import { QueryAndThen } from './UseQuery';

export default function AsyncSuggest({
  query, queryName, onInputChange, label, getOptionLabel, getOptionSelected,
}) {
  AsyncSuggest.propTypes = {
    query: PropTypes.string.isRequired, // what query to perform
    queryName: PropTypes.string.isRequired, // name of query
    onInputChange: PropTypes.func.isRequired, // onInputChange handler
    label: PropTypes.string.isRequired, // label to display
    getOptionLabel: PropTypes.func.isRequired, // how query results are formatted
    getOptionSelected: PropTypes.func.isRequired, // which fields of selected option to assign to value
  };
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  //   const handleChange = (e, v, r) => {
  //     if (typeof e !== 'undefined') console.log(e);
  //     if (typeof v !== 'undefined') console.log(v.modelNumber);
  //     if (typeof r !== 'undefined') console.log(`r = ${r}`);
  //   };

  React.useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }
    (async () => {
      const response = await QueryAndThen({ query, queryName });
      //   console.log(response);
      if (active) {
        setOptions(response);
      }
    })();
    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      style={{ width: '20vw' }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={getOptionSelected}
      getOptionLabel={getOptionLabel}
      options={options}
      loading={loading}
      autoComplete
      autoHighlight
      disableClearable
      onChange={onInputChange}
      renderInput={(params) => (
        <div ref={params.InputProps.ref}>
          <Form.Control
            type="text"
            required
            placeholder={label}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params.inputProps}
          />
          <>{loading ? <LinearProgress /> : null}</>
          <Form.Control.Feedback type="invalid">
            Please
            {' '}
            {`${label}`}
          </Form.Control.Feedback>
          <Form.Control.Feedback type="valid">
            Looks good!
          </Form.Control.Feedback>
        </div>
      )}
    />
  );
}

/*
 <TextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          label={label}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
*/
