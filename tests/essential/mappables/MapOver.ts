import { group, test } from 'ts-spec'
import { apply, Type, Checked, A, Expect } from 'free-types-core';
import { $MapOver, MapOver, $Transform } from 'src/essential/mappables/MapOver'
import { $Next } from 'src/utility-types/arithmetic'

type ExpectNumericArr<T extends readonly number[]> = T;

// Accept generic return type
{type Gen<T extends number[]> = ExpectNumericArr<MapOver<T, Type<[number], number>>>}

// @ts-expect-error: type check generic return type
{type Gen<T extends number[]> = ExpectNumericArr<MapOver<T, Type<[number], string>>>}

interface $AcceptImplicit extends Type<[number[]], number[]> {
    // Accept implicit return type
    type: MapOver<Checked<A, this>, $Next>
}

// @ts-expect-error: type check implicit return type
interface $RejectImplicit extends Type<[number[]], string[]> {
    type: MapOver<Checked<A, this>, $Next>
}

test('work on tuples' as const, t => [
    t.equal<MapOver<[1,2,3], $Next>, [2,3,4]>(),
    t.equal<apply<$MapOver<$Next>, [[1,2,3]]>, [2,3,4]>()
])

test('work on readonly tuples' as const, t => [
    t.equal<MapOver<readonly [1,2,3], $Next>, readonly [2,3,4]>(),
    t.equal<apply<$MapOver<$Next>, [readonly [1,2,3]]>, readonly [2,3,4]>()
])

test('resilient to intersection with array or tuple' as const, t => [
    t.equal<MapOver<[1, 2] & unknown[], $Next>, [2, 3]>(),
    t.equal<MapOver<[1, 2] & [unknown, unknown], $Next>, [2, 3]>()
])

test('work on arrays' as const, t => [
    t.equal<MapOver<(1|2|3)[], $Next>, (2|3|4)[]>(),
    t.equal<apply<$MapOver<$Next>, [(1|2|3)[]]>, (2|3|4)[]>()
])

test('work on readonly arrays' as const, t => [
    t.equal<MapOver<readonly (1|2|3)[], $Next>, readonly (2|3|4)[]>(),
    t.equal<apply<$MapOver<$Next>, [readonly (1|2|3)[]]>, readonly (2|3|4)[]>()
])

test('preserve tupleness' as const, t => [
    t.equal<[...MapOver<[1,2,3], $Next>], [2,3,4]>(),
    t.equal<[...apply<$MapOver<$Next>, [[1,2,3]]>], [2,3,4]>()
])

test('preserve optional array elements' as const, t => [
    t.equal<[...MapOver<[1,2?,3?], $Next>], [2,3?,4?]>(),
    t.equal<[...apply<$MapOver<$Next>, [readonly [1,2?,3?]]>], [2,3?,4?]>(),
    t.equal<[...MapOver<[1,2?,3?], $Next>], [2,3?,4?]>(),
    t.equal<[...apply<$MapOver<$Next>, [readonly [1,2?,3?]]>], [2,3?,4?]>()
])

test('preserve open-ended' as const, t => [
    t.equal<[...MapOver<[1,2, ...3[]], $Next>], [2, 3, ...4[]]>(),
    t.equal<[...apply<$MapOver<$Next>, [[1,2, ...3[]]]>], [2, 3, ...4[]]>(),
])

test('preserve optional and open-ended' as const, t => [
    t.equal<[...MapOver<[1,2?, ...3[]], $Next>], [2, 3?, ...4[]]>(),
    t.equal<[...apply<$MapOver<$Next>, [[1,2?, ...3[]]]>], [2, 3?, ...4[]]>(),
])

test('work on objects' as const, t => [
    t.equal<MapOver<{a: 1, b: 2}, $Next>, {a: 2, b: 3}>(),
    t.equal<apply<$MapOver<$Next>, [{a: 1, b: 2}]>, {a: 2, b: 3}>()
])

test('preserve optional fields' as const, t => [
    t.equal<MapOver<{a?: 1, b?: 2}, $Next>, {a?: 2, b?: 3}>(),
    t.equal<apply<$MapOver<$Next>, [{a?: 1, b?: 2}]>, {a?: 2, b?: 3}>()
])