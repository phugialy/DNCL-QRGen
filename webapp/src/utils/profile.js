import { normalizeText } from '@qr';

export const resolveDefaultText = (profile = {}) => {
  return normalizeText(profile?.defaultMessage || '');
};

