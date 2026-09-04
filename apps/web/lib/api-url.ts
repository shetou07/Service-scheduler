const localApiUrl = 'http://localhost:4000/api';
const hostedApiUrl = 'https://coach-rickie-api.onrender.com/api';

// NEXT_PUBLIC_API_URL overrides this hosted default in every deployed environment.
// Never fall back to localhost in a production browser bundle.
export const apiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? hostedApiUrl : localApiUrl);
