import { Type, apply, ToTuple } from "free-types-core"
import { IsTruthy } from "../../utility-types/logic/Refinement";
import { Extends } from "../utils";
import * as Tuple from "./common";
import { Reduce, $Reducer, WrapOptional } from './common';

export { Filter, $Filter, FilterOut, $FilterOut }

type Refined<F> = [F] extends [Type] ? F['type'] : F ;

type Filter<
    T extends Tuple.Input,
    F,
    Model = F,
    Fallback = Tuple.Fallback<T, Refined<Model>>
> = any[] extends T ? FilterArray<T, F, Model>
    : FilterTuple<T, F, true> extends infer R
        extends Fallback ? R : Fallback

type FilterOut<
    T extends Tuple.Input,
    F,
    Remaining = unknown,
    Fallback = Tuple.Fallback<T, Exclude<T[number], Refined<F>>>
> = any[] extends T ? FilterOutArray<T, F, Remaining>
    : Refined<F> extends undefined ? CleanupTuple<T, F, Fallback>
    : FilterTuple<T, F, false> extends infer R
        extends Fallback ? R : Fallback

type CleanupTuple<T extends Tuple.Input, F, Fallback> =
    FilterTuple<ToTuple<T>, F, false>  extends infer R
    extends Fallback ? R : Fallback

interface $Filter<F extends Model, Model = F> extends Type {
    constraints: [Tuple.Input]
    type: this[0] extends Tuple.Input
        ? Filter<this[0], F, Model>
        : Tuple.Output<Refined<Model>, never>
}

interface $FilterOut<F, Remaining = unknown> extends Type {
    constraints: [Tuple.Input]
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

type FilterTuple<T extends Tuple.Input, F, Choose> = (
    [F] extends [Type]
    ? undefined extends T[number] ? $PredicateOpt<F, Choose> : $Predicate<F, Choose>
    : undefined extends T[number] ? $RefinementOpt<F, Choose> : $Refinement<F, Choose>
) extends infer $T extends $Reducer ? Reduce<T, $T> : never

// Reducers

interface $Predicate<$F extends Type, Choose> extends $Reducer {
    type: IsTruthy<apply<$F, [this['T[I]']]>> extends Choose
        ? Tuple.Append<this['Acc'], this['T[I]']>
        : this['Acc']
}

interface $Refinement<F, Choose> extends $Reducer {
    type: Extends<this['T[I]'], F> extends Choose
        ? Tuple.Append<this['Acc'], this['T[I]']>
        : this['Acc']
}

interface $PredicateOpt<$F extends Type, Choose> extends $Reducer {
    type: IsTruthy<apply<$F, [Narrow<this['T[I]'], Choose>]>> extends Choose
        ? Tuple.Concat<this['Acc'], WrapOptional<this['T'], this['I']>>
        : this['Acc']
}

interface $RefinementOpt<F, Choose> extends $Reducer {
    type: Extends<this['T[I]'], F | Widen<Choose>> extends Choose
        ? Tuple.Concat<this['Acc'], WrapOptional<this['T'], this['I']>>
        : this['Acc']
}

type Widen<Choose> = Choose extends false ? undefined : never
type Narrow<T, Choose> = Exclude<T, Widen<Choose>>