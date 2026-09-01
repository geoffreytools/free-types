import { Type, _apply, _Type, Expect, Next } from 'core';
import * as Tuple from './common';
import { WrapOptional } from './common';

export { MapOver, $MapOver, MapOverArray, MapOverTuple };

type $Transform<T = any> = Type<{ Value: [0, T], Index: [1, PropertyKey] }>
type $ExpectTransform = Expect<$Transform>;

type MapOver<T extends Tuple.Input<$T['constraints'][0]>, $T extends $ExpectTransform> =
    any[] extends T
    ? MapOverArray<T, $T>
    : MapOverTuple<T, $T> extends infer R
        extends Tuple.Fallback<T, $T['type']>
        ? R : never

type MapOverArray<T extends Tuple.Input, $T extends _Type> =
    _apply<$T, [T[0], number]> extends infer R extends $T['type'] ? Tuple.Of<R, T> : never

type MapOverTuple<T extends Tuple.Input, $T extends _Type> =
    number extends T['length'] ? {
        [I in keyof T]: _apply<$T, [T[I], I]>
    }
    : undefined extends T[number] ? MapOverOptionalTuple<T, $T> : MapOverRequiredTuple<T, $T>

type MapOverRequiredTuple<
    T extends Tuple.Input,
    $T extends _Type,
    I extends number = 0,
    R extends Tuple.Input = Tuple.Empty<T>
> = I extends T['length'] ? R
    : MapOverRequiredTuple<T, $T, Next<I>, Tuple.Append<R, _apply<$T, [T[I]]>>>;

type MapOverOptionalTuple<
    T extends Tuple.Input,
    $T extends _Type,
    L = Required<T>['length'],
    I extends number = 0,
    R extends Tuple.Input = Tuple.Empty<T>
> = I extends L ? R
    : MapOverOptionalTuple<T, $T, L, Next<I>,
        Tuple.Concat<R, WrapOptional<T, I, _apply<$T, [Exclude<T[I], undefined>]>>>
    >;

interface $MapOver<$T extends $ExpectTransform, L extends number = never> extends Type<
    [[L] extends [never] ? Tuple.Input<$T['constraints'][0]> : Tuple.From<L>]
> {
    type: this[0] extends infer T
        ? T extends this['constraints'][0] & Tuple.Input<$T['constraints'][0]>
            ? MapOver<T, $T>
            : Tuple.Output<$T['type']>
        : never
}