const { model, Schema } = require('mongoose');

class DB {
  constructor(entityName, entitySchema) {
    if (
      (!entityName && typeof entityName !== 'string')
      || (!entitySchema && typeof entitySchema !== 'object')
    ) {
      throw new Error('[DB][constructor]. Entity name and schema are required.');
    }

    this.entity = model(entityName, new Schema(entitySchema));
  }

  async getAll() {
    try {
      const result = await this.entity.find({}, '-__v').lean();

      return result;
    } catch (error) {
      throw new Error(`[DB][getAll]. Error: ${error.message}.`);
    }
  }

  async findById(id) {
    const result = await this.entity.findById(id, '-__v').lean();

    return result;
  } catch(error) {
    throw new Error(`[DB][getOneById]. Error: ${error.message}.`);
  }

  async findOneByParams(params) {
    try {
      const result = this.entity.findOne(params, '-__v');

      return result;
    } catch (error) {
      throw new Error(`[DB][findOneByParams]. Error: ${error.message}.`);
    }
  }

  async create(record) {
    try {
      const result = await this.entity.create(record);

      return result;
    } catch (error) {
      throw new Error(`[DB][create]. Error: ${error.message}.`);
    }
  }

  async delete(id) {
    try {
      await this.entity.findOneAndUpdate(
        { _id: id },
        { isDeleted: true, updatedAt: new Date().toISOString() },
        { new: true, projection: '-__v' },
      );

      return true;
    } catch (error) {
      throw new Error(`[DB][delete]. Error: ${error.message}.`);
    }
  }
}

exports.DB = DB;
