import { A, _apply, B, Type, _Type } from "free-types-core"

export interface $Flip<$T extends _Type<[unknown, unknown]>> extends Type<2> {
    type: _apply<$T, [this[B], this[A]]>
    constraints: [$T['constraints'][B], $T['constraints'][A]]
}