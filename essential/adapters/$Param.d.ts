import { apply, Type } from "free-types-core";
export interface $Param<I extends number, $T extends Type<1>> extends Type {
    type: apply<$T, [this['arguments'][I]]>;
}
