import { Type } from "free-types-core";
import { $Optional } from "../../essential/adapters/$Optional";
import { Or } from "../../essential/utils";

export type $Or<T = never> = $Optional<$Or2, [T]>;

interface $Or2 extends Type<2> { type: Or<this[0], this[1]> }