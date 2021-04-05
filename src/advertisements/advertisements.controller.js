const { Router } = require('express');
const { AdvertisementsService } = require('./advertisements.service');
const { advertisementsForm } = require('./advertisements.form');
const { multiPartFormDataParser, fileStorage } = require('./advertisements.middleware');
const { restrictedRouteMiddleware } = require('../auth');

const AdvertisementsController = Router();

AdvertisementsController.get('/', async (req, res) => {
  try {
    const advertisements = await AdvertisementsService.getAllAdvertisements();

    return res.render('advertisements', { advertisements });
  } catch (error) {
    throw new Error(`[AdvertisementsController][get][/]. Error: ${error.message}.`);
  }
});

AdvertisementsController.get(
  '/create',
  restrictedRouteMiddleware,
  (_, res) => res.render('advertisement-form', {
    form: advertisementsForm,
    values: {},
    errors: {},
  }));

AdvertisementsController.post(
  '/create',
  restrictedRouteMiddleware,
  multiPartFormDataParser,
  async (req, res) => {
    const { _id: userId } = req.user || {};
    const { shortText, description, tags } = req.body;
    const { images = [] } = req.files;

    try {
      const advertisement = await AdvertisementsService.createAdvertisement({ shortText, description, images, userId, tags });

      if ('error' in advertisement) {
        images
          .filter(({ filename }) => filename)
          .forEach(({ filename }) => fileStorage
            .deleteFile(filename)
            .catch((error) => console.error(error.message)));

        return res.status(422).render('advertisement-form', {
          form: advertisementsForm,
          values: { shortText, description, userId, tags },
          errors: advertisement.error,
        });
      }

      return res.redirect(`/${advertisement._id}`);
    } catch (error) {
      throw new Error(`[AdvertisementsController][post][/create]. Error: ${error.message}.`);
    }
  });

AdvertisementsController.get('/:id', async (req, res) => {
  const { _id: userId } = req.user || {};
  const { id } = req.params;

  try {
    const advertisement = await AdvertisementsService.getAdvertisementById(id, userId);

    return advertisement
      ? res.render('advertisement-item', { advertisement })
      : res.status(404).render('not-found');
  } catch (error) {
    throw new Error(`[AdvertisementsController][get][/:id]. Error: ${error.message}.`);
  }
});

AdvertisementsController.post('/:id/delete', restrictedRouteMiddleware, async (req, res) => {
  const { _id: userId } = req.user || {};
  const { id } = req.params;

  try {
    const result = await AdvertisementsService.delete(id, userId);
    const pathToRedirect = result ? '/' : `/${id}`;

    res.redirect(pathToRedirect);
  } catch (error) {
    throw new Error(`[AdvertisementsController][post][/:id/delete]. Error: ${error.message}.`);
  }
});

exports.AdvertisementsController = AdvertisementsController;
