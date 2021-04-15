/* eslint-disable react/require-default-props */
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import { gql } from '@apollo/client';
import DeleteIcon from '@material-ui/icons/Delete';
import AsyncSuggest from './AsyncSuggest';

export default function CalibrationRow({
// params
  // eslint-disable-next-line no-unused-vars
  vendor,
  // eslint-disable-next-line no-unused-vars
  modelNumber,
}) {
  CalibrationRow.propTypes = {
    // props here
    vendor: PropTypes.string,
    modelNumber: PropTypes.string,
  };
  CalibrationRow.defaultProps = {
    // defaults here
    vendor: null,
    modelNumber: null,
  };

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

  // eslint-disable-next-line no-unused-vars
  const handleDelete = (row) => () => {
    console.log(row);
    setRows((chips) => chips.filter((chip) => chip.key !== row.key));
    setNow(!now);
  };

  return (
    <div className="d-flex justify-content-center w-100">
      <div className="col">
        <div className="row">
          <div className="col-4">
            <Button
              type="button"
              className="btn"
              onClick={() => {
                setRows([...rows, {
                  key: rows.length, tag: null, ok: false, with: null,
                }]);
                console.log(rows);
              }}
            >
              Add calibrator
            </Button>
          </div>
        </div>

        {rows.map((data) => (
          <div className="row">
            <Form.Group className="col mx-2">
              <Form.Label className="h6 my-auto">
                Instrument
              </Form.Label>
              <div className="row">
                <div className="col-8">
                  <AsyncSuggest
                    query={gql`
                      query Instruments($modelCategories: [String]) {
                        getInstrumentsWithFilter(modelCategories: $modelCategories) {
                          instruments {
                            vendor
                            modelNumber
                            assetTag
                            calibrationFrequency
                            recentCalibration {
                              date
                            }
                          }
                        }
                      }
                    `}
                    queryName="getInstrumentsWithFilter"
                    getVariables={() => ({ modelCategories: ['Klufe_K5700-compatible'] })}
                    // eslint-disable-next-line no-unused-vars
                    onInputChange={(_e, v) => {
                      const calOk = validateCalibrationDate({
                        date: v?.recentCalibration[0]?.date,
                        calibrationFrequency: v.calibrationFrequency,
                      });
                      console.log(`is this valid ${calOk}`);
                      rows[data.key].ok = calOk;
                      rows[data.key].tag = v.assetTag;
                      rows[data.key].with = v;
                      setNow(!now);
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
                  <Button onClick={() => {
                    console.log('button');
                    setRows((chips) => chips.filter((chip) => chip.key !== data.key));
                  }}
                  >
                    <DeleteIcon onClick={() => {
                      console.log('de;ete');
                      handleDelete(data);
                    }}
                    />
                  </Button>
                </div>
              </div>
            </Form.Group>
          </div>
        ))}
      </div>
    </div>
  );
}
