import { test } from 'ts-spec'
import { apply, Type, Const, $Const } from 'free-types-core';
import { Ap } from '../../essential/mappables/Ap';
import { MapOver } from '../../essential/mappables/MapOver';

test('Const turns a concrete type into a free type' as const, t =>
    t.equal<apply<Const<5>>, 5>()
)

test('Lifted values ignore their arguments' as const, t => [
    t.equal<apply<Const<5>, [0]>, 5>(),
    t.equal<apply<Const<5>, [0, 1]>, 5>(),
    t.equal<apply<Const<5>, [0, 1, 2]>, 5>(),
])

test('Const<never>' as const, t => [
    t.not.never<Const<never>>(),
    t.never<apply<Const<never>, [1,2,3]>>()
])

test('Const<any>' as const, t => [
    t.not.any<Const<any>>(),
    t.any<apply<Const<any>, [1,2,3]>>()
])

// a generic can be lifted with no problem
type Generic<B> = MapOver<[1, 2, 3], Const<B>>

// a constrained generic can be lifted with no problem
type Constrained<B extends string> = MapOver<[1, 2, 3], Const<B>>

// Const types ignore type constraints on inputs
type Generic3<$T extends Type<[number]>> = MapOver<[1, 2, 3], $T>
type H = Generic3<Const<5>>

// @ts-expect-error: constraint on the return type still enforced
type W = MustReturnString<Const<5>>;
type MustReturnString<$T extends Type<1, string>> = $T;

test('$Const' as const, t =>
    t.equal<Ap<MapOver<[1,2,3], $Const>, [0, 0, 0]>, [1,2,3]>()
)