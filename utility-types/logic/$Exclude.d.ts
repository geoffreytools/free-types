import { IsUnknown, Type } from "free-types-core";
import { $OptionalFlip } from "../../essential/adapters/$Optional";
export declare type $Exclude<T = never> = $OptionalFlip<$Exclude2, [T]>;
interface $Exclude2 extends Type<2> {
    type: IsUnknown<this[0]> extends true ? unknown : Exclude<this[0], this[1]>;
}
export {};
