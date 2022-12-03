import { Type } from "free-types-core";
import { Eq } from "free-types-core/dist/utils";
import { $OptionalFlip } from "../../essential/adapters/$Optional";

export { Eq, $Eq };

type $Eq<T = never> = $OptionalFlip<$Eq2, [T]>;

interface $Eq2 extends Type<2> { type: Eq<this[0], this[1]> }