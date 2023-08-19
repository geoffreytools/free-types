import { Input as TupleInput, Output as TupleOutput } from '../Tuple/common'

export type Key = string | number | symbol;
export type Obj<T = unknown> = { [k: Key]: T };

export type Mappable<T = unknown> = Partial<Obj<T>> | TupleInput<T>;
export type Input<T = unknown> = Partial<Obj<T>> | TupleInput<T>;
export type Output<T = unknown> = Partial<Obj<T>> | TupleOutput<T>;
export type NonEmptyMappable<T = unknown> = Partial<Obj<T> | readonly [T, ...T[]]>;