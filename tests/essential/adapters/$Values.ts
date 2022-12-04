import { Type, apply, A, B } from 'free-types-core';
import { test } from 'ts-spec';
import { $Values } from '../../../essential/adapters/$Values';
import { Mappable } from '../../../essential/mappables/common';
import { $Add } from '../../../utility-types/arithmetic/$Add';

interface $StrNumPair extends Type<[string, number]> {
    type: [A<this>, B<this>]
}

test('$Values behaves similarily as $Spread, only looser' as const, t =>[
    t.equal<apply<$Values<$StrNumPair>, [['a', 1]]>, ['a', 1]>(),
    t.equal<$Values<$StrNumPair>['constraints'], [Mappable<string | number>]>(),
    t.equal<$Values<$StrNumPair>['type'], $StrNumPair['type']>()
])

test('$Values make the adapted type accept objects (it should be commutative)' as const, t =>[
    t.equal<apply<$Values<$Add>, [{a: 1, b: 2}]>, 3>(),
])