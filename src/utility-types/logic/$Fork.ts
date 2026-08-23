import { IsAny, Next } from 'utils';
import { _apply, _Type, Type } from 'core';

export { Fork, $Fork }

interface $Fork<
    $P extends _Type<unknown[], boolean>,
    $A extends _Type,
    $B extends _Type,
    Constraints extends unknown[] = MergeConstraints<[$P, $A, $B]>
> extends Type<Constraints> {
    type: _Fork<$P, $A, $B, this['arguments']>
}

type Fork<
    $P extends _Type<unknown[], boolean>,
    $A extends _Type,
    $B extends _Type,
    Args extends MergeConstraints<[$P, $A, $B]>
> = _Fork<$P, $A, $B, Args>

type _Fork<
    $P extends _Type,
    $A extends _Type,
    $B extends _Type,
    Args extends unknown[]
> = _apply<_apply<$P, Args> extends false ? $B : $A, Args>

type MergeConstraints<
    T extends _Type[],
    Acc = AnyToNever<T[0]['constraints']>,
    I extends number = 1
> =  I extends T['length'] ? unknown[] & Acc
    : MergeConstraints<T, Acc | AnyToNever<T[I]['constraints']>, Next<I>>

type AnyToNever<T> = IsAny<T> extends true ? never : T;