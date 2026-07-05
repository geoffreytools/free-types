import { A, _apply, _Type, Type } from "free-types-core";
import { Mappable } from "free-types-core/dist/utils";

import { Object2Tuple } from "../mappables/Object2Tuple";

export interface $Values<$T extends _Type>
    extends Type<[Mappable<$T['constraints'][number]>]> {
        type: _apply<$T, GetArgs<this[A], $T>>
    }

type GetArgs<T, $T extends _Type> = (
    T extends unknown[] ? T
    : T extends { [k: PropertyKey]: unknown } ? Object2Tuple<T>
    : $T['constraints']
) extends infer R extends { [k: number]: unknown } ? R : $T['constraints']