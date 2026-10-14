import { Type, apply } from 'core'
import { $Not } from '../../logic/$Not';
import { Mappable } from './common'
import { Filter as FilterTuple, FilterOut as FilterOutTuple } from 'essential/Tuple/Filter'
import { GetOrElse } from 'utils';

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
    : PickFilterObj<T, F>

type PickFilterObj<T, F> =
    [F] extends [Type] ? FilterObj<T, Extract<F, Type>> : FilterObjRaw<T, F>

type FilterObj<T, $F extends Type> = {
    [K in keyof T as apply<$F, [T[K]]> extends true ? K : never]: T[K]
}

type FilterObjRaw<T, F> = {
    [K in keyof T as [T[K]] extends [F] ? K : never]: T[K]
}

type FilterOutObjRaw<T, F> = {
    [K in keyof T as [T[K]] extends [F] ? never : K]: T[K]
}

interface $Filter<F extends Model, Model = F> extends Type<[Mappable]> {
    type: this[0] extends infer T
        ? T extends readonly any[]
            ? GetOrElse<FilterTuple<T, F>, Mappable<Refined<Model>>>
            : T extends Mappable
            ? GetOrElse<PickFilterObj<T, F>, Mappable<Refined<Model>>>
            : Mappable<Refined<Model>>
        : never
}

type FilterOut<T extends Mappable, F> =
    T extends readonly any[]
    ? FilterOutTuple<T, F>
    : [F] extends [Type]
    ? Filter<T, F extends Type<1> ? $Not<Extract<F, Type<1>>> : $NotExtends<F>>
    : FilterOutObjRaw<T, F>

interface $FilterOut<F, Remaining = unknown> extends Type<[Mappable]> {
    type: this[0] extends infer T
        ? T extends Mappable ? FilterOut<T, F> : Mappable<Remaining>
        : never
}