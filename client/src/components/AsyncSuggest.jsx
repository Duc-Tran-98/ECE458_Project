import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { QueryAndThen } from './UseQuery';
// function sleep(delay = 0) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, delay);
//   });
// }

export default function AsyncSuggest({
  query, queryName, id, suggestHandler, label,
}) {
  AsyncSuggest.propTypes = {
    query: PropTypes.string.isRequired,
    queryName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    suggestHandler: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
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
      // console.log(response);
      if (active) {
        // setOptions(Object.keys(response).map((key) => response[key].item[0]));
        setOptions(response);
      }
    })();

    return () => {
      // eslint-disable-next-line no-unused-vars
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
      id={id}
      style={{ width: 200 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option[id] === value[id]}
      getOptionLabel={(option) => option[id]}
      options={options}
      loading={loading}
      autoComplete
      autoHighlight
      disableClearable
      onChange={suggestHandler}
      renderInput={(params) => (
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
      )}
    />
  );
}

/*
renderInput={(params) => (
        <TextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          label="Model Number"
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
      )}
*/
