import { Type, Next, apply } from "free-types-core"
import { PreserveReadonly, Tuple } from "./common";
export { Filter, $Filter, FilterOut, $FilterOut }

interface $Filter<F> extends Type<[Tuple]> {
    type: this[0] extends this['constraints'][0]
        ? Filter<this[0], F>
        : this['constraints'][0]
}

type Filter<T extends readonly unknown[], F> =
    [F] extends [Type] ? FilterPredicate<T, F> : FilterValue<T, F>

type FilterPredicate<
    T extends readonly unknown[],
    $F extends Type,
    I extends number = 0,
    R extends unknown[] = [],
    P = apply<$F, [T[I]]>
> = I extends T['length'] ? R
    : FilterPredicate<T, $F, Next<I>, P extends true ? [...R, T[I]] : R>

type FilterValue<
    T extends readonly unknown[],
    F,
    I extends number = 0,
    R extends unknown[] = [],
> = I extends T['length'] ? PreserveReadonly<T, R>
    : FilterValue<T, F, Next<I>, [T[I]] extends [F] ? [...R, T[I]] : R>

interface $FilterOut<F> extends Type<[Tuple]> {
    type: this[0] extends this['constraints'][0]
        ? FilterOut<this[0], F>
        : this['constraints'][0]
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
    : FilterOutPredicate<T, $F, Next<I>, P extends false ? [...R, T[I]] : R>

type FilterOutValue<
    T extends readonly unknown[],
    F,
    I extends number = 0,
    R extends unknown[] = [],
> = I extends T['length'] ? PreserveReadonly<T, R>
    : FilterOutValue<T, F, Next<I>, [T[I]] extends [F] ? R : [...R, T[I]]>