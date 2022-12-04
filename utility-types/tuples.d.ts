import { Type, Checked, A, B, Head, Tail, Last, Init } from '../core';
import { $OptionalFlip } from '../essential/adapters/$Optional';
export { $Head, $Tail, $Last, $Init, $Concat };
interface $Head extends Type<[[unknown, ...unknown[]]]> {
    type: Head<Checked<A, this>>;
}
interface $Tail extends Type<[[unknown, ...unknown[]]]> {
    type: Tail<Checked<A, this>>;
}
interface $Last extends Type<[unknown[]]> {
    type: Last<Checked<A, this>>;
}
interface $Init extends Type<[[unknown, ...unknown[]]]> {
    type: Init<Checked<A, this>>;
}
declare type $Concat<T = never> = $OptionalFlip<$Concat2, [T]>;
interface $Concat2 extends Type<2> {
    type: [unknown, unknown] extends this['arguments'] ? unknown[] : this[A] extends unknown[] ? this[B] extends unknown[] ? [...this[A], ...this[B]] : [...this[A], this[B]] : this[B] extends unknown[] ? [this[A], ...this[B]] : [this[A], this[B]];
}
