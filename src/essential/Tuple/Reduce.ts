import { Type, apply } from 'free-types-core/dist/';
import { Next } from 'free-types-core/dist/utils';
import { NonEmptyTuple } from './common';

export { Reduce, $Reduce }

type Reduce<
    T extends NonEmptyTuple<$T['constraints'][0] & $T['constraints'][1]>,
    $T extends Type<2>,
> =  _Reduce<T, $T>

type _Reduce<
    T extends ReadonlyArray<unknown>,
    $T extends Type<2>,
    Acc = T[0],
    I extends number = 1
> =  T['length'] extends 0 ? never
    : I extends T['length'] ? Acc
    : _Reduce<T, $T, apply<$T, [Acc, T[I]]>, Next<I>>

interface $Reduce<$T extends Type<2>> extends Type {
    type: this[0] extends this['constraints'][0]
        ? _Reduce<this[0], $T> extends infer R  
            ? R extends $T['type'] ? R : $T['type']
            : never
        : $T['type']
    constraints: [NonEmptyTuple<$T['constraints'][0] & $T['constraints'][1]>]
}