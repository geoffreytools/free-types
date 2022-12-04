import { Type, A, B } from 'free-types-core';
import { Prev } from 'free-types-core/dist/utils';
import { $Optional } from '../../essential/adapters/$Optional';
import { Add, And, IsNatural } from '../../essential/utils';
export { Multiply, $Multiply };
declare type $Multiply<T extends number = never> = $Optional<$Multiply2, [T]>;
interface $Multiply2 extends Type<[number, number]> {
    type: Multiply<A<this>, B<this>>;
}
declare type Multiply<N extends number, I extends number> = And<IsNatural<N>, IsNatural<I>> extends true ? _Multiply<N, I> : number;
declare type _Multiply<N extends number, I extends number, R extends number = 0> = I extends 0 ? R : _Multiply<N, Prev<I>, Add<N, R>>;
