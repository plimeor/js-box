import { None, Option, Some } from './option'

export interface Result<T, E> {
  // Returns res if the result is Ok, otherwise returns the Err value of self.
  and<U>(res: Result<U, E>): Result<U, E>
  // Calls op if the result is Ok, otherwise returns the Err value of self.
  andThen<U>(op: (val: T) => Result<U, E>): Result<U, E>
  // Converts from Result<T, E> to Option<E>.
  err(): Option<E>
  // Returns true if the result is Err.
  isErr(): boolean
  // Returns true if the result is Ok.
  isOk(): boolean
  // Maps a Result<T, E> to Result<U, E> by applying a function to a contained Ok value, leaving an Err value untouched.
  map<U>(f: (val: T) => U): Result<U, E>;
  // Maps a Result<T, E> to Result<T, F> by applying a function to a contained Err value, leaving an Ok value untouched.
  mapErr<U>(f: (err: E) => U): Result<T, U>;
  // Returns the provided default (if Err), or applies a function to the contained value (if Ok)
  mapOr<U>(def: U, f: (val: T) => U): U
  // Maps a Result<T, E> to U by applying fallback function default to a contained Err value, or function f to a contained Ok value.
  mapOrElse<U>(fallback: (err: E) => U, f: (val: T) => U): U,
  // Converts from Result<T, E> to Option<T>.
  ok(): Option<T>
  // Returns res if the result is Err, otherwise returns the Ok value of self.
  or(res: Result<T, E>): Result<T, E>
  // Calls op if the result is Err, otherwise returns the Ok value of self.
  orElse<F>(op: (err: E) => Result<T, F>): Result<T, F>
  // Returns the contained Ok value
  unwrap(): T
  // Returns the contained Ok value or a provided default.
  unwrapOr(val: T): T
  // Returns the contained Ok value or computes it from a closure.
  unwrapOrElse(f: (err: E) => T): T
}

export function Ok<T>(val: T): Result<T, never> {
  const instance: Result<T, never> = {
    and: res => res,
    andThen: op => op(val),
    err: () => None(),
    isErr: () => false,
    isOk: () => true,
    map: f => Ok(f(val)),
    mapErr: () => instance,
    mapOr: (_, f) => f(val),
    mapOrElse: (_fallback, f) => f(val),
    ok: () => Some(val),
    or: () => instance,
    orElse: () => instance,
    unwrap: () => val,
    unwrapOr: () => val,
    unwrapOrElse: () => val
  }

  return instance
}

export function Err<E>(err: E): Result<never, E> {
  const instance: Result<never, E> = {
    and: () => instance,
    andThen: () => instance,
    err: () => Some(err),
    isErr: () => true,
    isOk: () => false,
    map: () => instance,
    mapErr: f => Err(f(err)),
    mapOr: def => def,
    mapOrElse: fallback => fallback(err),
    ok: () => None(),
    or: res => res,
    orElse: op => op(err),
    unwrap: () => {
      throw 'Err.unwrap'
    },
    unwrapOr: val => val,
    unwrapOrElse: f => f(err)
  }

  return instance
}
