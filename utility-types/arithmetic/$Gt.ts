import { Type, A, B } from 'free-types-core';
import { $OptionalFlip } from '../../essential/adapters/$Optional';
import { Compare } from './Compare';


export type $Gt<T extends number = never> = $OptionalFlip<$Gt2, [T]>;

interface $Gt2 extends Type<[number, number]> {
    type: Compare<B<this>, A<this>, false>
}