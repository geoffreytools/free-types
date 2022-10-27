import { test } from 'ts-spec'
import { Type, Checked, apply } from '../../..';

type AlphaNumPair<A extends string, B extends number> = [A, B];

{interface $AlphaNumPair extends Type<2> {
    // @ts-expect-error: Checked checks position
    type: AlphaNumPair<Checked<0, this>, Checked<2, this>>
    constraints: [string, number]
}}

{interface $AlphaNumPair extends Type<2> {
    // @ts-expect-error: Checked defuses constraint
    type: AlphaNumPair<Checked<0, this>, Checked<1, this>>
    constraints: [number, string]  // should be [string, number]
}}

interface $AlphaNumPair extends Type<2> {
    type: AlphaNumPair<Checked<0,this>, Checked<1,this>>
    constraints: [string, number]
}

test('Checked apply' as const, t =>
    t.equal<apply<$AlphaNumPair, ['a', 1]>, ['a', 1]>()
)

// @ts-expect-error: Checked arg 1 is type checked
type WrongArg1 = apply<$AlphaNumPair, [0, 1]>

// @ts-expect-error: Checked arg 2 is type checked
type WrongArg2 = apply<$AlphaNumPair, ['a', 'b']>
