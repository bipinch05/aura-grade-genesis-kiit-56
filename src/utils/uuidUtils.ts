
/**
 * Generates a UUID v4 (random) compliant string
 * This is a better implementation than the simple one we had before
 */
export const v4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Generate a shorter unique ID (12 chars)
 * Useful for keys where full UUID might be overkill
 */
export const shortId = (): string => {
  return 'xxxxxxxxxxxx'.replace(/[x]/g, function() {
    return Math.floor(Math.random() * 16).toString(16);
  });
};
