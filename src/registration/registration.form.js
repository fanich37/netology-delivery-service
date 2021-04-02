const registrationForm = [
  {
    name: 'name',
    label: 'Your name',
    type: 'text',
    required: true,
    placeholder: 'Your name',
  },
  {
    name: 'email',
    label: 'Your email',
    type: 'text',
    required: true,
    placeholder: 'Your email',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    placeholder: 'Password',
  },
  {
    name: 'contactPhone',
    label: 'Contact phone',
    type: 'text',
    required: false,
    placeholder: 'Contact phone',
  },
];
exports.registrationForm = registrationForm;
