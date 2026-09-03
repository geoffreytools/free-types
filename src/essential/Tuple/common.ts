import { Type, Checked, At, Lossy, IsOptional, Next, apply } from 'core';

export { Tuple as From } from 'utils';


export type ExcludeOptional<
    T extends readonly unknown[],
    I extends number = 0,
    R extends unknown[] = []
> = number extends T['length'] ? T
    : I extends T['length'] ? R
    : ExcludeOptional<T, Next<I>, [...R, T[I]]>;

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

/** concat 2 tuples, preserving the write mode of the first one */
export type Concat<T extends Input, U  extends Input> =
    T extends unknown[] ? [...T, ...U] : readonly [...T, ...U]

/** create an empty tuple, optionally copying the write mode of a Model */
export type Empty<Model = Input> =
    Model extends unknown[] ? [] : readonly [];

/** create an array, optionally copying the write mode of a Model */
export type Of<T, Model = Input> =
    Model extends unknown[] ? T[] : readonly T[];

/** Interface with baked type parameters for your reducers.
 * 
 * Makes the following fields available:
 * - `this['Acc']`: the accumulator
 * - `this['Val']`: the current value
 * - `this['I']`: the current index
 * - `this['Src']`: the source tuple
*/

export interface $Reducer extends Type<
    { Acc: [0, Input], Val: 1, I: [2, number], Src: [3, Input] },
    Input
> {
    Acc: Checked<'Acc', this>
    Val: At<'Val', this>
    I: Lossy<'I', this>
    Src: Checked<'Src', this>
}

/** Interface with baked type parameters for your transforms.
 * 
 * Makes the following fields available:
 * - `Val`: the current value
 * - `Index`: the current index
 * - `Source`: the source tuple
*/
export interface $Transform extends Type<[Val: unknown, I: number, T: Input], Input> {
    Val: this[0]
    I: this[1] & number
    Src: Checked<2, this>
}

export type WrapOptional<Src extends Input, I extends number, Val = Src[I]> =
    IsOptional<Src, I> extends true ? [Val?] : [Val]

export type Fold<
    Src extends Input,
    Init,
    $F extends Type,
    L = Required<Src>['length'],
    I extends number = 0,
    Acc = Init
> = I extends L ? Acc
    : Fold<Src, Init, $F, L, Next<I>, apply<$F, [Acc, Src[I], I, Src]>>;