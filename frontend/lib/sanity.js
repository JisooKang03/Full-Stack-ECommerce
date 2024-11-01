// frontend/lib/sanity.js
import sanityClient from '@sanity/client';

export const client = sanityClient({
  projectId: 'your_project_id',
  dataset: 'production',
  useCdn: true,
});
