import { Type, apply, Checked } from 'free-types-core/';
import { Tuple as CreateTuple } from 'free-types-core/dist/utils';
import { $Constrain } from '../adapters/$Constrain';
import { Mappable, Obj } from './common';
import { MapOverTuple, MapOverArray } from '../Tuple/MapOver'
import { Tuple } from '../Tuple/common'

export { MapOver, $MapOver }

type MapOver<T extends Mappable<$T['constraints'][0]>, $T extends Type<1|2>> =
    any[] extends T ? MapOverArray<Extract<T, readonly any[]>, $T>
    : T extends Tuple ? MapOverTuple<T, $T>
    : T extends Obj ? { [K in keyof T]: apply<$T, [T[K], K]> }
    : T

interface _$MapOver<$T extends Type<1|2>> extends Type {
    type: MapOver<Checked<0, this>, $T> extends infer R
        extends Mappable<$T['type']> ? R
        : Mappable<$T['type']>
    constraints: [Mappable<$T['constraints'][0]>]
}

type $MapOver<$T extends Type<1|2>, L extends number = never> =
    [L] extends [never] ? _$MapOver<$T>
    : $Constrain<_$MapOver<$T>, [CreateTuple<L>]>
