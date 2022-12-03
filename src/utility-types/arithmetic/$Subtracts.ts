import { Type, A, B } from 'free-types-core';
import { Subtract } from 'free-types-core/dist/utils';
import { $OptionalFlip } from '../../essential/adapters/$Optional';

export { Subtract, $Subtract }

type $Subtract<T extends number = never> =
    $OptionalFlip<$Subtract2, [T]>;

interface $Subtract2 extends Type<[number, number]> {
    type: Subtract<A<this>, B<this>>
}
