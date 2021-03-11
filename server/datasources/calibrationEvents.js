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

function validateEvent(comment) {
  if (comment && comment.length > 2000) {
    return [false, 'Comment input must be under 2000 characters!'];
  }
  return [true];
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

  async getAllCalibrationEvents({ limit = null, offset = null }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const calibrationEvents = await this.store.calibrationEvents.findAll({ limit, offset });
    return calibrationEvents;
  }

  async getCalibrationEventsByInstrument({ modelNumber, vendor, serialNumber }) {
    let calibrationHistoryIdReference = -1;
    const storeModel = await this.store;
    this.store = storeModel;
    await this.store.instruments.findAll({
      where:
      { modelNumber, vendor, serialNumber },
    }).then((instrument) => {
      if (instrument && instrument[0]) {
        calibrationHistoryIdReference = instrument[0].dataValues.id;
      }
    });
    const calibrationEvents = await this.store.calibrationEvents.findAll(
      { where: { calibrationHistoryIdReference } },
    );
    return calibrationEvents;
  }

  async getCalibrationEventsByReferenceId({ calibrationHistoryIdReference }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const calibrationEvents = await this.store.calibrationEvents.findAll(
      { where: { calibrationHistoryIdReference } },
    );
    return calibrationEvents;
  }

  async addCalibrationEvent({
    modelNumber,
    vendor,
    serialNumber,
    user,
    date,
    comment,
    fileLocation,
    fileName,
  }) {
    const response = { message: '' };
    const validation = validateEvent(comment);
    if (!validation[0]) {
      // eslint-disable-next-line prefer-destructuring
      response.message = validation[1];
      return JSON.stringify(response);
    }
    const storeModel = await this.store;
    this.store = storeModel;
    await this.store.instruments.findAll({
      where: { modelNumber, vendor, serialNumber },
    }).then((instrument) => {
      if (instrument && instrument[0]) {
        if (!isValidDate(date)) { // checks if date is valid
          response.message = 'ERROR: Date must be in format YYYY-MM-DD';
          return;
        }
        console.log(`${fileLocation} ${fileName}`);
        const calibrationHistoryIdReference = instrument[0].dataValues.id;
        this.store.calibrationEvents.create({
          calibrationHistoryIdReference,
          user,
          date,
          comment,
          fileLocation,
          fileName,
        });
        response.message = `Added new calibration event to instrument ${vendor} ${modelNumber} ${serialNumber}!`;
      } else {
        response.message = `ERROR: Instrument ${vendor} ${modelNumber} ${serialNumber} does not exists`;
      }
    });
    return JSON.stringify(response);
  }

  async addCalibrationEventByAssetTag({
    assetTag,
    user,
    date,
    comment,
    fileLocation,
    fileName,
  }) {
    const response = { message: '' };
    const validation = validateEvent(comment);
    if (!validation[0]) {
      // eslint-disable-next-line prefer-destructuring
      response.message = validation[1];
      return JSON.stringify(response);
    }
    const storeModel = await this.store;
    this.store = storeModel;
    await this.store.instruments.findAll({
      where: { assetTag },
    }).then((instrument) => {
      if (instrument && instrument[0]) {
        if (!isValidDate(date)) { // checks if date is valid
          response.message = 'ERROR: Date must be in format YYYY-MM-DD';
          return;
        }
        console.log(`${fileLocation} ${fileName}`);
        const calibrationHistoryIdReference = instrument[0].dataValues.id;
        this.store.calibrationEvents.create({
          calibrationHistoryIdReference,
          user,
          date,
          comment,
          fileLocation,
          fileName,
        });
        response.message = `Added new calibration event to instrument tag: ${assetTag}!`;
      } else {
        response.message = `ERROR: Instrument tag: ${assetTag} does not exists`;
      }
    });
    return JSON.stringify(response);
  }

  async addLoadBankCalibration({
    assetTag,
    user,
    date,
    comment,
    loadBankData,
  }) {
    const response = { message: '', success: false };
    const validation = validateEvent(comment);
    if (!validation[0]) {
      // eslint-disable-next-line prefer-destructuring
      response.message = validation[1];
      return JSON.stringify(response);
    }
    const storeModel = await this.store;
    this.store = storeModel;
    await this.store.instruments.findAll({
      where: { assetTag },
    }).then((instrument) => {
      if (instrument && instrument[0]) {
        if (!isValidDate(date)) { // checks if date is valid
          response.message = 'ERROR: Date must be in format YYYY-MM-DD';
          return;
        }
        const calibrationHistoryIdReference = instrument[0].dataValues.id;
        this.store.calibrationEvents.create({
          calibrationHistoryIdReference,
          user,
          date,
          comment,
          loadBankData,
        });
        response.message = `Added new calibration event to instrument tag: ${assetTag}!`;
        response.success = true;
      } else {
        response.message = `ERROR: Instrument tag: ${assetTag} does not exists`;
      }
    });
    return JSON.stringify(response);
  }

  async addCalibrationEventById({
    calibrationHistoryIdReference,
    user,
    date,
    comment,
  }) {
    const response = { message: '' };
    const validation = validateEvent(comment);
    if (!validation[0]) {
      // eslint-disable-next-line prefer-destructuring
      response.message = validation[1];
      return JSON.stringify(response);
    }
    const storeModel = await this.store;
    this.store = storeModel;
    await this.store.instruments.findAll({
      where: { id: calibrationHistoryIdReference },
    }).then((instrument) => {
      if (instrument && instrument[0]) {
        if (!isValidDate(date)) { // checks if date is valid
          response.message = 'ERROR: Date must be in format YYYY-MM-DD';
          return;
        }
        this.store.calibrationEvents.create({
          calibrationHistoryIdReference,
          user,
          date,
          comment,
        });
        response.message = `Added new calibration event to instrument ${instrument[0].dataValues.vendor} ${instrument[0].dataValues.modelNumber} ${instrument[0].dataValues.serialNumber}!`;
      } else {
        response.message = `ERROR: Instrument ${instrument[0].dataValues.vendor} ${instrument[0].dataValues.modelNumber} ${instrument[0].dataValues.serialNumber} does not exists`;
      }
    });
    return JSON.stringify(response);
  }

  async deleteCalibrationEvent({ id }) {
    const response = { message: '' };
    const storeModel = await this.store;
    this.store = storeModel;
    await this.store.calibrationEvents.destroy({ where: { id } });
    response.message = `Deleted Calibration Event with id ${id}`;
    response.success = true;
    return JSON.stringify(response);
  }

  async editCalibrationEvent({
    user,
    date,
    comment,
    id,
  }) {
    const response = { message: '' };
    const validation = validateEvent(comment);
    if (!validation[0]) {
      // eslint-disable-next-line prefer-destructuring
      response.message = validation[1];
      return JSON.stringify(response);
    }
    const storeModel = await this.store;
    this.store = storeModel;
    await this.store.calibrationEvents.update({ user, date, comment }, { where: { id } });
    response.message = `Updated calibration event with ID: ${id}`;
    response.success = true;
    return JSON.stringify(response);
  }
}

module.exports = CalibrationEventAPI;
