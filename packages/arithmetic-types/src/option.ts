import { Err, Ok, Result } from './result'

export interface Option<T> {
  // Returns None if the option is None, otherwise returns optb.
  and<U>(optb: Option<U>): Option<U>,
  // Returns None if the option is None, otherwise calls f with the wrapped value and returns the result.
  andThen<U>(f: (val: T) => Option<U>): Option<U>,
  // Returns true if the option is a None value.
  isNone(): boolean,
  // Returns true if the option is a Some value.
  isSome(): boolean,
  // Maps an Option<T> to Option<U> by applying a function to a contained value.
  map<U>(f: (val: T) => U): Option<U>,
  // Returns the provided default result (if none), or applies a function to the contained value (if any).
  mapOr<U>(def: U, f: (val: T) => U): U,
  // Computes a default function result (if none), or applies a different function to the contained value (if any).
  mapOrElse<U>(fallback: () => U, f: (val: T) => U): U,
  // Transforms the Option<T> into a Result<T, E>, mapping Some(v) to Ok(v) and None to Err(err).
  okOr<E>(err: E): Result<T, E>,
  // Transforms the Option<T> into a Result<T, E>, mapping Some(v) to Ok(v) and None to Err(err()).
  okOrElse<E>(err: () => E): Result<T, E>,
  // Returns the option if it contains a value, otherwise returns optb.
  or(optb: Option<T>): Option<T>,
  // Returns the option if it contains a value, otherwise calls f and returns the result.
  orElse(f: () => Option<T>): Option<T>,
  // Returns the contained Some value, consuming the self value.
  unwrap(): T,
  // Returns the contained Some value or a provided default.
  unwrapOr(def: T): T,
  // Returns the contained Some value or computes it from a closure.
  unwrapOrElse(f: () => T): T,
}

export function Some<T>(val: T): Option<T> {
  const instance: Option<T> = {
    and: optb => optb,
    andThen: f => f(val),
    isNone: () => false,
    isSome: () => true,
    map: f => Some(f(val)),
    mapOr: (_, f) => f(val),
    mapOrElse: (_, f) => f(val),
    okOr: () => Ok(val),
    okOrElse: () => Ok(val),
    or: () => instance,
    orElse: () => instance,
    unwrap: () => val,
    unwrapOr: () => val,
    unwrapOrElse: () => val
  }

  return instance
}

let _none: Option<never> | null

export function None(): Option<never> {
  if (_none) {
    return _none
  }

  const instance: Option<never> = {
    and: () => instance,
    andThen: () => instance,
    isNone: () => true,
    isSome: () => false,
    map: () => instance,
    mapOr: def => def,
    mapOrElse: fallback => fallback(),
    okOr: err => Err(err),
    okOrElse: err => Err(err()),
    or: optb => optb,
    orElse: f => f(),
    unwrap: () => {
      throw 'None.unwrap()'
    },
    unwrapOr: def => def,
    unwrapOrElse: f => f()
  }

  _none = instance

  return instance
}
