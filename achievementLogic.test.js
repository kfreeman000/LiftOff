import {
  hasMusclePowerFromWorkoutRows,
  friendAchievementKeysToAward,
} from './achievementLogic';

describe('hasMusclePowerFromWorkoutRows', () => {
  test('false for empty history', () => {
    expect(hasMusclePowerFromWorkoutRows([])).toBe(false);
  });

  test('false for single entry per exercise', () => {
    expect(
      hasMusclePowerFromWorkoutRows([
        { workout: 'Bench', weight: 100 },
        { workout: 'Squat', weight: 200 },
      ])
    ).toBe(false);
  });

  test('false when same weight repeated', () => {
    expect(
      hasMusclePowerFromWorkoutRows([
        { workout: 'Bench', weight: 100 },
        { workout: 'Bench', weight: 100 },
      ])
    ).toBe(false);
  });

  test('true when weight increased for same exercise', () => {
    expect(
      hasMusclePowerFromWorkoutRows([
        { workout: 'Bench', weight: 100 },
        { workout: 'Bench', weight: 105 },
      ])
    ).toBe(true);
  });

  test('ignores invalid rows', () => {
    expect(
      hasMusclePowerFromWorkoutRows([
        { workout: 'Bench', weight: 100 },
        { workout: '', weight: 105 },
        { workout: 'Bench', weight: 'x' },
      ])
    ).toBe(false);
  });
});

describe('friendAchievementKeysToAward', () => {
  test('no friends — no keys', () => {
    expect(friendAchievementKeysToAward(0)).toEqual([]);
  });

  test('first friend — Friend Finder', () => {
    expect(friendAchievementKeysToAward(1)).toEqual(['4']);
  });

  test('ten friends — both social achievements', () => {
    expect(friendAchievementKeysToAward(10)).toEqual(['4', '5']);
  });
});
