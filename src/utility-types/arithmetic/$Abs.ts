import { Type, A } from 'core';
import { Natural } from 'utils';

export { Abs, $Abs }

interface $Abs extends Type<[number], number> { type: Abs<A<this>> }

type Abs<N extends number> =
    IsPositive<N> extends true
    ? N
    : `${N}` extends `-${infer A}`
    ? A extends keyof Natural ? Natural[A]
    : A extends `${number}` ? number : never
    : never

type IsPositive<N extends number> = 
    `${N}` extends `-${number}` ? false : true;