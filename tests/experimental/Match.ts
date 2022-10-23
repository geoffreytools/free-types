import { test } from 'ts-test';

import { Type, A, B, free, apply, $Not } from '../..'
import { $IsEmpty } from '../../essential/mappables/IsEmpty';
import { $Match, Match, otherwise, Protect } from '../../experimental/Match';

interface $R1 extends Type<[1]> { type: '1' }
interface $R2 extends Type<[2]> { type: '2' }
interface $R3 extends Type<[3]> { type: '3' }


interface $R12 extends Type<[1, 2]> { type: `${A<this>}:${B<this>}` }
interface $R34 extends Type<[3, 4]> { type: `${A<this>}:${B<this>}` }
interface $R56 extends Type<[5, 6]> { type: `${A<this>}:${B<this>}` }

interface $W12 extends Type<[{ a: 1, b: 2}]> { type: `${A<this>['a']}:${A<this>['b']}` }
interface $W34 extends Type<[{ a: 3, b: 4}]> { type: `${A<this>['a']}:${A<this>['b']}` }
interface $W56 extends Type<[{ a: 5, b: 6}]> { type: `${A<this>['a']}:${A<this>['b']}` }


type BasicMatch<A> = Match<A, [
    [1, '1'],
    [2, '2'],
    [3, '3']
], never>

test('handle never' as const, t =>
    t.equal<Match<never, [[1, '1'], [otherwise, 'never']]>, 'never'>()
)

test('Match a single type with values' as const, t => [
    t.equal<BasicMatch<1>, '1'>(),
    t.equal<BasicMatch<2>, '2'>(),
    t.equal<BasicMatch<3>, '3'>(),
])

type SingleMatch<A> = Match<A, [
    [1, $R1],
    [2, $R2],
    [3, $R3],
], never>

test('Match a single type with free types' as const, t => [
    t.equal<SingleMatch<1>, '1'>(),
    t.equal<SingleMatch<2>, '2'>(),
    t.equal<SingleMatch<3>, '3'>(),
])

type RawValue<A> = Match<A, [
    [1, $R1],
    [2, 5],
    [3, $R3],
], never>

test('Accept raw values' as const, t =>
    t.equal<RawValue<2>, 5>()
)

type GenericValue<A, V> = Match<A, [
    [1, $R1],
    [2, V],
    [3, $R3],
], never>

test('Accept generic values' as const, t =>
    t.equal<GenericValue<2, 5>, 5>()
)

// @ts-expect-error: incompatible pair [2, $R1]
type WrongSingleMatch<A> = Match<A, [
    [1, $R1],
    [2, $R1],
    [3, $R3]
]>

type TupleFreeMatch<A, B> = Match<[A, B],[
    [[1, 2],  $R12],
    [[3, 4],  $R34],
    [[5, 6],  $R56],
], never>

test('Match a tuple with free types' as const, t => [
    t.equal<TupleFreeMatch<1, 2>, '1:2'>(),
    t.equal<TupleFreeMatch<3, 4>, '3:4'>(),
    t.equal<TupleFreeMatch<5, 6>, '5:6'>(),
])

type TupleValuesMatch<A, B> = Match<[A, B],[
    [[1, 2],  '1:2'],
    [[3, 4],  '3:4'],
    [[5, 6],  '5:6'],
], never>

test('Match a tuple with raw values' as const, t => [
    t.equal<TupleValuesMatch<1, 2>, '1:2'>(),
    t.equal<TupleValuesMatch<3, 4>, '3:4'>(),
    t.equal<TupleValuesMatch<5, 6>, '5:6'>(),
])

// @ts-expect-error: incompatible pair [[2, 2],  $R11]
type WrongTupleMatch<A, B> = Match<[A, B],[
    [[1, 2],  $R12],
    [[3, 4],  $R12],
    [[5, 6],  $R56]
], never>

type Free<T> = Match<T, [
    [free.Map, free.Tuple],
    [free.Set, free.Id]
], never>

type Answer = Match<{a: 1}, [
    [$IsEmpty, 'I am empty'],
    [otherwise, 'I am not empty'],
]>;


type $IsNonEmpty = $Not<$IsEmpty>;

interface $Blah extends Type<[{[k: string]: string}]> { type : never }

// @ts-expect-error: check T when P is a predicate and R a free type
type WrongCustomPredicate<T> = Match<T, [
    [$IsNonEmpty, $Blah],
    [otherwise, 'no']
], {[k: string]: number}>

type CustomPredicate<T> = Match<T, [
    [$IsNonEmpty, free.Id],
    [otherwise, 'is empty']
], {[k: string]: number}>

test('custom predicate' as const, t => [
    t.equal<CustomPredicate<{a: 1}>, {a: 1}>(),
    t.equal<CustomPredicate<[]>, 'is empty'>()
])

test('Match a free type' as const, t => [
    t.equal<Free<Set<1>>, 1>(),
    t.equal<Free<Map<1, 2>>, [1, 2]>()
])

type OtherwiseMatch<A, B> = Match<[A, B],[
    [[1, 2],  $R12],
    [[3, 4],  $R34],
    [[5, 6],  $R56],
    [otherwise, 42]
]>

type OtherwiseTypeMatch<A, B> = Match<[A, B],[
    [[1, 2],  $R12],
    [[3, 4],  $R34],
    [[5, 6],  $R56],
    [otherwise, free.Map]
], [unknown, unknown]>

test('`otherwise` sets a default value or a catchall type' as const, t => [
    t.equal<OtherwiseMatch<4, 4>, 42>(),
    t.equal<OtherwiseTypeMatch<4, 5>, Map<4, 5>>()
])

type ObjMatch<T> = Match<T,[
    [{ a: 1, b: 2 },  $R12],
    [{ a: 3, b: 4 },  $R34],
    [{ a: 5, b: 6 },  $R56],
], never>

test('Match an object with destructuring' as const, t => [
    t.equal<ObjMatch<{ a: 1, b: 2 }>, '1:2'>(),
    t.equal<ObjMatch<{ a: 3, b: 4 }>, '3:4'>(),
    t.equal<ObjMatch<{ a: 5, b: 6 }>, '5:6'>(),
])

test('Match an object with destructuring in an alternate order' as const, t => [
    t.equal<ObjMatch<{ b: 2, a: 1 }>, '1:2'>(),
    t.equal<ObjMatch<{ b: 4, a: 3 }>, '3:4'>(),
    t.equal<ObjMatch<{ b: 6, a: 5 }>, '5:6'>(),
])

// @ts-expect-error: incompatible pair [{ a: 2, b: 2 },  $R11]
type WrongObjMatch<A, B> = Match<{ a: A, b: B },[
    [{ a: 1, b: 2 },  $R12],
    [{ a: 3, b: 4 },  $R12],
    [{ a: 5, b: 6 },  $R56],
], never>

type WrappedObjMatch<T> = Match<[T],[
    [[{ a: 1, b: 2 }],  $W12],
    [[{ a: 3, b: 4 }],  $W34],
    [[{ a: 5, b: 6 }],  $W56],
], never>

test('Match an object with no destructuring' as const, t => [
    t.equal<WrappedObjMatch<{a: 1, b: 2}>, '1:2'>(),
    t.equal<WrappedObjMatch<{a: 3, b: 4}>, '3:4'>(),
    t.equal<WrappedObjMatch<{a: 5, b: 6}>, '5:6'>(),
])


type MixAndMatch<T> = Match<T, [
    [[1, 2], $R12],
    [{ a: 3, b: 4 }, $R34],
], never>

test('Match a tuple or an object with destructuring' as const, t => [
    t.equal<MixAndMatch<[1, 2]>, '1:2'>(),
    t.equal<MixAndMatch<{a: 3, b: 4}>, '3:4'>(),
])


// Edge case: explicit never in otherwise type checks
type ExplicitNever<A> = Match<A, [
    [1, '1'],
    [otherwise, never]
]>

// Edge case: accept value when otherwise is `never`
type OtherwiseIsNever = ExplicitNever<2>


test('select arguments in tuple' as const, t =>
    t.equal<
        Match<[1, 2], [[[number, number], free.Id, [1]]]>,
        2
    >()
)

test('select arguments in object' as const, t => [
    t.equal<
        Match<{a: 1, b: 2}, [[{a: number, b: number}, free.Id, ['b']]]>,
        2
    >(),
    t.equal<
        Match<{a: 1, b: 2}, [[Record<string, unknown>, free.Id, ['b']]]>,
        2
    >()
])

test('select arguments in free type' as const, t =>
    t.equal<
        Match<Map<1, 2>, [[free.Map, free.Id, [1]]], Map<1, 2>>,
        2
    >()
)

// @ts-expect-error keys are type checked
type keysNotFound = Match<{a: 1, b: 2}, [
    [Record<'a', unknown>, free.Id, ['b']]
], never>

// @ts-expect-error T/tuple does not match otherwise/R
type MismatchTuple = Match<[string, number], [
    // [free.Map, free.Id, [1]],
    [free.Set, free.Id],
    [otherwise, free.Id]
], [string, number]>

//@ts-expect-error T/raw does not match otherwise/R
type MismatchRaw = Match<number, [
    [free.Set, free.Id],
    [otherwise, free.Map]
], number>

// T/Union partially matches oterwise/R
type PartialMismatchUnion = Match<Promise<number>, [
    [free.Set, free.Id],
    [otherwise, free.Map]
], Promise<number> | [1,2]>


// @ts-expect-error Match exhaustiveness checks
type NonExhaustive1 = Match<1, [
    [free.Map, 1],
    [free.Set, 2]
], 1>

// @ts-expect-error Match exhaustiveness checks
type NonExhaustive2<T> = Match<T, [
    [free.Map, 1],
    [free.Set, 2]
], number>

// $Match

type $Foo = $Match<[
    [[1, 2],  $R12],
    [[3, 4],  $R34],
    [[5, 6],  $R56],
    [otherwise, 42]
]>

test('$Match' as const, t =>
    t.equal<apply<$Foo, [[1, 2]]>, '1:2'>(),
)

type $Bar = $Match<[
    [[1, 2],  $R12],
    [[3, 4],  $R34],
    [[5, 6],  $R56],
    [otherwise, free.Map]
]>

test('$Match otherwise' as const, t => [
    t.equal<apply<$Foo, [[10, 2]]>, 42>(),
    t.equal<apply<$Bar, [[10, 2]]>, Map<10, 2>>(),
])

type $Never = $Match<[
    [[1, 2],  $R12],
    [[3, 4],  $R34],
    [[5, 6],  $R56],
    [otherwise,  never],
]>

type $Absent = $Match<[
    [[1, 2],  $R12],
    [[3, 4],  $R34],
    [[5, 6],  $R56],
]>

// Edge cases: $Match accept value when otherwise is `never`
type $OtherwiseIsNever = apply<$Never, [[3, 4]]>
type $OtherwiseIsAbsent = apply<$Absent, [[3, 4]]>


// @ts-expect-error $Match checks `otherwise` arguments
type $WrongBar = apply<$Bar, [[1]]>;


type $Free = $Match<[
    [free.Map, free.Tuple],
    [free.Set, free.Id]
]>

test('destructure free types' as const, t => [
    t.equal<apply<$Free, [Set<1>]>, 1>(),
    t.equal<apply<$Free, [Map<1, 2>]>, [1, 2]>()
])

type $WrongFree = $Match<[
    [free.Map, free.Tuple],
    [free.Set, free.Id]
// @ts-expect-error $Match exhaustiveness checks
], number>

type PreventDestructuring<T> = Match<T, [
    [{ a: string }, free.Id],
    [Protect<{ a: number }>, free.Id]
], { a: any }>

test('prevent destructuring' as const, t => [
    t.equal<PreventDestructuring<{ a: 1 }>, {a: 1}>(),
    t.equal<PreventDestructuring<{ a: 'foo' }>, 'foo'>()
])