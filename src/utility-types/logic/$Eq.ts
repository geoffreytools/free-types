import { Type } from 'core';
import { Eq } from 'utils';
import { $OptionalFlip } from 'adapters/$Optional';

export { Eq, $Eq };

type $Eq<T = never> = $OptionalFlip<$Eq2, [T]>;

interface $Eq2 extends Type<2> { type: Eq<this[0], this[1]> }