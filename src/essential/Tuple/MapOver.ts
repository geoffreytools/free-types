import { Type, apply } from 'free-types-core';
import { IsOptional, Tuple, Next } from 'free-types-core/dist/utils';
import { Input, Output, Fallback } from './common';

export { MapOver, $MapOver, MapOverArray, MapOverTuple };

type MapOver<T extends Input<$T['constraints'][0]>, $T extends Type> =
    any[] extends T
    ? MapOverArray<T, $T>
    : MapOverTuple<T, $T> extends infer R extends Fallback<T, $T['type']> ? R : never

type MapOverArray<T extends Input, $T extends Type> =
    apply<$T, [T[0]]> extends infer R extends $T['type']
    ? T extends unknown[] ? R[] : readonly R[]
    : never

type MapOverTuple<T extends Input, $T extends Type> =
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
    R extends readonly unknown[] = [],
    L extends number = Required<T>['length']
> = I extends L ? R
    : RecursiveOptional<T, $T, Next<I>, (IsOptional<T, I> extends true ? [apply<$T, [Exclude<T[I], undefined>, I]>?] : [apply<$T, [T[I], I]>]) extends infer Current extends readonly unknown[] ? T extends unknown[] ? [...R, ...Current] : readonly [...R, ...Current] : never, L>

type Recursive<
    T extends readonly unknown[],
    $T extends Type,
    I extends number = 0,
    R extends readonly unknown[] = [],
    L extends number = T['length']
> = I extends L ? R
    : Recursive<T, $T, Next<I>, apply<$T, [T[I], I]> extends infer Current ? T extends unknown[] ? [...R, Current] : readonly [...R, Current] : never, L>

interface $MapOver<$T extends Type<1|2>, L extends number = never> extends Type<
    [[L] extends [never] ? Input<$T['constraints'][0]> : Tuple<L>]
> {
    type: this[0] extends this['constraints'][0]
        ? MapOver<this[0], $T>
        : Output<$T['type']>
}