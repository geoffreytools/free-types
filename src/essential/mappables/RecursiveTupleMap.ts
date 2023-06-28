import { apply, Type } from "free-types-core"
import { IsOptional, Next } from "free-types-core/dist/utils"

export type RecursiveTupleMap<T extends readonly unknown[], $T extends Type, I extends number = 0, R extends readonly unknown[] = [], L extends number = Required<T>['length']> =
    I extends L ? T extends unknown[] ? R : Readonly<R>
    : RecursiveTupleMap<T, $T, Next<I>, IsOptional<T, I> extends true
    ? [...R, apply<$T, [Exclude<T[I], undefined>, I]>?]
    : [...R, apply<$T, [T[I], I]>]
    , L
    >