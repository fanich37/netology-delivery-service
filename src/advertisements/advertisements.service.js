const { transformErrors } = require('../utils/transformers');
const { UserService } = require('../core/user');
const { AdvertService } = require('../core/advert');
const { validateAdvertisementData } = require('./advertisements.validators');

class AdvertisementsService {
  constructor(userService, advertService) {
    this.userService = userService;
    this.advertService = advertService;
  }

  async getAllAdvertisements() {
    try {
      const result = await this.advertService.getAllAdverts();

      return result;
    } catch (error) {
      throw new Error(`[AdvertisementsService][getAll]. Error: ${error.message}.`);
    }
  }

  async getAdvertisementById(id, userId) {
    try {
      const advert = await this.advertService.getAdvertById(id);

      if (!advert) {
        return null;
      }

      const user = await this.userService.findUserById(advert.userId);
      const result = { ...advert, user, isEditable: userId === advert.userId };

      return result;
    } catch (error) {
      throw new Error(`[AdvertisementsService][getAdvertisementById]. Error: ${error.message}.`);
    }
  }

  async createAdvertisement({ shortText, description, images, userId, tags }) {
    const tagsAsArray = tags.split(' ').filter(Boolean).map((tag) => tag.trim());
    const imagesAsArray = images.map(({ filename }) => filename);
    const { error } = validateAdvertisementData({
      shortText,
      description,
      images: imagesAsArray,
      userId,
      tags: tagsAsArray,
    });

    if (error) {
      return { error: transformErrors(error) };
    }

    try {
      const result = await this.advertService.create({
        shortText,
        description,
        images: imagesAsArray,
        userId,
        tags: tagsAsArray,
      });

      return result;
    } catch (error) {
      throw new Error(`[AdvertisementsService][createAdvertisement]. Error: ${error.message}.`);
    }

  }

  async deleteAdvertisement(id, userId) {
    try {
      const advert = await this.advertService.getAdvertById(id);

      if (userId !== advert.userId) {
        return false;
      }

      const result = await this.advertService.remove(id);

      return result;
    } catch (error) {
      throw new Error(`[AdvertisementsService][deleteAdvertisement]. Error: ${error.message}.`);
    }
  }
}

exports.AdvertisementsService = new AdvertisementsService(UserService, AdvertService);
