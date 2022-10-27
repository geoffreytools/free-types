import { test } from 'ts-spec'
import { Type, Lossy, apply } from '../../..';

type AlphaNumPair<A extends string, B extends number> = [A, B];

{interface $AlphaNumPair extends Type<2> {
    // @ts-expect-error: Lossy checks position
    type: AlphaNumPair<Lossy<0, this>, Lossy<2, this>>
    constraints: [string, number]
}}

{interface $AlphaNumPair extends Type<2> {
    // @ts-expect-error: Lossy defuses constraint
    type: AlphaNumPair<Lossy<0, this>, Lossy<1, this>>
    constraints: [number, string]  // should be [string, number]
}}

interface $AlphaNumPair extends Type<[string, number]> {
    type: AlphaNumPair<Lossy<0, this>, Lossy<1,this>>
}

test('Lossy apply' as const, t =>
    t.equal<apply<$AlphaNumPair, ['a', 1]>, ['a', 1]>()
)

// @ts-expect-error: Lossy arg 1 is type checked
type WrongArg1 = apply<$AlphaNumPair, [0, 1]>

// @ts-expect-error: Lossy arg 2 is type checked
type WrongArg2 = apply<$AlphaNumPair, ['a', 'b']>
