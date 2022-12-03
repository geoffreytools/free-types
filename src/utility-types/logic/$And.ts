import { Type } from "free-types-core";
import { $Optional } from "../../essential/adapters/$Optional";
import { And } from "../../essential/utils";

export { And, $And }

type $And<T = never> = $Optional<$And2, [T]>;

interface $And2 extends Type<2> { type: And<this[0], this[1]> }
