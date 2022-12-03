import { Type, A, B, apply } from 'free-types-core';
import { Tuple } from 'free-types-core/dist/utils'
import { test } from 'ts-spec';
import { $As } from '../../../dist/essential/adapters/$As';
import { $Constrain } from '../../../dist/essential/adapters/$Constrain';
import { Flow } from '../../../dist/essential/composition/Flow';
import { $Split } from '../../../dist/utility-types/strings/$Split';

interface $Tuple extends Type<[unknown, number]> {
    type: Tuple<B<this>, A<this>>
}

type $NonEmptyTuple = $As<$Tuple, [unknown, ...unknown[]]>;

test('control' as const, t =>[
    t.equal<$Tuple['type'], unknown[]>(),
    t.equal<apply<$Tuple, ['a', 2]>, ['a', 'a']>()
])

test('Change the return type without affecting the behaviour' as const, t =>[
    t.equal<$NonEmptyTuple['type'], [unknown, ...unknown[]]>(),
    t.equal<apply<$NonEmptyTuple, ['a', 2]>, ['a', 'a']>()
])

type $SplitDash = $As<
    $Constrain<$Split<'-'>, [`${string}-${string}`]>,
    [string, string, ...string[]]
>

test('Widen the return type if provided a R that is related to the return type' as const, t =>[
    t.equal<$SplitDash['type'], [string, string, ...string[]]>(),
    t.equal<apply<$NonEmptyTuple, ['a', 2]>, ['a', 'a']>()
])

/* use case */

interface $First extends Type<[[unknown, ...unknown[]]]> {
    type: A<this>[0]
}

// @ts-expect-error: unknown[] doesn't extend [unknown, ...unknown[]]
type $Rejected = Flow<[$Tuple, $First]>;

// $NonEmptyTuple can compose with $First
type $Accepted = Flow<[$NonEmptyTuple, $First]>;
