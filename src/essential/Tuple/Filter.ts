import { Type, apply } from "free-types-core"
import { IsTruthy } from "../../utility-types/logic/Refinement";
import { Extends } from "../utils";
import * as Tuple from "./common";
import { Fold, $Reducer, WrapOptional } from './common';

export { Filter, $Filter, FilterOut, $FilterOut }

type Refined<F> = [F] extends [Type] ? F['type'] : F ;

type Filter<
    T extends Tuple.Input,
    Refinement,
    Model = Refinement,
    Fallback = Tuple.Fallback<T, Refined<Model>>
> = any[] extends T ? FilterArray<T, Refinement, Model>
    : FilterTuple<T, Refinement, true> extends infer R
        extends Fallback ? R : Fallback

type FilterOut<
    T extends Tuple.Input,
    Refinement,
    Remaining = unknown,
    Fallback = Tuple.Fallback<T, Exclude<T[number], Refined<Refinement>>>
> = any[] extends T
    ? FilterOutArray<T, Refinement, Remaining>
    : (
        Refined<Refinement> extends undefined
        ? FilterTuple<Tuple.ExcludeOptional<T>, Refinement, false>
        : FilterTuple<T, Refinement, false>
    ) extends infer R extends Fallback ? R : Fallback

interface $Filter<F extends Model, Model = F> extends Type<[Tuple.Input]> {
    type: this[0] extends Tuple.Input
        ? Filter<this[0], F, Model>
        : Tuple.Output<Refined<Model>, never>
}

interface $FilterOut<F, Remaining = unknown> extends Type<[Tuple.Input]> {
    type: this[0] extends Tuple.Input
        ? FilterOut<this[0], F, Remaining>
        : Tuple.Output<Remaining, never>
}

type FilterArray<T extends Tuple.Input, F, Model> =
    ([F] extends [Type] ? apply<F, [T[number]]> : F) extends infer E
    ? Tuple.Fallback<Tuple.Fallback<T, Extract<T[number], E>>, Refined<Model>>
    : never;

type FilterOutArray<T extends Tuple.Input, F, Remaining> =
    ([F] extends [Type] ? F['type'] : F) extends infer E
    ? Tuple.Fallback<T, Extract<Exclude<T[number], E>, Remaining>>
    : never;

type FilterTuple<T extends Tuple.Input, F, Include> = (
    [F] extends [Type]
    ? undefined extends T[number] ? $PredicateOpt<F, Include> : $Predicate<F, Include>
    : undefined extends T[number] ? $RefinementOpt<F, Include> : $Refinement<F, Include>
) extends infer $T extends $Reducer ? Fold<T, Tuple.Empty<T>, $T> : never

interface $Predicate<$F extends Type, Include> extends $Reducer {
    type: IsTruthy<apply<$F, [this['Val']]>> extends Include
        ? Tuple.Append<this['Acc'], this['Val']>
        : this['Acc']
}

interface $Refinement<F, Include> extends $Reducer {
    type: Extends<this['Val'], F> extends Include
        ? Tuple.Append<this['Acc'], this['Val']>
        : this['Acc']
}

interface $PredicateOpt<$F extends Type, Include> extends $Reducer {
    type: IsTruthy<apply<$F, [Narrow<this['Val'], Include>]>> extends Include
        ? Tuple.Concat<this['Acc'], WrapOptional<this['Src'], this['I']>>
        : this['Acc']
}

interface $RefinementOpt<F, Include> extends $Reducer {
    type: Extends<this['Val'], F | Widen<Include>> extends Include
        ? Tuple.Concat<this['Acc'], WrapOptional<this['Src'], this['I']>>
        : this['Acc']
}

type Widen<Include> = Include extends false ? undefined : never
type Narrow<T, Include> = Exclude<T, Widen<Include>>