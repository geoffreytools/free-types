import { Type, apply } from 'free-types-core/dist/';
import { IsOptional, Tuple as CreateTuple, Next } from 'free-types-core/dist/utils';
import { $Constrain } from '../adapters/$Constrain';
import { PreserveReadonly, Tuple } from './common';

export { MapOver, $MapOver };

type MapOver<T extends Tuple<$T['constraints'][0]>, $T extends Type> =
    number extends T['length'] ? {
        [I in keyof T]: I extends keyof [] ? T[I] : apply<$T, [T[I], I]>
    }
    : undefined extends T[number] 
    ? RecursiveOptional<T, $T>
    : Recursive<T, $T>

type RecursiveOptional<
    T extends readonly unknown[],
    $T extends Type,
    I extends number = 0,
    R extends unknown[] = [],
    L extends number = Required<T>['length']
> = I extends L ? PreserveReadonly<T, R>
    : IsOptional<T, I> extends true 
    ? RecursiveOptional<T, $T, Next<I>, [...R, apply<$T, [Exclude<T[I], undefined>, I]>?], L>
    : RecursiveOptional<T, $T, Next<I>, [...R, apply<$T, [T[I], I]>], L>

type Recursive<
    T extends readonly unknown[],
    $T extends Type,
    I extends number = 0,
    R extends unknown[] = [],
    L extends number = T['length']
> = I extends L ? PreserveReadonly<T, R>
    : Recursive<T, $T, Next<I>, [...R, apply<$T, [T[I], I]>], L>

interface _$MapOver<$T extends Type<1|2>> extends Type {
    type: this[0] extends this['constraints'][0]
        ? MapOver<this[0], $T>
        : $T['type'][]
    constraints: [Tuple<$T['constraints'][0]>]
}

type $MapOver<$T extends Type<1|2>, L extends number = never> =
    [L] extends [never] ? _$MapOver<$T>
    : $Constrain<_$MapOver<$T>, [CreateTuple<L>]>
