import { Type, apply } from 'free-types-core/dist/';
import { Tuple as CreateTuple } from 'free-types-core/dist/utils';
import { $Constrain } from '../adapters/$Constrain';
import { Mappable, Obj } from './common';
import { MapOver as MapOverTuple } from '../Tuple/MapOver'
import { PreserveReadonly } from '../Tuple/common'

export { MapOver, $MapOver }

type Tuple = readonly [] | readonly [unknown, ...(readonly unknown[])]

type MapOver<T extends Mappable<$T['constraints'][0]>, $T extends Type<1|2>> =
    T extends readonly unknown[]
    ? T extends Tuple
        ? MapOverTuple<T, $T>
        : PreserveReadonly<T, apply<$T, [T[0]]>[]>
    : T extends Obj ? {
        [K in keyof T]: apply<$T, [T[K], K]>
    }
    : T

interface _$MapOver<$T extends Type<1|2>> extends Type {
    type: this[0] extends this['constraints'][0]
        ? MapOver<this[0], $T>
        : Mappable<$T['type']>
    constraints: [Mappable<$T['constraints'][0]>]
}

type $MapOver<$T extends Type<1|2>, L extends number = never> =
    [L] extends [never] ? _$MapOver<$T>
    : $Constrain<_$MapOver<$T>, [CreateTuple<L>]>
