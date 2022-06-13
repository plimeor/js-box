# Arithmetic Types

## Result

```typescript
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

export function Ok<T>(val: T): Result<T, never>

export function Err<E>(err: E): Result<never, E> 
```

## Option

```typescript
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

export function Some<T>(val: T): Option<T>

export function None(): Option<never>
```

