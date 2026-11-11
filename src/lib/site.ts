export const SITE_URL = 'https://www.marcoscamara.com';
export const SITE_NAME = "Marcos Cámara's blog";

export const GITHUB_URL = 'https://github.com/MarcosCamara01';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/marcospenelascamara';
export const X_URL = 'https://twitter.com/marcoscamara01';
export const X_HANDLE = '@marcoscamara01';

// schema.org Person, shared by the home page and article JSON-LD.
export const AUTHOR = {
  '@type': 'Person',
  name: 'Marcos Penelas Cámara',
  url: SITE_URL,
  jobTitle: 'Full-stack developer',
  sameAs: [GITHUB_URL, LINKEDIN_URL, X_URL],
};
