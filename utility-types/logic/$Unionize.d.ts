import { $Optional } from '../../essential/adapters/$Optional';
import { Type } from 'free-types-core';
export declare type $Unionize<T = never> = $Optional<$Unionize2, [T]>;
interface $Unionize2 extends Type<2> {
    type: this[0] | this[1];
}
export {};
