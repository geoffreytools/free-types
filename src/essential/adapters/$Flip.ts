import { A, apply, B, Type } from "free-types-core"

export interface $Flip<$T extends Type<2>> extends Type<2> {
    type: apply<$T, [this[B], this[A]]>
    constraints: [$T['constraints'][B], $T['constraints'][A]]
}
