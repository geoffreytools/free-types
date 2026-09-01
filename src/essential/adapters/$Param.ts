import { apply, Type } from 'core';

export interface $Param<I extends number, $T extends Type<1>> extends Type {
    type: apply<$T, [this[I]]>
}