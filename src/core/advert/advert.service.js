const { DB } = require('../../db');
const { Advert, AdvertSchema } = require('./advert.model');

const advertDb = new DB('advert', AdvertSchema);

class AdvertService {
  constructor(db) {
    this.db = db;
  }

  async create({ shortText, description, images, userId, tags }) {
    try {
      const advertisement = new Advert({ shortText, description, images, userId, tags });
      const result = await this.db.create(advertisement);

      return result;
    } catch (error) {
      throw new Error(`[AdvertService][create]. Error: ${error.message}.`);
    }
  }

  async getAllAdverts() {
    try {
      const result = await this.db.getAll();

      return result?.filter(({ isDeleted }) => !isDeleted);
    } catch (error) {
      throw new Error(`[AdvertService][getAllAdverts]. Error ${error.message}.`);
    }
  }

  async getAdvertById(id) {
    try {
      const result = await this.db.findById(id);

      return result;
    } catch (error) {
      throw new Error(`[AdvertService][getAdvertById]. Error: ${error.message}.`);
    }
  }

  async remove(id) {
    try {
      const result = await this.db.delete(id);

      return result;
    } catch (error) {
      throw new Error(`[AdvertService][remove]. Error ${error.message}.`);
    }
  }
}

exports.AdvertService = new AdvertService(advertDb);
