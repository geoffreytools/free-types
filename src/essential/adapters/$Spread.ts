import { _apply, _Type, Type } from "free-types-core";

export interface $Spread<$T extends _Type> extends Type<[$T['constraints']]> {
    type: _apply<$T, Extract<this[0], unknown[]>>
}
