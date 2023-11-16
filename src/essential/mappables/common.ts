import {
    Input as TupleInput,
    Output as TupleOutput,
    NonEmptyInput as TupleNonEmptyInput
} from '../Tuple/common'

export type Key = string | number | symbol;
export type Obj<T = unknown> = { [k: Key]: T };

export type Mappable<T = unknown> = Partial<Obj<T>> | TupleInput<T>;
export type MappableInput<T = unknown> = Partial<Obj<T>> | TupleInput<T>;
export type MappableOutput<T = unknown> = Partial<Obj<T>> | TupleOutput<T>;
export type NonEmptyMappable<T = unknown> =
    | Partial<Obj<T>>
    | TupleNonEmptyInput<T>;

export type _NonEmptyMappable<T, V> =
    | TupleNonEmptyInput<V>
    | ([keyof T] extends [never] ? never : { [k: PropertyKey]: V });