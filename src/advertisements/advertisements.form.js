const advertisementsForm = [
  {
    name: 'shortText',
    label: 'Short text',
    type: 'text',
    required: true,
    placeholder: 'Short text',
    input: true,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    required: false,
    placeholder: 'Description',
    textarea: true,
  },
  {
    name: 'images',
    label: 'Images',
    type: 'file',
    required: false,
    placeholder: 'Images',
    file: true,
  },
  {
    name: 'tags',
    label: 'Tags',
    type: 'text',
    required: false,
    placeholder: 'Tags',
    input: true,
  },
];
exports.advertisementsForm = advertisementsForm;
