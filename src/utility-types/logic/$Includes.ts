import { Type } from 'core';
import { Extends } from 'utils';
import { $OptionalFlip } from 'adapters/$Optional';

export type $Includes<T = never> = $OptionalFlip<$Includes2, [T]>;

interface $Includes2 extends Type<2> { type: Extends<this[1], this[0]> }

