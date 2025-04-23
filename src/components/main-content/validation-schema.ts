import * as Yup from 'yup';

export const ValidationSchema = (isUserSearching: boolean) =>
  Yup.object().shape({
    _id: Yup.string().when([], {
      is: () => !isUserSearching,
      then: (schema) => schema.required('ID is required'),
      otherwise: (schema) => schema.notRequired(),
    }),

    Title: Yup.string()
      .max(200, 'Title must be at most 200 characters')
      .when([], {
        is: () => !isUserSearching,
        then: (schema) => schema.required('Title is required'),
        otherwise: (schema) => schema.notRequired(),
      }),

    Artist: Yup.string()
      .max(100, 'Each artist name must be at most 100 characters')
      .when([], {
        is: () => !isUserSearching,
        then: (schema) => schema.required('Artist is required'),
        otherwise: (schema) => schema.notRequired(),
      }),

    ConstituentID: Yup.number().integer().min(0),
    ArtistBio: Yup.string().max(1000, 'Bio must be at most 1000 characters'),

    Nationality: Yup.string().max(100, 'Nationality must be at most 100 characters'),

    BeginDate: Yup.number().integer(),

    EndDate: Yup.number().integer(),

    Gender: Yup.string().max(20, 'Gender must be at most 20 characters'),

    Date: Yup.string()
      .max(50, 'Date must be at most 50 characters'),

    Medium: Yup.string()
      .max(500, 'Medium must be at most 500 characters'),

    Dimensions: Yup.string()
      .max(500, 'Dimensions must be at most 500 characters'),

    CreditLine: Yup.string()
      .max(500, 'Credit line must be at most 500 characters'),

    AccessionNumber: Yup.string()
      .max(50, 'Accession number must be at most 50 characters'),

    Classification: Yup.string()
      .max(100, 'Classification must be at most 100 characters'),

    Department: Yup.string()
      .max(100, 'Department must be at most 100 characters'),

    DateAcquired: Yup.string()
      .max(20, 'Date acquired must be at most 20 characters'),

    Cataloged: Yup.string()
      .max(20, 'Cataloged must be at most 20 characters'),

    ObjectID: Yup.number()
      .integer()
      .required('Object ID is required'),

    URL: Yup.string()
      .url('Must be a valid URL')
      .max(255, 'URL must be at most 20 characters'),

    OnView: Yup.string()
      .max(50, 'On View must be at most 50 characters'),

    'Height (cm)': Yup.number()
      .min(0, 'Height must be a non-negative number'),

    'Width (cm)': Yup.number()
      .min(0, 'Width must be a non-negative number'),
  });
