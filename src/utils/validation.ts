import * as yup from 'yup';

export const shortenUrlSchema = yup.object({
  original_url: yup
    .string()
    .url('Please enter a valid URL (e.g., https://example.com)')
    .required('Original URL is required'),
  custom_code: yup
    .string()
    .matches(/^[a-zA-Z0-9]*$/, 'Custom code must be alphanumeric')
    .optional(),
}).required();

export type ShortenUrlFormData = yup.InferType<typeof shortenUrlSchema>;
