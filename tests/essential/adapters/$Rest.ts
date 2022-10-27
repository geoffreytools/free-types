import { Type, apply, A, B } from 'free-types-core';
import { test } from 'ts-spec';
import { $Rest } from '../../../essential/adapters/$Rest';

interface $Wrapped extends Type<[[string, number]]> {
    type: [A<this>[A], A<this>[B]]
}

test('$Rest turns Type<[{length: N}]> to Type<N>' as const, t =>[
    t.equal<apply<$Rest<$Wrapped>, ['a', 1]>, ['a', 1]>(),
    t.equal<$Rest<$Wrapped>['constraints'], [string, number]>(),
    t.equal<$Rest<$Wrapped>['type'], $Wrapped['type']>(),
])