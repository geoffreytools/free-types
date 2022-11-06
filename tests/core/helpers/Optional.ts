import { test } from 'ts-spec'
import { Type, Checked, Optional, apply } from '../../..';

type AlphaNumPair<A extends string, B extends number> = [A, B];

{interface $AlphaNumPair extends Type {
    // @ts-expect-error: Optional checks position
    type: AlphaNumPair<Checked<0, this>, Optional<2, this>>
    constraints: [string, number?]
}}

{interface $AlphaNumPair extends Type {
    // @ts-expect-error: Optional checks constraint
    type: AlphaNumPair<Checked<0, this>, Optional<1, this>>
    constraints: [string, string?]  // should be [string, number]
}}

interface $AlphaNumPair extends Type {
    // Optional defuses constraint
    type: AlphaNumPair<Checked<0,this>, Optional<1,this>>
    constraints: [string, number?]
}

test('Optional apply' as const, t => [
    t.equal<apply<$AlphaNumPair, ['a', 1]>, ['a', 1]>(),
    t.equal<apply<$AlphaNumPair, ['a']>, ['a', number]>(),
])

// @ts-expect-error: Optional arg 1 is type checked
type WrongArg1 = apply<$AlphaNumPair, [0, 1]>

// @ts-expect-error: Optional arg 2 is type checked
type WrongArg2 = apply<$AlphaNumPair, ['a', 'b']>
