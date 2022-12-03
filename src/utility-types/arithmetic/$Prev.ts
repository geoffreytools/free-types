import { Type, A } from "free-types-core";
import { Prev } from "free-types-core/dist/utils";

export { Prev, $Prev }

interface $Prev extends Type<[number]> { type: Prev<A<this>> }
