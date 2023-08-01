import { test } from 'ts-spec'
import { apply } from 'free-types-core';
import { $MapOver, MapOver } from '../../../essential/mappables/MapOver'
import { $Next } from '../../../utility-types/arithmetic'

test('work on tuples' as const, t => [
    t.equal<MapOver<[1,2,3], $Next>, [2,3,4]>(),
    t.equal<apply<$MapOver<$Next>, [[1,2,3]]>, [2,3,4]>()
])

test('work on readonly tuples' as const, t => [
    t.equal<MapOver<readonly [1,2,3], $Next>, readonly [2,3,4]>(),
    t.equal<apply<$MapOver<$Next>, [readonly [1,2,3]]>, readonly [2,3,4]>()
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