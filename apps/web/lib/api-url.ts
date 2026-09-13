const localApiUrl = 'http://localhost:4000/api';

// Production requests use Next.js rewrites, keeping the admin session cookie
// first-party even when the Nest API is hosted on a different domain.
export const apiUrl =
  process.env.NODE_ENV === 'production' ? '/api' : localApiUrl;
