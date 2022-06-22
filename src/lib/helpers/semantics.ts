/**
 * Signify that this function has no operation.
 * ```ts
 * somePromise.then(() => { doSomething(); }).catch(noop);
 * ```
 * @returns undefined
 */
export const noop = () => undefined;
