import React from 'react';
// import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import TextField from '@material-ui/core/TextField';
import { QueryAndThen } from './UseQuery';

const filter = createFilterOptions();

export default function AsyncSuggest({
  query,
  queryName,
  onInputChange,
  label,
  getOptionLabel,
  getOptionSelected,
  value,
  allowAdditions,
  isInvalid,
  invalidMsg,
  validMsg,
  multiple,
  multipleValues,
  isComboBox,
  getVariables,
  filterRes,
  handleKeyPress, // what to do when user clicks key on input
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
    // eslint-disable-next-line react/forbid-prop-types
    multipleValues: PropTypes.array,
    allowAdditions: PropTypes.bool, // Whether or not user should be able to create new input
    isInvalid: PropTypes.bool.isRequired,
    invalidMsg: PropTypes.string, // invalid msg to be displayed if invalid input
    validMsg: PropTypes.string, // valid msg to be dsiplayed if valid input
    multiple: PropTypes.bool, // whether or not user should be able to select mutliple
    isComboBox: PropTypes.bool, // whether or not display should be textfield input or combo box
    getVariables: PropTypes.func, // pass variables to queries
    filterRes: PropTypes.func, // how to filter response
    handleKeyPress: PropTypes.func,
  };
  AsyncSuggest.defaultProps = {
    value: null,
    allowAdditions: false,
    multiple: false,
    multipleValues: null,
    isComboBox: false,
    getVariables: () => undefined,
    invalidMsg: `Please ${label}`,
    validMsg: 'Looks Good',
    filterRes: null,
    handleKeyPress: () => undefined,
  };
  const [open, setOpen] = React.useState(false);
  const [availableOptions, setOptions] = React.useState([]);
  const [fetched, setFetched] = React.useState(false);
  const loading = open && !fetched;
  React.useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }
    (async () => {
      const response = await QueryAndThen({ query, queryName, getVariables });
      if (active) {
        if (queryName === 'getInstrumentsWithFilter') {
          setOptions(response.instruments);
        } else {
          let copyRes = response;
          if (filterRes) {
            // eslint-disable-next-line no-unused-vars
            copyRes = copyRes.filter((entry) => filterRes(entry));
          }
          setOptions(copyRes);
        }
        setFetched(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    let active = true;
    (() => {
      if (active) {
        if (!open) {
          setOptions([]);
          setFetched(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [open]);
  const genLook = (params) => (isComboBox ? (
    <TextField
        // eslint-disable-next-line react/jsx-props-no-spreading
      {...params}
      label={label}
      variant="outlined"
      size="small"
      onKeyDown={(e) => handleKeyPress(e)}
    />
  ) : (
    <div ref={params.InputProps.ref} className="position-relative">
      <Form.Control
        type="text"
        required
        placeholder={label}
        isInvalid={isInvalid}
          // eslint-disable-next-line react/jsx-props-no-spreading
        {...params.inputProps}
      />
      <>{loading ? <LinearProgress /> : null}</>
      <>
        {open ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            style={{ cursor: 'pointer' }}
            onClick={() => setOpen(false)}
            className="bi bi-caret-up-fill position-absolute top-50 start-98 translate-middle"
            viewBox="0 0 16 16"
          >
            <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            style={{ cursor: 'pointer' }}
            onClick={() => setOpen(true)}
            className="bi bi-caret-down-fill position-absolute top-50 start-98 translate-middle"
            viewBox="0 0 16 16"
          >
            <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
          </svg>
        )}
      </>
      <Form.Control.Feedback type="invalid">
        {invalidMsg}
      </Form.Control.Feedback>
      <Form.Control.Feedback type="valid">{validMsg}</Form.Control.Feedback>
    </div>
  ));
  if (allowAdditions) {
    // If we want use to add new suggestions
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
        onChange={onInputChange}
        renderInput={(params) => genLook(params)}
      />
    );
  }
  if (multiple) {
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
        getOptionLabel={getOptionLabel}
        options={availableOptions}
        loading={loading}
        multiple={multiple}
        autoComplete
        autoHighlight
        onChange={onInputChange}
        value={multipleValues}
        renderInput={(params) => (
          <>
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              variant="outlined"
              size="small"
              label={label}
            />
          </>
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
      disableClearable={!isComboBox}
      onChange={onInputChange}
      renderInput={(params) => genLook(params)}
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
