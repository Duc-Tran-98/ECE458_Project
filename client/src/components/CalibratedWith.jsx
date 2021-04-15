/* eslint-disable react/style-prop-object */
/* eslint-disable react/require-default-props */
// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import { gql } from '@apollo/client';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Query from './UseQuery';
import AsyncSuggest from './AsyncSuggest';
import { CustomFormDeletePopOver } from './CustomMuiIcons';

const useStyles = makeStyles((theme) => ({
  textFieldLarge: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '90%',
  },
  textFieldMedium: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '40%',
  },
  textFieldSmall: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '20%',
  },
}));

export default function CalibratedWith({
  vendor,
  modelNumber,
  onChangeCalib,
  entry,
}) {
  CalibratedWith.propTypes = {
    vendor: PropTypes.string,
    modelNumber: PropTypes.string,
    onChangeCalib: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    entry: PropTypes.object.isRequired,
  };
  CalibratedWith.defaultProps = {
    vendor: null,
    modelNumber: null,
  };
  const [fetched, setFetched] = React.useState(false);
  const [cats, setCats] = React.useState([]);
  const classes = useStyles();

  const getCats = async () => {
    if (vendor !== null && modelNumber !== null) {
      await Query({
        query: gql`
        query GetCalCat (
            $vendor: String!,
            $modelNumber: String!,
          ){
            getModel(
            vendor: $vendor,
            modelNumber: $modelNumber,
          )
          {
            calibratorCategories{
              name
            }
          }
        }
      `,
        queryName: 'getModel',
        getVariables: () => ({
          vendor,
          modelNumber,
        }),
        fetchPolicy: 'no-cache',
        handleResponse: (response) => {
          setCats(response.calibratorCategories.map((el) => el.name));
          console.log(response.calibratorCategories.map((el) => el.name));
          setFetched(true);
        },
      });
    }
  };

  React.useEffect(() => {
    let active = true;
    (async () => {
      if (!active) {
        return;
      }
      getCats();
    })();
    return () => { active = false; };
  }, []);

  const validateCalibrationDate = ({ date, calibrationFrequency }) => {
    if (calibrationFrequency === 0) return true;
    if (date) {
      const todayToo = new Date();
      const calibDate = new Date(date);
      // today - calibDate <= calibration Frequency
      return (Math.round((todayToo.getTime() - calibDate.getTime()) / (1000 * 3600 * 24)) <= calibrationFrequency);
    }
    return false;
  };

  const [rows, setRows] = React.useState([]);
  const [now, setNow] = React.useState(false);
  // const space = ' ';
  const inputProps = { disableUnderline: true };
  const validatedWithHelperText = `Valid categories: ${cats.length > 0 ? cats.map((i) => `${i}, `) : 'NONE'}`;
  const addButton = (
    <button
      type="button"
      className="btn"
      onClick={() => {
        if (cats.length > 0) {
          const newRows = [...rows, {
            key: rows.length, tag: null, ok: false, with: null,
          }];
          setRows(newRows);
        }
      }}
    >
      Add Calibrator
    </button>
  );
  // const handleDeleteCalibrator = (data) => {
  //   const newRows = rows.filter((chip) => chip.key !== data.key);
  //   const tagArr = newRows.map((el) => el.tag);
  //   setRows((chips) => chips.filter((chip) => chip.key !== data.key));
  //   console.log(rows);
  //   const e = {
  //     target: {
  //       name: 'calibratedBy',
  //       value: tagArr,
  //     },
  //   };
  //   onChangeCalib(e, entry);
  // };

  return (
    <>
      {fetched && (
      <div className="d-flex justify-content-center w-100">
        <div className="col">
          <div className="row">
            <div className="col">
              <TextField
                className={classes.textFieldLarge}
                margin="normal"
                value="Calibrated With"
                disabled
                InputProps={inputProps}
                helperText={validatedWithHelperText}
              />
            </div>
            <div className="col" style={{ margin: 'auto 0px' }}>
              <div className="text-center">
                {addButton}
              </div>
            </div>
          </div>

          {rows.map((data) => (
            <div className="row">
              <Form.Group className="col mx-2">
                {/* <Form.Label className="h6 my-auto">
                  {space}
                </Form.Label> */}
                <div
                  className="row "
                  style={{
                    paddingTop: 3,
                    paddingBottom: 3,
                    paddingLeft: 0,
                  }}
                >
                  <div className="col-8">
                    <AsyncSuggest
                      query={gql`
                      query Instruments($modelCategories: [String]) {
                        getInstrumentsMatchingOneModelCategory(modelCategories: $modelCategories) {
                            vendor
                            modelNumber
                            assetTag
                            calibrationFrequency
                            recentCalibration {
                              date
                            }
                          }
                        
                      }
                    `}
                      queryName="getInstrumentsMatchingOneModelCategory"
                      getVariables={() => ({ modelCategories: cats })}
                    // eslint-disable-next-line no-unused-vars
                      onInputChange={(_e, v) => {
                        const calOk = validateCalibrationDate({
                          date: v?.recentCalibration[0]?.date,
                          calibrationFrequency: v.calibrationFrequency,
                        });
                        rows[data.key].ok = calOk;
                        rows[data.key].tag = v.assetTag;
                        rows[data.key].with = v;
                        setNow(!now);
                        const e = {
                          target: {
                            name: 'calibratedBy',
                            value: rows.map((el) => el.tag),
                          },
                        };
                        onChangeCalib(e, entry);
                      }}
                      label="Select a calibrator"
                      getOptionLabel={(option) => `${option.vendor}-${option.modelNumber}-${option.assetTag}`}
                      getOptionSelected={(option, value) => (option.assetTag === value.assetTag && option.vendor)
                        === value.vendor && option.modelNumber === value.modelNumber}
                      isInvalid={data.with !== null && !data.ok}
                      invalidMsg="That instrument is out of calibration!"
                      value={data.with}
                    />
                  </div>
                  <div className="col-1">
                    <CustomFormDeletePopOver
                      title="Remove Instrument"
                      onClick={() => {
                        const newRows = rows.filter((chip) => chip.key !== data.key);
                        const tagArr = newRows.map((el) => el.tag);
                        setRows((chips) => chips.filter((chip) => chip.key !== data.key));
                        console.log(rows);
                        const e = {
                          target: {
                            name: 'calibratedBy',
                            value: tagArr,
                          },
                        };
                        onChangeCalib(e, entry);
                      }}
                    />
                  </div>
                </div>
              </Form.Group>
            </div>
          ))}
        </div>
      </div>
      )}
    </>
  );
}
