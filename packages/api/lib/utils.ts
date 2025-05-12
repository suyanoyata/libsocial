type Success<T> = {
  data: T;
  error?: never;
};

type Failure<E> = {
  data?: never;
  error: E;
};

export async function throwable<T, E = unknown>(
  func: (() => T) | Promise<T>
): Promise<Success<T> | Failure<E>> {
  try {
    const data = await (func instanceof Promise ? func : Promise.resolve().then(func));
    return { data };
  } catch (error) {
    return { error: error as E };
  }
}
