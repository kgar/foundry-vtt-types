declare namespace Array {
  type Flattened<T> = T extends Array<infer U> ? Flattened<U> : T;
}

interface Array<T> {
  /**
   * Flatten nested arrays by concatenating their contents
   * @returns An array containing the concatenated inner values
   */
  deepFlatten(): Array<Array.Flattened<T>>;

  /**
   * Test equality of the values of this array against the values of some other Array
   */
  equals(other: T[]): boolean;

  /**
   * Partition an original array into two children array based on a logical test
   * Elements which test as false go into the first result while elements testing as true appear in the second
   * @param rule - The rule to partition by
   * @returns An Array of length two whose elements are the partitioned pieces of the original
   */
  partition(rule: (val: T) => boolean): [T[], T[]];

  /**
   * Join an Array using a string separator, first filtering out any parts which return a false-y value
   * @param sep - The separator string
   * @returns The joined string, filtered of any false values
   */
  filterJoin(sep: string): string;

  /**
   * Find an element within the Array and remove it from the array
   * @param find - A function to use as input to findIndex
   * @param replace - A replacement for the spliced element
   * @returns The replacement element, the removed element, or null if no element was found.
   */
  findSplice(find: (value: T, index: number, obj: T[]) => boolean, replace?: T): T | null;
}

interface ArrayConstructor {
  /**
   * Create and initialize an array of length n with integers from 0 to n-1
   * @param n - The desired array length
   * @returns An array of integers from 0 to n
   */
  fromRange(n: number): number[];
}
