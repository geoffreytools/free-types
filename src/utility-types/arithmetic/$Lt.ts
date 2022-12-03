import { Type, A, B } from 'free-types-core';
import { $OptionalFlip } from '../../essential/adapters/$Optional';
import { Compare } from './Compare';


export type $Lt<T extends number = never> = $OptionalFlip<$Lt2, [T]>;

interface $Lt2 extends Type<[number, number]> {
    type: Compare<A<this>, B<this>, false>
}