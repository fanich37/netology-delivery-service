const Joi = require('joi');

const ADVERTISEMENT_IMAGE_EXTENSION_REGEXP_PATTERN = '\\.jpe?g$';
const ADVERTISEMENT_MAX_IMAGES_COUNT = 4;

const AdvertisementValidationSchema = Joi.object({
  shortText: Joi.string().required(),
  description: Joi.string().allow(''),
  images: Joi.array().items(Joi.string()).min(0).max(ADVERTISEMENT_MAX_IMAGES_COUNT),
  userId: Joi.string().guid({ version: 'uuidv4' }).required(),
  tags: Joi.array().items(Joi.string()).min(0).max(10),
});
exports.validateAdvertisementData = (advertisementData) => AdvertisementValidationSchema
  .validate
  .call(AdvertisementValidationSchema, advertisementData, { abortEarly: false });

const fileFilter = (_, file, cb) => {
  const { originalname } = file;
  const fileExtensionRegExp = new RegExp(ADVERTISEMENT_IMAGE_EXTENSION_REGEXP_PATTERN, 'i');
  const isValidFile = fileExtensionRegExp.test(originalname);

  cb(null, isValidFile);
};
exports.fileFilter = fileFilter;
exports.ADVERTISEMENT_MAX_IMAGES_COUNT = ADVERTISEMENT_MAX_IMAGES_COUNT;
