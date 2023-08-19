import { Type, Next, apply } from "free-types-core"
import { IsTruthy } from "../../utility-types/logic/Refinement";
import { GetOrElse } from "../utils";
import { Input, Output, Fallback } from "./common";
export { Filter, $Filter, FilterOut, $FilterOut }

type Refined<F> = [F] extends [Type] ? F['type'] : F ;

interface $Filter<F extends Model, Model = F> extends Type<[Input]> {
    type: this[0] extends Input
        ? Filter<this[0], F, Model>
        : Output<Refined<Model>>
}

type Filter<T extends readonly unknown[], F, Model = F> = (
    [F] extends [Type]
    ? FilterRefinement<T, F>
    : FilterValue<T, F>
) extends infer R extends Fallback<T, Refined<Model>> ? R : never

type FilterRefinement<
    T extends readonly unknown[],
    $F extends Type,
    Readonly = T extends unknown[] ? false : true,
    I extends number = 0,
    R extends readonly unknown[] = [],
    P = apply<$F, [T[I]]>
> = I extends T['length'] ? R
    : FilterRefinement<T, $F, Readonly, Next<I>, IsTruthy<P> extends true ? Readonly extends true ? readonly [...R, T[I]] : [...R, T[I]] : R>

type FilterValue<
    T extends readonly unknown[],
    $F,
    Readonly = T extends unknown[] ? false : true,
    I extends number = 0,
    R extends readonly unknown[] = [],
> = I extends T['length'] ? R
    : FilterValue<T, $F, Readonly, Next<I>, [T[I]] extends [$F] ? Readonly extends true ? readonly [...R, T[I]] : [...R, T[I]] : R>

interface $FilterOut<F, Remaining = unknown> extends Type<[Input]> {
    type: this[0] extends Input
        ? GetOrElse<FilterOut<this[0], F>, Output<Remaining>>
        : Output<Remaining>
}

type FilterOut<T extends readonly unknown[], F> =
    [F] extends [Type] ? FilterOutPredicate<T, F> : FilterOutValue<T, F>

type FilterOutPredicate<
    T extends readonly unknown[],
    $F extends Type,
    I extends number = 0,
    R extends unknown[] = [],
    P = apply<$F, [T[I]]>
> = I extends T['length'] ? R
    : FilterOutPredicate<T, $F, Next<I>, IsTruthy<P> extends false ? [...R, T[I]] : R>

type FilterOutValue<
    T extends readonly unknown[],
    F,
    I extends number = 0,
    R extends unknown[] = [],
> = I extends T['length'] ? R
    : FilterOutValue<T, F, Next<I>, [T[I]] extends [F] ? R : [...R, T[I]]>