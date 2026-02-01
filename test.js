import { calculate1RM } from "./utils";

test("calculates 1RM using Epley formula", () => {
  const result = calculate1RM(100, 10);
  expect(result).toBeCloseTo(133.33, 1);
});
