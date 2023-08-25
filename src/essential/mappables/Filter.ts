import { Type, apply } from "free-types-core"
import { $Not } from "../../utility-types/logic/$Not";
import { Mappable } from "./common"
import { Filter as FilterTuple, FilterOut as FilterOutTuple } from "../Tuple/Filter"
import { GetOrElse } from "../utils";

export { Filter, FilterOut, $Filter, $FilterOut };

type Refined<F> = [F] extends [Type] ? F['type'] : F ;

interface $Extends<F> extends Type<1> {
    type: [this[0]] extends [F] ? true : false
}

interface $NotExtends<F> extends Type<1> {
    type: [this[0]] extends [F] ? false : true
}

type Filter<T extends Mappable, F, Model = F> = T extends readonly any[]
    ? FilterTuple<T, F, Model>
    : FilterObj<T, [F] extends [Type] ? F : $Extends<F>>

type FilterObj<T, $F extends Type> = {
    [K in keyof T as apply<$F, [T[K]]> extends true ? K : never]: T[K]
}

interface $Filter<F extends Model, Model = F> extends Type<[Mappable]> {
    type: this[0] extends readonly any[]
        ? GetOrElse<FilterTuple<this[0], F>, Mappable<Refined<Model>>>
        : this[0] extends Mappable
        ? GetOrElse<FilterObj<this[0], [F] extends [Type] ? F : $Extends<F>>, Mappable<Refined<Model>>>
        : Mappable<Refined<Model>>
}

type FilterOut<T extends Mappable, F> =
    T extends readonly any[]
    ? FilterOutTuple<T, F>
    : Filter<T, F extends Type<1> ? $Not<F> : $NotExtends<F>>

interface $FilterOut<F, Remaining = unknown> extends Type<[Mappable]> {
    type: this[0] extends Mappable
        ? FilterOut<this[0], F>
        : Mappable<Remaining>
}