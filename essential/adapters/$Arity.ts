import { apply, Slice, Type } from "free-types-core";

export interface $Arity<N extends number, $T extends Type>
    extends Type<Slice<$T['constraints'], 0, N>>
        { type: apply<$T, this['arguments']> }
