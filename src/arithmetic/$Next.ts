import { Type, A } from 'core';
import { Next } from 'utils';

export { Next, $Next }

interface $Next extends Type<[number]> { type: Next<A<this>> }

