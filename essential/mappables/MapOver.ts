import { Type, apply } from 'free-types-core/';
import { Tuple as CreateTuple } from 'free-types-core/utils';
import { $Constrain } from '../adapters/$Constrain';
import { Mappable, Obj } from './common';
import { IterativeObjMap, IterativeTupleMap } from './IterativeMap';
import { RecursiveTupleMap } from './RecursiveTupleMap';

export { MapOver, $MapOver }

type Tuple = [] | [unknown, ...unknown[]]
type IsOpenTuple<T extends Tuple> = number extends T['length'] ? true : false

type MapOver<T extends Mappable<$T['constraints'][0]>, $T extends Type<1|2>> =
    T extends unknown[] ? MapArray<T, $T>
    : T extends Obj ? IterativeObjMap<T, $T>
    : T

type MapArray<T extends unknown[], $T extends Type> =
    T extends Tuple
    ? IsOpenTuple<T> extends true
        ? IterativeTupleMap<T, $T>
        : RecursiveTupleMap<T, $T>
    : apply<$T, [T[0]]>[]

interface _$MapOver<$T extends Type<1|2>> extends Type {
    type: this[0] extends this['constraints'][0]
        ? MapOver<this[0], $T>
        : Mappable<$T['type']>
    constraints: [Mappable<$T['constraints'][0]>]
}

type $MapOver<$T extends Type<1|2>, L extends number = never> =
    [L] extends [never] ? _$MapOver<$T>
    : $Constrain<_$MapOver<$T>, [CreateTuple<L>]>
