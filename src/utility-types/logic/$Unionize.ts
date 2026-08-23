import { $Optional } from 'adapters/$Optional';
import { Type } from 'core';

export type $Unionize<T = never> = $Optional<$Unionize2, [T]>;

interface $Unionize2 extends Type<2> { type: this[0] | this[1] }