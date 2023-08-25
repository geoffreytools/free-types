import { Type, Checked, IsOptional, Next, apply, Slice } from 'free-types-core';

export { Tuple as From } from 'free-types-core/dist/utils';

/** Type definition for strict tuples */
export type Tuple<T = unknown> = readonly [] | NonEmptyTuple<T>;

/** Type definition for Tuple inputs, including open-ended tuples and tuples with optional elements */
export type Input<T = unknown> = readonly (T | undefined)[]

/** Type definition for Tuple outputs */
export type Output<T = unknown, U = undefined> = (T | U)[]

export type NonEmptyTuple<T = unknown> = readonly [T, ...(readonly T[])];

export type NonEmptyInput<T = unknown> = readonly [T, ...(readonly(T | undefined)[])]

/** Utility type for specifying the generic return type */
export type Fallback<
    T extends Input,
    F,
    U = undefined extends T[number]? undefined : never
> = T extends unknown[] ? (F | U)[]
    : readonly (F | U)[]

/** append an element to a tuple, preserving the write mode */
export type Append<T extends Input, U> =
    T extends unknown[] ? [...T, U] : readonly [...T, U]

/** concat tuples, preserving the write mode of the first one */
export type Concat<T extends Input, U  extends Input> =
    T extends unknown[] ? [...T, ...U] : readonly [...T, ...U]

/** create an empty tuple, optionally based of a model */
export type Empty<Model = Input> =
    Model extends unknown[] ? [] : readonly [];

/** create an empty tuple, optionally based of a model */
export type Of<T, Model = Input> =
    Model extends unknown[] ? T[] : readonly T[];

/** Interface for iteration callback */
export interface $Reducer extends Type<number, Input> {
    Acc: Checked<0, this>
    'T[I]': this[1]
    I: this[2] & number
    T: Checked<3, this>
    
    constraints: [
        Acc: Input,
        TI: unknown,
        I: number,
        T: Input
    ]
}

export type WrapOptional<T extends Input, I extends number, TI = T[I]> =
    IsOptional<T, I> extends true ? [TI?] : [TI]

export type Reduce<
    T extends Input,
    $F extends $Reducer,
    L = Required<T>['length'],
    I extends number = 0,
    R extends Input = Empty<T>
> = I extends L ? R
    : Reduce<T, $F, L, Next<I>, apply<$F, [R, T[I], I, T]>>;