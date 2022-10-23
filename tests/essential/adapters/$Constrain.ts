import { Type, A, B, apply } from 'free-types-core';
import { Tuple } from 'free-types-core/utils'
import { test } from 'ts-test';
import { $Constrain } from '../../../essential/adapters/$Constrain';
import { Flow } from '../../../essential/composition/Flow';

interface $Tuple extends Type<[unknown, number]> {
    type: Tuple<B<this>, A<this>>
}

type $Str2Or3Tuple = $Constrain<$Tuple, [string, 2|3]>;

test('control' as const, t =>[
    t.equal<$Tuple['type'], unknown[]>(),
    t.equal<apply<$Tuple, ['a', 2]>, ['a', 'a']>()
])

test('$Constrain changes the constraints and return type without affecting the behaviour' as const, t =>[
    t.equal<$Str2Or3Tuple['constraints'], [string, 2|3]>(),
    t.equal<
        $Str2Or3Tuple['type'],
        [string, string] | [string, string, string]
    >(),
    t.equal<apply<$Str2Or3Tuple, ['a', 2]>, ['a', 'a']>()
])

/* use case */

interface $First extends Type<[[unknown, ...unknown[]]]> {
    type: A<this>[0]
}

// @ts-expect-error: unknown[] doesn't extend [unknown, ...unknown[]]
type $Rejected = Flow<[$Tuple, $First]>;

// $StrNonEmptyTuple can compose with $First
type $Accepted = Flow<[$Str2Or3Tuple, $First]>;
