import { apply, Type } from "free-types-core"
import { Intersect } from "../../utility-types/logic/$Intersect"

export interface $Constrain<$T extends Type, Cs extends unknown[]>
    extends Type<Intersect<$T['constraints'], Cs>> {
        type: apply<$T,
            this['arguments'] extends $T['constraints']
            ? this['arguments'] : this['constraints']
        >
    }