// This file deals with what methods a model model should have
const { DataSource } = require('apollo-datasource');
const InstrumentAPI = require('./instruments');

function isValidDate(dateString) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false; // Invalid format
  const d = new Date(dateString);
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === dateString;
}

class CalibrationEventAPI extends DataSource {
  constructor({ store }) {
    super();
    this.instrumentAPI = new InstrumentAPI({ store });
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  async getAllCalibrationEvents() {
    const storeModel = await this.store;
    this.store = storeModel;
    const calibrationEvents = await this.store.calibrationEvents.findAll();
    return calibrationEvents;
  }

  async addCalibrationEvent({
    modelNumber,
    vendor,
    serialNumber,
    user,
    date,
    comment,
  }) {
    const response = { message: '' };
    const storeModel = await this.store;
    this.store = storeModel;
    await this.instrumentAPI.findInstrument({
      modelNumber, vendor, serialNumber,
    }).then((instrument) => {
      if (instrument) {
        if (!isValidDate(date)) { // checks if date is valid
          response.message = 'ERROR: Date must be in format YYYY-MM-DD';
          return;
        }
        const calibrationHistoryIdReference = instrument.dataValues.calibrationHistoryId;
        this.store.calibrationEvents.create({
          calibrationHistoryIdReference,
          user,
          date,
          comment,
        });
        response.message = 'Added new calibration event!';
      } else {
        response.message = 'ERROR: No instrument with this modelNumber/vendor/serialNumber exists';
      }
    });
    return JSON.stringify(response);
  }
}

module.exports = CalibrationEventAPI;