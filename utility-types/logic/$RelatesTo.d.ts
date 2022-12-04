import { Type } from "free-types-core";
import { $Optional } from "../../essential/adapters/$Optional";
export { RelatesTo, $RelatesTo };
declare type $RelatesTo<T = never> = $Optional<$RelatesTo2, [T]>;
interface $RelatesTo2 extends Type<2> {
    type: RelatesTo<this[0], this[1]>;
}
declare type RelatesTo<T, U> = T extends U ? true : U extends T ? true : false;
