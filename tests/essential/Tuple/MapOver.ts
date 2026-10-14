import { test } from 'ts-spec'
import { apply, Type, Checked, A } from 'free-types-core';
import * as Tuple from 'essential/Tuple'
import { $Next } from '../../../src/arithmetic'

type ExpectNumericArr<T extends readonly number[]> = T;

// Accept generic return type
{type Gen<T extends readonly number[]> = ExpectNumericArr<Tuple.MapOver<T, Type<[number], number>>>}

// @ts-expect-error: type check generic return type
{type Gen<T extends number[]> = ExpectNumericArr<Tuple.MapOver<T, Type<[number], string>>>}

interface $AcceptImplicit extends Type<[number[]], number[]> {
    // Accept implicit return type
    type: Tuple.MapOver<Checked<A, this>, $Next>
}

// @ts-expect-error: type check implicit return type
interface $RejectImplicit extends Type<[number[]], string[]> {
    type: Tuple.MapOver<Checked<A, this>, $Next>
}

test('Return type of composition resolves to a value even with generics', t => (
    <T extends number[]>() => t.equal<
        number[],
        apply<Tuple.$MapOver<$Next>, [T]>
    >()
)())

test('work on tuples' as const, t => [
    t.equal<Tuple.MapOver<[1,2,3], $Next>, [2,3,4]>(),
    t.equal<apply<Tuple.$MapOver<$Next>, [[1,2,3]]>, [2,3,4]>()
])

test('work on readonly tuples' as const, t => [
    t.equal<Tuple.MapOver<readonly [1,2,3], $Next>, readonly [2,3,4]>(),
    t.equal<apply<Tuple.$MapOver<$Next>, [readonly [1,2,3]]>, readonly [2,3,4]>()
])

test('resilient to intersection with array or tuple' as const, t => [
    t.equal<Tuple.MapOver<[1, 2] & unknown[], $Next>, [2, 3]>(),
    t.equal<Tuple.MapOver<[1, 2] & [unknown, unknown], $Next>, [2, 3]>()
])

test('work on arrays' as const, t => [
    t.equal<Tuple.MapOver<(1|2|3)[], $Next>, (2|3|4)[]>(),
    t.equal<apply<Tuple.$MapOver<$Next>, [(1|2|3)[]]>, (2|3|4)[]>()
])

test('work on readonly arrays' as const, t => [
    t.equal<Tuple.MapOver<readonly (1|2|3)[], $Next>, readonly (2|3|4)[]>(),
    t.equal<apply<Tuple.$MapOver<$Next>, [readonly (1|2|3)[]]>, readonly (2|3|4)[]>()
])

test('preserve tupleness' as const, t => [
    t.equal<[...Tuple.MapOver<[1,2,3], $Next>], [2,3,4]>(),
    t.equal<[...apply<Tuple.$MapOver<$Next>, [[1,2,3]]>], [2,3,4]>()
])

test('preserve optional array elements' as const, t => [
    t.equal<[...Tuple.MapOver<[1,2?,3?], $Next>], [2,3?,4?]>(),
    t.equal<[...apply<Tuple.$MapOver<$Next>, [readonly [1,2?,3?]]>], [2,3?,4?]>(),
    t.equal<[...Tuple.MapOver<[1,2?,3?], $Next>], [2,3?,4?]>(),
    t.equal<[...apply<Tuple.$MapOver<$Next>, [readonly [1,2?,3?]]>], [2,3?,4?]>()
])

test('preserve open-ended' as const, t => [
    t.equal<[...Tuple.MapOver<[1,2, ...3[]], $Next>], [2, 3, ...4[]]>(),
    t.equal<[...apply<Tuple.$MapOver<$Next>, [[1,2, ...3[]]]>], [2, 3, ...4[]]>(),
])

test('preserve optional and open-ended' as const, t => [
    t.equal<[...Tuple.MapOver<[1,2?, ...3[]], $Next>], [2, 3?, ...4[]]>(),
    t.equal<[...apply<Tuple.$MapOver<$Next>, [[1,2?, ...3[]]]>], [2, 3?, ...4[]]>(),
])