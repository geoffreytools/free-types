import { Type, A, B } from 'core';
import { $OptionalFlip } from 'adapters/$Optional';
import { Compare } from './Compare';

export type $Lte<T extends number = never> = $OptionalFlip<$Lte2, [T]>;

interface $Lte2 extends Type<[number, number]> {
    type: Compare<A<this>, B<this>, true>
}