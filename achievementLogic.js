/**
 * Pure achievement rules (no Firebase). Used by achievements.js and unit tests.
 */

/**
 * True if history shows at least one lift where the user logged different weights
 * for the same exercise (implies a weight increase vs a prior entry).
 *
 * @param {Array<{ workout?: string, weight?: unknown }>} rows
 * @returns {boolean}
 */
export function hasMusclePowerFromWorkoutRows(rows) {
  const byExercise = {};
  for (const row of rows) {
    const { workout, weight } = row;
    const w = Number(weight);
    if (!workout || !Number.isFinite(w)) continue;
    if (!byExercise[workout]) byExercise[workout] = [];
    byExercise[workout].push(w);
  }
  for (const weights of Object.values(byExercise)) {
    if (weights.length < 2) continue;
    if (Math.max(...weights) > Math.min(...weights)) return true;
  }
  return false;
}

/**
 * Achievement keys to grant based on friend count (Friend Finder + Community Driven).
 *
 * @param {number} friendCount
 * @returns {string[]}
 */
export function friendAchievementKeysToAward(friendCount) {
  const keys = [];
  if (friendCount >= 1) keys.push('4');
  if (friendCount >= 10) keys.push('5');
  return keys;
}
