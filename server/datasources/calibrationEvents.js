/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
const SQL = require('sequelize');
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

  checkPermission() {
    const { user } = this.context;
    if (process.env.NODE_ENV.includes('dev')) {
      return true;
    }
    return user.isAdmin || user.calibrationPermission;
  }

  checkApprovalPermission() {
    const { user } = this.context;
    if (process.env.NODE_ENV.includes('dev')) {
      return true;
    }
    return user.isAdmin || user.calibrationApproverPermission;
  }

  async getAllCalibrationEvents({ limit = null, offset = null }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const calibrationEvents = await this.store.calibrationEvents.findAll({ limit, offset });
    return calibrationEvents;
  }

  async getAllPendingCalibrationEvents({ limit = null, offset = null }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const calibrationEvents = await this.store.calibrationEvents.findAll({
      limit,
      offset,
      where: {
        approvalStatus: 0,
      },
    });
    return calibrationEvents;
  }

  async getCalibrationEventsByInstrument({ modelNumber, vendor, assetTag }) {
    let calibrationHistoryIdReference = -1;
    const storeModel = await this.store;
    this.store = storeModel;
    await this.store.instruments.findAll({
      where:
        { modelNumber, vendor, assetTag },
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

  /*
  * DEPRECATED, no longer in user as of ev3
  */
  async addCalibrationEvent({
    modelNumber,
    vendor,
    serialNumber,
    user,
    date,
    comment,
    fileLocation,
    fileName,
    calibratedBy,
  }) {
    console.log(`basic add ${calibratedBy}`);
    const response = { message: '' };
    if (!this.checkPermission()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
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
    }).then(async (instrument) => {
      if (instrument && instrument[0]) {
        if (!isValidDate(date)) { // checks if date is valid
          response.message = 'ERROR: Date must be in format YYYY-MM-DD!';
          return;
        }
        const modelId = instrument[0].dataValues.modelReference;
        const model = await this.store.models.findOne({
          where: {
            id: modelId,
          },
        });
        const approvalStatus = (model.dataValues.requiresCalibrationApproval) ? 0 : 3;
        const calibrationUser = await this.store.users.findOne({
          where: {
            userName: user,
          },
        });
        const calibrationHistoryIdReference = instrument[0].dataValues.id;

        for (let cal = 0; cal < calibratedBy.length; cal += 1) {
          const tag = calibratedBy[cal];
          console.log(tag);
          if (tag < 100000 || tag > 999999) {
            response.message = 'ERROR: Asset tag must be in range 100000-999999!';
            return;
          }
        }

        const t = await this.store.db.transaction();

        try {
          this.store.calibrationEvents.create({
            calibrationHistoryIdReference,
            user,
            userFirstName: calibrationUser.firstName,
            userLastName: calibrationUser.lastName,
            date,
            comment,
            fileLocation,
            fileName,
            approvalStatus,
          }, { transaction: t });

          response.message = `Added new calibration event to instrument ${vendor} ${modelNumber} ${serialNumber}!`;
        } catch (error) {
          console.log(error);
          await t.rollback();
          response.success = false;
          response.message = `ERROR (type: ${error.errors[0].type}) (value: ${error.errors[0].value})`;
        }
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
    calibratedBy,
  }) {
    console.log(`add by asset tag ${calibratedBy}`);
    const response = { message: '', success: false };
    if (!this.checkPermission()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
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
    }).then(async (instrument) => {
      if (instrument && instrument[0]) {
        if (!isValidDate(date)) { // checks if date is valid
          response.message = 'ERROR: Date must be in format YYYY-MM-DD';
          return;
        }
        const modelId = instrument[0].dataValues.modelReference;
        const model = await this.store.models.findOne({
          where: {
            id: modelId,
          },
          include: {
            model: this.store.modelCategories,
            as: 'calibratorCategories',
            through: 'calibratorCategoryRelationships',
          },
        });
        const approvalStatus = (model.dataValues.requiresCalibrationApproval) ? 0 : 3;
        const calibrationUser = await this.store.users.findOne({
          where: {
            userName: user,
          },
        });
        const calibrationHistoryIdReference = instrument[0].dataValues.id;
        const relations = [];
        if (calibratedBy) {
          for (let cal = 0; cal < calibratedBy.length; cal += 1) {
            const tag = calibratedBy[cal];
            if (tag < 100000 || tag > 999999) {
              response.message = 'ERROR: Asset tag must be in range 100000-999999!';
              return;
            }
            const calWith = await this.store.instruments.findOne({
              where: { assetTag: tag },
            });
            if (calWith) {
              if (calWith.dataValues.assetTag === assetTag) {
                response.message = 'ERROR: Cannot calibrate an instrument with itself!';
                return;
              }
              const modWith = await this.store.models.findOne({
                where: { id: calWith.dataValues.modelReference },
                include: {
                  model: this.store.modelCategories,
                  as: 'categories',
                  through: 'modelCategoryRelationships',
                },
              });
              const calibrationCategories = model.calibratorCategories.map((e) => e.name);
              const modelCategories = modWith.categories.map((e) => e.name);
              // eslint-disable-next-line max-len
              const matchArray = calibrationCategories.filter((value) => modelCategories.includes(value));
              if (matchArray.length > 0) {
                relations.push({
                  calibratedBy: calWith.dataValues.id,
                  byVendor: calWith.dataValues.vendor,
                  byModelNumber: calWith.dataValues.modelNumber,
                  bySerialNumber: calWith.dataValues.serialNumber,
                  byAssetTag: calWith.dataValues.assetTag,
                });
              } else {
                response.message = `ERROR: instrument ${calWith.dataValues.assetTag} is not in a valid calibration category!`;
                return;
              }
            } else {
              response.message = `ERROR: Instrument ${tag} does not exist!`;
              return;
            }
          }
        }
        const t = await this.store.db.transaction();

        try {
          const event = await this.store.calibrationEvents.create({
            calibrationHistoryIdReference,
            user,
            userFirstName: calibrationUser.firstName,
            userLastName: calibrationUser.lastName,
            date,
            comment,
            fileLocation,
            fileName,
            approvalStatus,
          }, { transaction: t });
          for (let i = 0; i < relations.length; i += 1) {
            // check cycles
            const assetTagArray = [];
            const dates = new Map();
            assetTagArray.push(relations[i].byAssetTag);
            let count = 0;
            while (count < assetTagArray.length) {
              const curr = await this.store.instruments.findOne({
                where: { assetTag: assetTagArray[count] },
              });
              count += 1;
              if (curr === null) continue;
              // eslint-disable-next-line prefer-destructuring
              const id = curr.dataValues.id;
              const filters = [];
              filters.push({
                calibrationHistoryIdReference: id,
                approvalStatus: [1, 3], // need to check this, do pending events create cycle???
              });
              if (count !== 1) {
                filters.push({
                  date: SQL.where(
                    SQL.fn('date', SQL.col('date')),
                    '<=',
                    dates.get(curr.dataValues.assetTag),
                  ),
                });
              }
              const calibration = await this.store.calibrationEvents.findOne({
                where: filters,
                order: [['date', 'DESC']],
                include: {
                  model: this.store.calibratedByRelationships,
                  as: 'calibratedBy',
                },
              });
              if (calibration === null) continue;
              // const relations = [];
              for (let j = 0; j < calibration.calibratedBy.length; j += 1) {
                const inst = calibration.calibratedBy[j];
                const currentId = inst.dataValues.calibratedBy;
                // eslint-disable-next-line no-await-in-loop
                const found = await this.store.instruments.findOne({
                  where: {
                    id: currentId,
                  },
                });
                if (found) {
                  if (found.dataValues.assetTag === assetTag) {
                    response.message = `ERROR: Calibrating instrument ${assetTag} with instrument ${assetTagArray[0]} would create a cycle in the chain of truth`;
                    return;
                  }
                  dates.set(found.dataValues.assetTag, calibration.dataValues.date);
                  assetTagArray.push(found.dataValues.assetTag);
                } else {
                  if (inst.dataValues.assetTag === assetTag) {
                    response.message = `ERROR: Calibrating instrument ${assetTag} with instrument ${assetTagArray[0]} would create a cycle in the chain of truth`;
                    return;
                  }
                  dates.set(inst.dataValues.assetTag, calibration.dataValues.date);
                  assetTagArray.push(inst.dataValues.assetTag);
                }
              }
            }

            await this.store.calibratedByRelationships.create({
              calibration: event.dataValues.id,
              calibratedInstrument: instrument[0].dataValues.id,
              calibratedBy: relations[i].calibratedBy,
              byVendor: relations[i].byVendor,
              byModelNumber: relations[i].byModelNumber,
              bySerialNumber: relations[i].bySerialNumber,
              byAssetTag: relations[i].byAssetTag,
            }, { transaction: t });
          }
        } catch (error) {
          console.log(error);
          await t.rollback();
          response.success = false;
          response.message = `ERROR (type: ${error.errors[0].type}) (value: ${error.errors[0].value})`;
          return;
        }
        await t.commit();
        response.success = true;
        response.message = `Added calibration event on ${date} to instrument ${assetTag}!`;
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
    calibratedBy,
  }) {
    console.log(`load bank add ${calibratedBy}`);
    const response = { message: '', success: false };
    if (!this.checkPermission()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
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
    }).then(async (instrument) => {
      if (instrument && instrument[0]) {
        if (!isValidDate(date)) { // checks if date is valid
          response.message = 'ERROR: Date must be in format YYYY-MM-DD';
          return;
        }
        const modelId = instrument[0].dataValues.modelReference;
        const model = await this.store.models.findOne({
          where: {
            id: modelId,
          },
        });
        const approvalStatus = (model.dataValues.requiresCalibrationApproval) ? 0 : 3;
        const calibrationUser = await this.store.users.findOne({
          where: {
            userName: user,
          },
        });
        const calibrationHistoryIdReference = instrument[0].dataValues.id;
        this.store.calibrationEvents.create({
          calibrationHistoryIdReference,
          user,
          userFirstName: calibrationUser.firstName,
          userLastName: calibrationUser.lastName,
          date,
          comment,
          loadBankData,
          approvalStatus,
        });
        response.message = `Added new load bank calibration event to instrument tag: ${assetTag}!`;
        response.success = true;
      } else {
        response.message = `ERROR: Instrument tag: ${assetTag} does not exists`;
      }
    });
    return JSON.stringify(response);
  }

  async addKlufeCalibration({
    assetTag,
    user,
    date,
    comment,
    klufeData,
    calibratedBy,
  }) {
    console.log(`klufe calibration add ${calibratedBy}`);
    const response = { message: '', success: false };
    if (!this.checkPermission()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
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
    }).then(async (instrument) => {
      if (instrument && instrument[0]) {
        if (!isValidDate(date)) { // checks if date is valid
          response.message = 'ERROR: Date must be in format YYYY-MM-DD';
          return;
        }
        const modelId = instrument[0].dataValues.modelReference;
        const model = await this.store.models.findOne({
          where: {
            id: modelId,
          },
        });
        const approvalStatus = (model.dataValues.requiresCalibrationApproval) ? 0 : 3;
        const calibrationUser = await this.store.users.findOne({
          where: {
            userName: user,
          },
        });
        const calibrationHistoryIdReference = instrument[0].dataValues.id;
        this.store.calibrationEvents.create({
          calibrationHistoryIdReference,
          user,
          userFirstName: calibrationUser.firstName,
          userLastName: calibrationUser.lastName,
          date,
          comment,
          klufeData,
          approvalStatus,
        });
        response.message = `Added new Klufe calibration event to instrument tag: ${assetTag}!`;
        response.success = true;
      } else {
        response.message = `ERROR: Instrument tag: ${assetTag} does not exists`;
      }
    });
    return JSON.stringify(response);
  }

  async addCustomCalibration({
    assetTag,
    user,
    date,
    comment,
    customFormData,
    calibratedBy,
  }) {
    console.log(`add custom calibration ${calibratedBy}`);
    const response = { message: '', success: false };
    if (!this.checkPermission()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
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
    }).then(async (instrument) => {
      if (instrument && instrument[0]) {
        if (!isValidDate(date)) { // checks if date is valid
          response.message = 'ERROR: Date must be in format YYYY-MM-DD';
          return;
        }
        const modelId = instrument[0].dataValues.modelReference;
        const model = await this.store.models.findOne({
          where: {
            id: modelId,
          },
        });
        const approvalStatus = (model.dataValues.requiresCalibrationApproval) ? 0 : 3;
        const calibrationUser = await this.store.users.findOne({
          where: {
            userName: user,
          },
        });
        const calibrationHistoryIdReference = instrument[0].dataValues.id;
        this.store.calibrationEvents.create({
          calibrationHistoryIdReference,
          user,
          userFirstName: calibrationUser.firstName,
          userLastName: calibrationUser.lastName,
          date,
          comment,
          customFormData,
          approvalStatus,
        });
        response.message = `Added new Custom Form calibration event to instrument tag: ${assetTag}!`;
        response.success = true;
      } else {
        response.message = `ERROR: Instrument tag: ${assetTag} does not exists`;
      }
    });
    return JSON.stringify(response);
  }

  /*
  * DEPRECATED, no longer in user as of ev3
  */
  async addCalibrationEventById({
    calibrationHistoryIdReference,
    user,
    date,
    comment,
  }) {
    const response = { message: '' };
    if (!this.checkPermission()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
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
    if (!this.checkPermission()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
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
    if (!this.checkPermission()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
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

  async approveCalibrationEvent({
    calibrationEventId,
    approverId,
    approvalDate,
    approvalComment,
  }) {
    const response = { message: '' };
    if (!this.checkApprovalPermission()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
    const storeModel = await this.store;
    this.store = storeModel;
    const approver = await this.store.users.findOne({
      where: { id: approverId },
    });
    if (!isValidDate(approvalDate)) { // checks if date is valid
      response.message = 'ERROR: Date must be in format YYYY-MM-DD';
      return JSON.stringify(response);
    }
    await this.store.calibrationEvents.update(
      {
        approvalStatus: 1,
        approverUsername: approver.username,
        approverFirstName: approver.firstName,
        approverLastName: approver.lastName,
        approvalDate,
        approvalComment,
      },
      {
        where: { id: calibrationEventId },
      },
    );
    response.message = 'Calibration Event Approved';
    return JSON.stringify(response);
  }

  async rejectCalibrationEvent({
    calibrationEventId,
    approverId,
    approvalDate,
    approvalComment,
  }) {
    const response = { message: '' };
    if (!this.checkApprovalPermission()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
    const storeModel = await this.store;
    this.store = storeModel;
    const approver = await this.store.users.findOne({
      where: { id: approverId },
    });
    if (!isValidDate(approvalDate)) { // checks if date is valid
      response.message = 'ERROR: Date must be in format YYYY-MM-DD';
      return JSON.stringify(response);
    }
    await this.store.calibrationEvents.update(
      {
        approvalStatus: 2,
        approverUsername: approver.username,
        approverFirstName: approver.firstName,
        approverLastName: approver.lastName,
        approvalDate,
        approvalComment,
      },
      {
        where: { id: calibrationEventId },
      },
    );
    response.message = 'Calibration Event Rejected';
    return JSON.stringify(response);
  }

  async getCetificateForInstrument({ assetTag }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const instrument = await this.store.instruments.findOne({
      where: { assetTag },
    });
    if (instrument === null) return null;
    // eslint-disable-next-line prefer-destructuring
    const id = instrument.dataValues.id;
    const calibration = await this.store.calibrationEvents.findOne({
      where: {
        calibrationHistoryIdReference: id,
        approvalStatus: [1, 3],
      },
      order: [['date', 'DESC']],
      include: {
        model: this.store.calibratedByRelationships,
        as: 'calibratedBy',
      },
    });
    if (calibration === null) return null;
    const relations = [];
    for (let i = 0; i < calibration.calibratedBy.length; i += 1) {
      const inst = calibration.calibratedBy[i];
      const currentId = inst.dataValues.calibratedBy;
      // eslint-disable-next-line no-await-in-loop
      const found = await this.store.instruments.findOne({
        where: {
          id: currentId,
        },
      });
      if (found) {
        relations.push({
          vendor: found.dataValues.vendor,
          modelNumber: found.dataValues.modelNumber,
          // eslint-disable-next-line max-len
          serialNumber: (found.dataValues.serialNumber === null || found.dataValues.serialNumber.length === 0) ? null : found.dataValues.serialNumber,
          assetTag: found.dataValues.assetTag,
        });
      } else {
        relations.push({
          vendor: inst.dataValues.byVendor,
          modelNumber: inst.dataValues.byModelNumber,
          // eslint-disable-next-line max-len
          serialNumber: (inst.dataValues.serialNumber === null || inst.dataValues.serialNumber.length === 0) ? null : inst.dataValues.serialNumber,
          assetTag: inst.dataValues.byAssetTag,
        });
      }
    }
    const result = {
      vendor: instrument.dataValues.vendor,
      modelNumber: instrument.dataValues.modelNumber,
      // eslint-disable-next-line max-len
      serialNumber: (instrument.dataValues.serialNumber === null || instrument.dataValues.serialNumber.length === 0) ? null : instrument.dataValues.serialNumber,
      assetTag: instrument.dataValues.assetTag,
      modelDescription: instrument.dataValues.description,
      calibrationFrequency: instrument.dataValues.calibrationFrequency,
      calibrationComment: calibration.dataValues.comment,
      calibrationDate: calibration.dataValues.date,
      calibratorUserName: calibration.dataValues.user,
      calibratorFirstName: calibration.dataValues.userFirstName,
      calibratorLastName: calibration.dataValues.userLastName,
      approvalStatus: calibration.dataValues.approvalStatus === 1 ? 'Approved' : 'Not Required',
      approvalComment: calibration.dataValues.approvalComment,
      approvalDate: calibration.dataValues.approvalDate,
      approverUsername: calibration.dataValues.approverUsername,
      approverFirstName: calibration.dataValues.approverFirstName,
      approverLastName: calibration.dataValues.approverLastName,
      // eslint-disable-next-line max-len
      isFileAttached: calibration.dataValues.fileLocation !== null && calibration.dataValues.fileName !== null,
      fileLocation: calibration.dataValues.fileLocation,
      fileName: calibration.dataValues.fileName,
      isKlufe: calibration.dataValues.klufeData !== null,
      klufeData: calibration.dataValues.klufeData,
      isLoadBank: calibration.dataValues.loadBankData !== null,
      loadBankData: calibration.dataValues.loadBankData,
      isCustomForm: calibration.dataValues.customFormData !== null,
      customFormData: calibration.dataValues.customFormData,
      calibratedBy: relations,
    };
    return result;
  }

  async getChainOfTruthForInstrument({ assetTag }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const assetTagArray = [];
    const result = [];
    const dates = new Map();
    assetTagArray.push(assetTag);
    let count = 0;
    while (count < assetTagArray.length) {
      const instrument = await this.store.instruments.findOne({
        where: { assetTag: assetTagArray[count] },
      });
      count += 1;
      if (instrument === null) continue;
      // eslint-disable-next-line prefer-destructuring
      const id = instrument.dataValues.id;
      const filters = [];
      filters.push({
        calibrationHistoryIdReference: id,
        approvalStatus: [1, 3],
      });
      if (count !== 1) {
        filters.push({
          date: SQL.where(
            SQL.fn('date', SQL.col('date')),
            '<=',
            dates.get(instrument.dataValues.assetTag),
          ),
        });
      }
      const calibration = await this.store.calibrationEvents.findOne({
        where: filters,
        order: [['date', 'DESC']],
        include: {
          model: this.store.calibratedByRelationships,
          as: 'calibratedBy',
        },
      });
      if (calibration === null) continue;
      const relations = [];
      for (let i = 0; i < calibration.calibratedBy.length; i += 1) {
        const inst = calibration.calibratedBy[i];
        const currentId = inst.dataValues.calibratedBy;
        // eslint-disable-next-line no-await-in-loop
        const found = await this.store.instruments.findOne({
          where: {
            id: currentId,
          },
        });
        if (found) {
          relations.push({
            vendor: found.dataValues.vendor,
            modelNumber: found.dataValues.modelNumber,
            // eslint-disable-next-line max-len
            serialNumber: (found.dataValues.serialNumber === null || found.dataValues.serialNumber.length === 0) ? null : found.dataValues.serialNumber,
            assetTag: found.dataValues.assetTag,
          });
          dates.set(found.dataValues.assetTag, calibration.dataValues.date);
          assetTagArray.push(found.dataValues.assetTag);
        } else {
          relations.push({
            vendor: inst.dataValues.byVendor,
            modelNumber: inst.dataValues.byModelNumber,
            // eslint-disable-next-line max-len
            serialNumber: (inst.dataValues.serialNumber === null || inst.dataValues.serialNumber.length === 0) ? null : inst.dataValues.serialNumber,
            assetTag: inst.dataValues.byAssetTag,
          });
          dates.set(inst.dataValues.assetTag, calibration.dataValues.date);
          assetTagArray.push(inst.dataValues.assetTag);
        }
      }
      const cert = {
        vendor: instrument.dataValues.vendor,
        modelNumber: instrument.dataValues.modelNumber,
        // eslint-disable-next-line max-len
        serialNumber: (instrument.dataValues.serialNumber === null || instrument.dataValues.serialNumber.length === 0) ? null : instrument.dataValues.serialNumber,
        assetTag: instrument.dataValues.assetTag,
        modelDescription: instrument.dataValues.description,
        calibrationFrequency: instrument.dataValues.calibrationFrequency,
        calibrationComment: calibration.dataValues.comment,
        calibrationDate: calibration.dataValues.date,
        calibratorUserName: calibration.dataValues.user,
        calibratorFirstName: calibration.dataValues.userFirstName,
        calibratorLastName: calibration.dataValues.userLastName,
        approvalStatus: calibration.dataValues.approvalStatus === 1 ? 'Approved' : 'Not Required',
        approvalComment: calibration.dataValues.approvalComment,
        approvalDate: calibration.dataValues.approvalDate,
        approverUsername: calibration.dataValues.approverUsername,
        approverFirstName: calibration.dataValues.approverFirstName,
        approverLastName: calibration.dataValues.approverLastName,
        // eslint-disable-next-line max-len
        isFileAttached: calibration.dataValues.fileLocation !== null && calibration.dataValues.fileName !== null,
        fileLocation: calibration.dataValues.fileLocation,
        fileName: calibration.dataValues.fileName,
        isKlufe: calibration.dataValues.klufeData !== null,
        klufeData: calibration.dataValues.klufeData,
        isLoadBank: calibration.dataValues.loadBankData !== null,
        loadBankData: calibration.dataValues.loadBankData,
        isCustomForm: calibration.dataValues.customFormData !== null,
        customFormData: calibration.dataValues.customFormData,
        calibratedBy: relations,
      };
      result.push(cert);
    }
    return result;
  }
}

module.exports = CalibrationEventAPI;
