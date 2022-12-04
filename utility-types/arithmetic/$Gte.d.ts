import { Type, A, B } from 'free-types-core';
import { $OptionalFlip } from '../../essential/adapters/$Optional';
import { Compare } from './Compare';
export declare type $Gte<T extends number = never> = $OptionalFlip<$Gte2, [T]>;
interface $Gte2 extends Type<[number, number]> {
    type: Compare<B<this>, A<this>, true>;
}
export {};
