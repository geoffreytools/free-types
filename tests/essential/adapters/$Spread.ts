import { Type, apply, A, B } from 'free-types-core';
import { test } from 'ts-spec';
import { $Spread } from '../../../dist/essential/adapters/$Spread';

interface $StrNumPair extends Type<[string, number]> {
    type: [A<this>, B<this>]
}

test('$Spread turns Type<N> to Type<[{length: N}]>' as const, t =>[
    t.equal<apply<$Spread<$StrNumPair>, [['a', 1]]>, ['a', 1]>(),
    t.equal<$Spread<$StrNumPair>['constraints'], [[string, number]]>(),
    t.equal<$Spread<$StrNumPair>['type'], $StrNumPair['type']>()
])