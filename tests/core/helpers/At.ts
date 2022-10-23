import { test } from 'ts-test'
import { Type, At, apply } from '../../..';

type AlphaNumPair<A extends string, B extends number> = [A, B];

{interface $Pair extends Type<2> {
    // @ts-expect-error: At checks position
    type: [At<0, this>, At<2, this>]
}}

interface $AlphaNumPair extends Type<2> {
    type: At<0, this> extends this['constraints'][0]
        ? At<1, this> extends this['constraints'][1]
            ? AlphaNumPair<At<0, this>, At<1, this>>
            : never
        : never
    constraints: [string, number]
}

test('At apply' as const, t =>
    t.equal<apply<$AlphaNumPair, ['a', 1]>, ['a', 1]>()
)


// @ts-expect-error: At arg 1 is type checked
type WrongArg1 = apply<$AlphaNumPair, [0, 1]>

// @ts-expect-error: At arg 2 is type checked
type WrongArg2 = apply<$AlphaNumPair, ['a', 'b']>
