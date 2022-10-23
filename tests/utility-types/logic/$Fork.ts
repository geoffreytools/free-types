import { $Fork, $Stitch, Showable } from './../../../utility-types';
import { apply, Const, partial } from 'free-types-core';
import { test } from 'ts-test';
import { $Reduce, $IsEmpty, Mappable, NonEmptyMappable } from '../../../essential/mappables';

type _$Join<S extends Showable> = $Reduce<partial<$Stitch, [S]>>

type $Join<S extends Showable> =
    $Fork<$IsEmpty, Const<''>, _$Join<S>>

test('$Join left branch' as const, t =>
    t.equal<apply<$Join<'-'>, [[]]>, ''>()
)

test('$Join right branch' as const, t =>
    t.equal<apply<$Join<'-'>, [[1, 2]]>, '1-2'>()
)

test('Default constraints are the union of the constraints of $P, $A and $B' as const, t =>
    t.equal<
        $Join<''>['constraints'],
        [Mappable<unknown> | NonEmptyMappable<Showable>]
    >()
)

type $TunedJoin<S extends Showable> =
    $Fork<$IsEmpty, Const<''>, _$Join<S>, [Showable[]]>

test('Default constraints can be overridden' as const, t =>
    t.equal<
        $TunedJoin<''>['constraints'],
        [Showable[]]
    >()
)

