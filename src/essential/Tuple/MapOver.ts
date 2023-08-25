import { Type, apply } from 'free-types-core';
import * as Tuple from './common';
import { Reduce, $Reducer, WrapOptional } from './common';

export { MapOver, $MapOver, MapOverArray, MapOverTuple };

type MapOver<T extends Tuple.Input<$T['constraints'][0]>, $T extends Type> =
    any[] extends T
    ? MapOverArray<T, $T>
    : MapOverTuple<T, $T> extends infer R
        extends Tuple.Fallback<T, $T['type']>
        ? R : never

type MapOverArray<T extends Tuple.Input, $T extends Type> =
    apply<$T, [T[0]]> extends infer R extends $T['type'] ? Tuple.Of<R, T> : never

type MapOverTuple<T extends Tuple.Input, $T extends Type> =
    number extends T['length'] ? {
        [I in keyof T]: I extends keyof [] ? T[I] : apply<$T, [T[I], I]>
    }
    : Reduce<T, undefined extends T[number] ? $Optional<$T> : $Standard<$T>>

interface $Standard<$T extends Type> extends $Reducer {
    type: Tuple.Append<this['Acc'], apply<$T, [this['T[I]']]>>

}
interface $Optional<$T extends Type> extends $Reducer {
    type: Tuple.Concat<this['Acc'], WrapOptional<this['T'], this['I'], apply<$T, [Exclude<this['T[I]'], undefined>]>>>
}

interface $MapOver<$T extends Type<1|2>, L extends number = never> extends Type<
    [[L] extends [never] ? Tuple.Input<$T['constraints'][0]> : Tuple.From<L>]
> {
    type: this[0] extends this['constraints'][0]
        ? MapOver<this[0], $T>
        : Tuple.Output<$T['type']>
}