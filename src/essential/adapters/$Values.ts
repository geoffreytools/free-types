import { A, apply, Type } from "free-types-core";
import { Key, Mappable } from "../mappables/common";
import { Object2Tuple } from "../mappables/Object2Tuple";

export interface $Values<$T extends Type>
    extends Type<[Mappable<$T['constraints'][number]>]> {
        type: apply<$T,
            this[A] extends unknown[] 
            ? this[A]
            : this[A] extends {[k: Key]: unknown }
            ? Object2Tuple<this[A]> & unknown[]
            : $T['constraints']
        >
    }