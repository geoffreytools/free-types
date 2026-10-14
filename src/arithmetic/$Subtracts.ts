import { Type, A, B } from 'core';
import { Subtract } from 'utils';
import { $OptionalFlip } from 'adapters/$Optional';

export { Subtract, $Subtract }

type $Subtract<T extends number = never> =
    $OptionalFlip<$Subtract2, [T]>;

interface $Subtract2 extends Type<[number, number]> {
    type: Subtract<A<this>, B<this>>
}
