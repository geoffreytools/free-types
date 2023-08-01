import { Type, At, apply } from "free-types-core"
import { $Not } from "../../utility-types/logic/$Not";
import { Mappable } from "./common"
import { Filter as FilterTuple, FilterOut as FilterOutTuple } from "../Tuple"

export { Filter, FilterOut, $Filter, $FilterOut };

interface $Extends<F> extends Type<1> {
    type: [this[0]] extends [F] ? true : false
}

interface $NotExtends<F> extends Type<1> {
    type: [this[0]] extends [F] ? false : true
}

type Filter<T extends Mappable, F> = T extends readonly any[]
    ? FilterTuple<T, F>
    : FilterObj<T, [F] extends [Type] ? F : $Extends<F>>

type FilterObj<T, $F extends Type> = {
    [K in keyof T as apply<$F, [T[K]]> extends true ? K : never]: T[K]
}

interface $Filter<F> extends Type<[Mappable]> {
    type: At<0, this> extends this['constraints'][0]
        ? Filter<At<0, this>, F>
        : Mappable<this['constraints'][0]>
}

type FilterOut<T extends Mappable, F> =
    T extends readonly any[]
    ? FilterOutTuple<T, F>
    : Filter<T, F extends Type<1> ? $Not<F> : $NotExtends<F>>

interface $FilterOut<F> extends Type<[Mappable]> {
    type: At<0, this> extends this['constraints'][0]
        ? FilterOut<At<0, this>, F>
        : Mappable<this['constraints'][0]>
}