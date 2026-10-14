import { Type, A } from 'core';
import { Prev } from 'utils';

export { Prev, $Prev }

interface $Prev extends Type<[number]> { type: Prev<A<this>> }
