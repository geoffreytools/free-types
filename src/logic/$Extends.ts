import { Type } from 'core';
import { Extends } from 'utils';
import { $OptionalFlip } from 'adapters/$Optional';

export { Extends, $Extends };

type $Extends<T = never> = $OptionalFlip<$Extends2, [T]>;

interface $Extends2 extends Type<2> { type: Extends<this[0], this[1]> }
