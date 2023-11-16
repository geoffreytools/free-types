import { _apply, _Type } from "free-types-core"
import { ArrayKeys } from "free-types-core/dist/utils"

export type IterativeTupleMap<T, $T extends _Type> = {
    [I in keyof T]: I extends ArrayKeys ? T[I] : _apply<$T, [T[I], I]>
}

export type IterativeObjMap<T, $T extends _Type> = {
    [K in keyof T]: _apply<$T, [T[K], K]>
}
