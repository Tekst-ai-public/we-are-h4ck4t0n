type DeepReplace<T> = {
  [P in keyof T]: T[P] extends bigint ? number : T[P] extends object ? DeepReplace<T[P]> : T[P];
};

/**
 * It converts a BigInt to a Number
 * @param {any} input - The input to be converted to JSON.
 * @returns A function that takes in a parameter called input and returns a JSON object.
 */
export function toJSON<T>(input: T): DeepReplace<T> {
  return JSON.parse(
    JSON.stringify(
      input,
      (key, value) => (typeof value === 'bigint' ? Number(value.toString()) : value) // return everything else unchanged
    )
  ) as DeepReplace<T>;
}
