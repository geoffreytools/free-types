import { Type, apply } from 'free-types-core';
import { Next, ArrayKeys, Tuple } from 'free-types-core/dist/utils';

export { _partial, _, PartialSparse }

declare const placeholder: unique symbol;
type _ = typeof placeholder;

/** Return a new type based upon `$T`, with `Args` already applied, expecting the remaining arguments.
 * 
 * Accept a placeholder `_` for skipping arguments */
type _partial <$T extends Type, Args extends PartialSparse<$T['constraints']>> =
    Args extends unknown[]
    ? SparsePartialType<$T, NormalizeArgs<Args, Required<$T['constraints']>['length']>>
    : never

type PartialSparse<T extends unknown[]> = Partial<{
    [K in keyof T]: K extends ArrayKeys ? T[K] : T[K] | _
}>

interface SparsePartialType<
    $T extends Type,
    Applied extends unknown[],
> extends Type {
    type: apply<$T, FillMissingArgs<Applied, this['arguments']>>
    constraints: Remaining<$T['constraints'], Applied>
    arguments: unknown[]
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


type IsOptional<T extends unknown[], I extends number> = [{
        [K in T['length'] as K]: K extends I ? never : unknown
    }[I]] extends [never] ? true : false;
    

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
    Args extends unknown[],
    End extends number,
    I extends number = 0,
    R extends unknown[] = [],
    Overshoot = false,
> = Args extends [] ? Tuple<End, _>
    : I extends End ? R
    : NormalizeArgs<
        Args,
        End,
        Next<I>,
        [...R, Overshoot extends false ? Args[I] : _],
        Next<I> extends Args['length'] ? true : Overshoot
    >