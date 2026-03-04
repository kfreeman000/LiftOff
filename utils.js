// Pure utility functions for calculations and formatting

/**
 * Calculate estimated one-rep max using the Epley formula
 * @param {number} weightLbs - Weight lifted in pounds (canonical unit)
 * @param {number} reps - Number of reps performed
 * @returns {number} Estimated 1RM in pounds
 */
export const calculate1RM = (weightLbs, reps) => {
  const r = Math.min(reps, 20); // cap at 20 reps for accuracy
  return weightLbs * (1 + r / 30);
};

/**
 * Convert pounds to kilograms.
 * @param {number} lbs
 * @returns {number}
 */
export const lbsToKg = (lbs) => lbs * 0.45359237;

/**
 * Convert kilograms to pounds.
 * @param {number} kg
 * @returns {number}
 */
export const kgToLbs = (kg) => kg / 0.45359237;

/**
 * Format a stored weight value (always in pounds) for display
 * in the user's preferred unit.
 *
 * @param {number|string} weightLbs - Stored weight value in pounds (or "unknown")
 * @param {"lbs"|"kg"} units - Display units
 * @returns {string}
 */
export const formatWeight = (weightLbs, units = 'lbs') => {
  if (weightLbs === 'unknown' || weightLbs === null || weightLbs === undefined) {
    return 'unknown';
  }

  const numeric = Number(weightLbs);
  if (!Number.isFinite(numeric)) {
    return String(weightLbs);
  }

  if (units === 'kg') {
    const kg = lbsToKg(numeric);
    const rounded = Math.round(kg * 10) / 10; // 1 decimal place
    return `${rounded} kg`;
  }

  return `${numeric} lbs`;
};

/**
 * Ensure email exists and is properly formatted
 * @param {string} email - Email used to create account
 * @returns {boolean} - If false, the email has invalid chars. If true, the email is valid
 */
// export const emailTest = (email) 
