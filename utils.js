// Pure utility functions for calculations

/**
 * Calculate estimated one-rep max using the Epley formula
 * @param {number} weight - Weight lifted
 * @param {number} reps - Number of reps performed
 * @returns {number} Estimated 1RM
 */
export const calculate1RM = (weight, reps) => {
  const r = Math.min(reps, 20); // cap at 20 reps for accuracy
  return weight * (1 + r / 30);
};
