import { Type } from 'core';
import { $Optional } from 'adapters/$Optional';

export { RelatesTo, $RelatesTo }

type $RelatesTo<T = never> = $Optional<$RelatesTo2, [T]>;

interface $RelatesTo2 extends Type<2> { type: RelatesTo<this[0], this[1]> }

type RelatesTo<T, U> =
    T extends U ? true : U extends T ? true : false