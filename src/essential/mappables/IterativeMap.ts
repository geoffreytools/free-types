import { apply, Type } from "free-types-core"
import { ArrayKeys } from "free-types-core/dist/utils"

export type IterativeTupleMap<T, $T extends Type> = {
    [I in keyof T]: I extends ArrayKeys ? T[I] : apply<$T, [T[I], I]>
}

export type IterativeObjMap<T, $T extends Type> = {
    [K in keyof T]: apply<$T, [T[K], K]>
}
