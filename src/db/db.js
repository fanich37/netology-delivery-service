class DB {
  static DELAY_TIME = 2000;

  static delay() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, Math.random() * DB.DELAY_TIME);
    });
  }

  // eslint-disable-next-line no-unused-vars
  constructor(entityName, entitySchema, mock) {
    this.entityName = entityName;
    this.entities = mock || [];
  }

  async getAll() {
    await DB.delay();

    return this.entities;
  }

  async findById(id) {
    await DB.delay();

    return this.entities.find((entity) => entity._id === id);
  }

  async findOneByParams(params) {
    await DB.delay();

    return this.entities.find((entity) => {
      const keys = Object.keys(params);

      return keys.every((key) => params[key] === entity[key]);
    });
  }

  async create(record) {
    await DB.delay();

    this.entities.push(record);

    return record;
  }

  async update(id, data) {
    await DB.delay();

    const index = this.entities.findIndex((entity) => entity._id === id);
    this.entities[index] = { ...this.entities[index], ...data };

    return this.entities[index];
  }

  async delete(id) {
    await DB.delay();

    this.entities = this.entities.filter((entity) => entity._id !== id);

    return true;
  }
}

exports.DB = DB;
