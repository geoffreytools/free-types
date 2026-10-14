import { Type } from 'core';
import { $Optional } from 'adapters/$Optional';
import { Or } from 'utils';

export type $Or<T = never> = $Optional<$Or2, [T]>;

interface $Or2 extends Type<2> { type: Or<this[0], this[1]> }