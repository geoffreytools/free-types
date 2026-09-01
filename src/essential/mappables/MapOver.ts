import { Type, apply, Checked, Expect, Applied } from 'core';
import { Tuple as CreateTuple } from 'utils';
import { $Constrain } from 'adapters/$Constrain';
import { Mappable, Obj } from './common';
import { MapOverTuple, MapOverArray } from 'essential/Tuple/MapOver'
import { Tuple } from 'essential/Tuple/common'

export { MapOver, $MapOver, $Transform }

type $Transform<T = any> = Type<{ Value: [0, T], Index: [1, PropertyKey] }>
type $ExpectTransform = Expect<$Transform>;

type MapOver<T extends Mappable<$T['constraints'][0]>, $T extends $ExpectTransform> =
    any[] extends T ? MapOverArray<Extract<T, readonly any[]>, $T>
    : T extends Tuple ? MapOverTuple<T, $T>
    : T extends Obj ? { [K in keyof T]: apply<$T, [T[K], K]> }
    : T

interface _$MapOver<$T extends $ExpectTransform> extends Type {
    type: Applied<this> extends false
    ? Mappable<$T['type']>
        : MapOver<Checked<0, this>, $T> extends infer R
            extends Mappable<$T['type']> ? R
            : Mappable<$T['type']>
    constraints: [Mappable<$T['constraints'][0]>]
}

type $MapOver<$T extends $ExpectTransform, L extends number = never> =
    [L] extends [never] ? _$MapOver<$T>
    : $Constrain<_$MapOver<$T>, [CreateTuple<L>]>