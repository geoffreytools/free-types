import { test } from 'ts-spec';
import { Type, apply } from 'free-types-core';
import { $Flip } from '../../../essential/adapters/$Flip';

interface $StrNumPair extends Type<[string, number]> {
    type: [this[0], this[1]]
}

type $NumStrPair = $Flip<$StrNumPair>;

test('$Flip' as const, t => [
    t.equal<apply<$NumStrPair, [1, 'a']>, ['a', 1]>()
])

// @ts-expect-error: type constraints are also flipped
type WrongOrder = apply<$NumStrPair, ['a', 1]>
