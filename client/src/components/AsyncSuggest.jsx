import React from 'react';
// import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import { QueryAndThen } from './UseQuery';

const filter = createFilterOptions();

export default function AsyncSuggest({
  query, queryName, onInputChange, label, getOptionLabel, getOptionSelected, value, allowAdditions,
}) {
  AsyncSuggest.propTypes = {
    query: PropTypes.string.isRequired, // what query to perform
    queryName: PropTypes.string.isRequired, // name of query
    onInputChange: PropTypes.func.isRequired, // onInputChange handler
    label: PropTypes.string.isRequired, // label to display
    getOptionLabel: PropTypes.func.isRequired, // how query results are formatted
    getOptionSelected: PropTypes.func.isRequired, // which fields of selected option to assign to value
    // eslint-disable-next-line react/forbid-prop-types
    value: PropTypes.object,
    allowAdditions: PropTypes.bool, // Whether or not user should be able to create new input
  };
  AsyncSuggest.defaultProps = {
    value: null,
    allowAdditions: false,
  };
  const [open, setOpen] = React.useState(false);
  const [availableOptions, setOptions] = React.useState([]);
  const loading = open && availableOptions.length === 0;
  React.useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }
    (async () => {
      const response = await QueryAndThen({ query, queryName });
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
  if (allowAdditions) { // If we want use to add new suggestions
    return (
      <Autocomplete
        style={{ width: '100%' }}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          // Suggest the creation of a new value
          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              vendor: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        freeSolo
        getOptionSelected={getOptionSelected}
        getOptionLabel={getOptionLabel}
        options={availableOptions}
        loading={loading}
        value={value}
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
  return (
    <Autocomplete
      style={{ width: '100%' }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={getOptionSelected}
      getOptionLabel={getOptionLabel}
      options={availableOptions}
      loading={loading}
      value={value}
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
