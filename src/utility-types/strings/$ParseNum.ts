import { Type } from 'core';

export { ParseNat, $ParseNum };

interface $ParseNum extends Type<[string]> { type: ParseNat<this[0]> }

type ParseNat<T> = T extends `${infer N extends number}` ? N : number