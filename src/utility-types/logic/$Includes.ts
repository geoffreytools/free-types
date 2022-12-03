import { Type } from "free-types-core";
import { Extends } from "free-types-core/dist/utils";
import { $OptionalFlip } from "../../essential/adapters/$Optional";

export type $Includes<T = never> = $OptionalFlip<$Includes2, [T]>;

interface $Includes2 extends Type<2> { type: Extends<this[1], this[0]> }

