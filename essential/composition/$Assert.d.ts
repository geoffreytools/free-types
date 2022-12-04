import { A, B, IsUnknown, Type } from "free-types-core";
import { $Optional } from "../adapters/$Optional";
export declare type $Assert<T = never> = $Optional<$Assert2, [T]>;
interface $Assert2 extends Type<2> {
    type: IsUnknown<this[B]> extends true ? this[A] : this[B] extends this[A] ? this[B] : never;
}
export {};
