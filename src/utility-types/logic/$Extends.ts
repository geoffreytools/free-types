import { Type } from "free-types-core";
import { Extends } from "free-types-core/dist/utils";
import { $OptionalFlip } from "../../essential/adapters/$Optional";

export { Extends, $Extends };

type $Extends<T = never> = $OptionalFlip<$Extends2, [T]>;

interface $Extends2 extends Type<2> { type: Extends<this[0], this[1]> }
