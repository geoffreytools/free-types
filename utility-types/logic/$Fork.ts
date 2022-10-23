import { IsAny, Next } from '../../essential/utils';
import { apply, Type } from 'free-types-core';

export { Fork, $Fork }

interface $Fork<
    $P extends Type<unknown[], boolean>,
    $A extends Type,
    $B extends Type,
    Constraints extends unknown[] = MergeConstraints<[$P, $A, $B]>
> extends Type<Constraints> {
    type: _Fork<$P, $A, $B, this['arguments']>
}

type Fork<
    $P extends Type<unknown[], boolean>,
    $A extends Type,
    $B extends Type,
    Args extends MergeConstraints<[$P, $A, $B]>
> = _Fork<$P, $A, $B, Args>

type _Fork<
    $P extends Type,
    $A extends Type,
    $B extends Type,
    Args extends unknown[]
> = apply<apply<$P, Args> extends false ? $B : $A, Args>

type MergeConstraints<
    T extends Type[],
    Acc = AnyToNever<T[0]['constraints']>,
    I extends number = 1
> =  I extends T['length'] ? unknown[] & Acc
    : MergeConstraints<T, Acc | AnyToNever<T[I]['constraints']>, Next<I>>

type AnyToNever<T> = IsAny<T> extends true ? never : T;