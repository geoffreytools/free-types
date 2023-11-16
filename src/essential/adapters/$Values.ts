import { A, _apply, _Type, Type } from "free-types-core";
import { Mappable } from "free-types-core/dist/utils";

import { Object2Tuple } from "../mappables/Object2Tuple";

export interface $Values<$T extends _Type>
    extends Type<[Mappable<$T['constraints'][number]>]> {
        type: _apply<$T,
            this[A] extends unknown[] 
            ? this[A]
            : this[A] extends {[k: PropertyKey]: unknown }
            ? Object2Tuple<this[A]>
            : $T['constraints']
        >
    }