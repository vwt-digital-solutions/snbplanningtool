/**
 * A function that allows easy access to nested JSON properties.
 *
 * @param obj - A valid JSON / JSON-like object
 * @param path - A period delimited string
 * @returns The value located at the end of the path
 * @example
 * const x = { 'foo': { 'bar': 'baz' } }
 * getValue(x, 'foo.bar') // returns 'baz'
 */

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
export function getValue(obj: object, path: string): any {
  return path.replace(/\[/g, '.').replace(/\]/g, '').split('.').reduce((subnode, key) => {
      return (subnode || {})[key];
  }, obj);
}
