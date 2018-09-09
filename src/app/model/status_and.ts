import {Observable, of} from 'rxjs';
import {catchError, map, startWith} from 'rxjs/operators';

/** Denotes the status of a computation or backend request. */
export enum Status {
  /** Initial state, the resource has not yet begun loading. */
  INITIAL = 'INITIAL',

  /** The resource is currently loading. */
  LOADING = 'LOADING',

  /** The resource loaded successfully. */
  READY = 'READY',

  /** An error occurred while loading the resource. */
  ERROR = 'ERROR'
}

export interface StatusAnd<T, E = Error> {
  /**
   * The result of the computation. A result may still be present together with
   * any status. When the status !== READY this value may represent an
   * application-specific intermediary state (e.g. the previous state, a partial
   * result, etc.).
   */
  readonly result?: T;

  /** Whether the result is currently loading, ready, etc. */
  readonly status: Status;

  /**
   * Optional error message if an error occurred. Should be populated when (and
   * may only be populated when) the status === ERROR.
   */
  readonly error?: E;
}

/**
 * Returns true if the given status value matches any of the expected values.
 */
export function matches(
  value: Status|undefined, ...expected: Array<Status|undefined>) {
return expected.some(v => v === value);
}

/**
* Returns true if all supplied StatusAnd objects are ready.
*/
export function allReady(...inputs: Array<StatusAnd<{}>>): boolean {
return inputs.every(i => i.status === Status.READY);
}

/**
* Status that a computation has not yet started.
* @param result optional placeholder result
*/
export function initial<T, E = Error>(result?: T): StatusAnd<T, E> {
return {status: Status.INITIAL, result};
}

/**
* Status that a computation is in progress.
* @param result optional intermediate result
*/
export function loading<T, E = Error>(result?: T): StatusAnd<T, E> {
return {status: Status.LOADING, result};
}

/**
* Status that a computation has completed.
* @param result final computation result
*/
export function ready<T, E = Error>(result: T): StatusAnd<T, E> {
return {status: Status.READY, result};
}

/**
* Status that a computation has failed.
* @param error error message
*/
export function error<T, E = Error>(error: E): StatusAnd<T, E> {
return {status: Status.ERROR, error};
}

/**
* Pipeable operator to wrap an Observable into a `StatusAnd` Observable.
* Starts with `Status.LOADING` and catches errors from the source Observable.
* Emits `Status.READY` and the source's value upon its emission.
*/
export function wrap<T, E = Error>(source: Observable<T>):
  Observable<StatusAnd<T, E>> {
return source.pipe(
    map(value => ready<T, E>(value)),
    catchError(err => of(error<T, E>(err))),
    startWith(loading<T, E>()),
);
}

