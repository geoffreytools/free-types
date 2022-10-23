import { Type, A, B } from 'free-types-core';
import { Next, Subtract } from 'free-types-core/utils';
import { $OptionalFlip } from '../../essential/adapters/$Optional';
import { And, IsNatural } from '../../essential/utils';
import { Compare } from './Compare';

export { Divide, $Divide }

type $Divide<T extends number = never> = $OptionalFlip<$Divide2, [T]>;

interface $Divide2 extends Type<[number, number]> {
    type: Divide<A<this>, B<this>>
}

type Divide<N extends number, I extends number> =
    I extends 0 ? never
    : And<IsNatural<N>, IsNatural<I>> extends true ? _Divide<N, I> : number;

type _Divide<
    N extends number, I extends number, R extends number = 0
> = Compare<N, I, false> extends true ? R
    : _Divide<Subtract<N, I>, I, Next<R>>;
