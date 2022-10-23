import { apply, Type } from "free-types-core"
import { Next } from "free-types-core/utils"

export type RecursiveTupleMap<T extends unknown[], $T extends Type, I extends number = 0, R extends unknown[] = []> =
    I extends T['length'] ? R
    : RecursiveTupleMap<T, $T, Next<I>, [...R, apply<$T, [T[I], I]>]>
