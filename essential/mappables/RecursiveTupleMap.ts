import { apply, Type } from "free-types-core"
import { IsOptional, Next } from "free-types-core/utils"

export type RecursiveTupleMap<T extends unknown[], $T extends Type, I extends number = 0, R extends unknown[] = [], L extends number = Required<T>['length']> =
    I extends L ? R
    : RecursiveTupleMap<T, $T, Next<I>, IsOptional<T, I> extends true
    ? [...R, apply<$T, [Exclude<T[I], undefined>, I]>?]
    : [...R, apply<$T, [T[I], I]>]
    , L
    >