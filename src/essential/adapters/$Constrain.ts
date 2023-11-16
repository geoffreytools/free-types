import { _apply, _Type, Type } from "free-types-core"
import { Intersect } from "../../utility-types/logic/$Intersect"

export interface $Constrain<$T extends _Type, Cs extends unknown[]>
    extends Type<Intersect<$T['constraints'], Cs>> {
        type: _apply<$T,
            this['arguments'] extends $T['constraints']
            ? this['arguments'] : this['constraints']
        >
    }