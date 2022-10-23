import { A, apply, Checked, Type } from "free-types-core";

export interface $Spread<$T extends Type> extends Type<[$T['constraints']]> {
    type: apply<$T, Checked<A, this>>
}
