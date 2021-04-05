const uuid = require('uuid').v4;

class Advert {
  constructor({
    shortText,
    description = '',
    images = [],
    userId,
    tags = [],
  }) {
    this._id = uuid();
    this.shortText = shortText;
    this.description = description;
    this.images = images;
    this.userId = userId;
    this.createdAt = new Date().toISOString();
    this.updatedAt = this.createdAt;
    this.tags = tags;
    this.isDeleted = false;
  }
}

const AdvertSchema = {
  _id: String,
  shortText: String,
  description: String,
  images: [String],
  userId: String,
  createdAt: Date,
  updatedAt: Date,
  tags: [String],
  isDeleted: Boolean,
};

exports.Advert = Advert;
exports.AdvertSchema = AdvertSchema;
