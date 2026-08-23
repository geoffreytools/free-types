import { Type, _apply, _Type } from 'core';
import { Next, ArrayKeys, Tuple, IsOptional } from './utils';

export { _partial, _, PartialSparse }

declare const placeholder: unique symbol;
type _ = typeof placeholder;

/** Return a new type based upon `$T`, with `Args` already applied, expecting the remaining arguments.
 * 
 * Accept a placeholder `_` for skipping arguments */
type _partial<
    $T extends _Type,
    Args extends PartialSparse<$T['constraints']>,
    End extends number = Required<$T['constraints']>['length']
> = SparsePartialType<$T, Args extends [] ? Tuple<End, _> : NormalizeArgs<Args, End>>

type PartialSparse<T extends unknown[]> = {
    [K in keyof T]?: K extends ArrayKeys ? T[K] : T[K] | _
} & { length: number }

interface SparsePartialType<
    $T extends _Type,
    Applied extends unknown[],
> extends Type<Remaining<$T['constraints'], Applied>> {
    type: _apply<$T, FillMissingArgs<Applied, this['arguments']>>
}

type Remaining<Constraints extends unknown[], Applied extends unknown[]> =
    unknown[] extends Applied ? unknown[] : _Remaining<Constraints, Applied>

type _Remaining<
    Constraints extends unknown[],
    Applied extends unknown[],
    I extends number = 0,
    R extends unknown[] = [],
    V extends unknown[] = Applied[I] extends _
        ? IsOptional<Constraints, I> extends true
            ? [Constraints[I]?] : [Constraints[I]]
        : []
> = I extends Applied['length'] ? R
    : _Remaining<Constraints, Applied, Next<I>, [...R, ...V]>;


    

type FillMissingArgs<Applied extends unknown[], Args extends unknown[]> =
    unknown[] extends Args ? unknown[] : _FillMissingArgs<Applied, Args>;

type _FillMissingArgs<
    Applied extends unknown[],
    Args extends unknown[],
    I extends number = 0,
    J extends number = 0,
    R extends unknown[] = []
> = I extends Applied['length'] ? R
    : _FillMissingArgs<
        Applied,
        Args,
        Next<I>,
        Applied[I] extends _ ? Next<J> : J,
        [...R, Applied[I] extends _ ? (
            J extends Args['length'] ? Applied[I] : Args[J]
        ) : Applied[I]]
    >

type NormalizeArgs<
    Args extends {[k: number]: unknown, length: number},
    End extends number,
    I extends number = 0,
    R extends unknown[] = [],
    Overshoot = false,
> = I extends End ? R : NormalizeArgs<
    Args,
    End,
    Next<I>,
    [...R, Overshoot extends false ? Args[I] : _],
    Next<I> extends Args['length'] ? true : Overshoot
>