import { test } from 'ts-spec'
import { apply, Type, Checked, A } from 'free-types-core';
import * as Tuple from 'src/essential/Tuple';
import { $Extends, Refinement } from 'src';

type ExpectNumericArr<T extends readonly number[]> = T;

type MixedTuple = [1, 'a', 2, true, 3, symbol];
type Tuple6 = [unknown, unknown, unknown, unknown, unknown, unknown];
type $IsNum =  Refinement.$Refine<$Extends<number>, number>
type $IsNumOpt =  Refinement.$Refine<$Extends<number | undefined>, number | undefined>
type $IsStr =  Refinement.$Refine<$Extends<string>, string>
type $IsNumStr =  Refinement.$Refine<$Extends<number | string>, number | string>

/* type checking */

// Accept generic return type
{type Gen<T extends readonly number[]> = ExpectNumericArr<Tuple.Filter<T, $IsNum>>}

// @ts-expect-error: type check generic return type
{type Gen<T extends number[]> = ExpectNumericArr<Tuple.Filter<T, $IsStr>>}

interface $AcceptPredicate extends Type<[number[]], number[]> {
    // Accept implicit return type
    type: Tuple.Filter<Checked<A, this>, $IsNum>
}

interface $AcceptRefinement extends Type<[number[]], number[]> {
    // Accept implicit return type
    type: Tuple.Filter<Checked<A, this>, number>
}

// @ts-expect-error: type check implicit return type
interface $RejectPredicate extends Type<[number[]], string[]> {
    type: Tuple.Filter<Checked<A, this>, $IsNum>
}

// @ts-expect-error: type check implicit return type
interface $RejectRefinement extends Type<[number[]], string[]> {
    type: Tuple.Filter<Checked<A, this>, number>
}

test('Resolve to a value when input is generic', t => [
    <T extends (number | string)[]>() =>
        t.equal<Tuple.Filter<T, Refinement.$Extends<number>>, number[]>(),
    <T extends (number | string)[]>() =>
        t.equal<Tuple.Filter<T, number>, number[]>(),
    <T extends (number | string)[]>() =>
        t.equal<apply<Tuple.$Filter<Refinement.$Extends<number>>, [T]>, number[]>(),
    <T extends (number | string)[]>() =>
        t.equal<apply<Tuple.$Filter<number>, [T]>, number[]>()
])

test('$Filter return type is narrowed', t => [
    t.equal<Tuple.$Filter<number>['type'], number[]>(),
    t.equal<Tuple.$Filter<$IsNum>['type'], number[]>(),
])

/* Inference */

test('Filter tuple with raw refinement', t => [
    t.equal<apply<Tuple.$Filter<number>, [MixedTuple]>, [1, 2, 3]>(),
    t.equal<Tuple.Filter<MixedTuple, number>, [1, 2, 3]>(),
    t.equal<apply<Tuple.$Filter<number | string>, [MixedTuple]>, [1, 'a', 2, 3]>(),
    t.equal<Tuple.Filter<MixedTuple, number | string>, [1, 'a', 2, 3]>(),
])

test('Filter tuple with refinement predicate', t => [
    t.equal<apply<Tuple.$Filter<$IsNum>, [MixedTuple]>, [1, 2, 3]>(),
    t.equal<Tuple.Filter<MixedTuple, $IsNum>, [1, 2, 3]>(),
    t.equal<apply<Tuple.$Filter<$IsNumStr>, [MixedTuple]>, [1, 'a', 2, 3]>(),
    t.equal<Tuple.Filter<MixedTuple, $IsNumStr>, [1, 'a', 2, 3]>(),
])

test('Filter array', t => [
    t.equal<Tuple.Filter<(number | string)[], number>, number[]>(),
    t.equal<Tuple.Filter<(number | string)[], $IsNum>, number[]>()
])

test('Filter excludes undefined when appropriate', t => [
    t.equal<Tuple.Filter<[1, 2?, 3?], number>, [1]>(),
    t.equal<Tuple.Filter<[1, 'a', 2?, 3?], string>, ['a']>(),
    t.equal<Tuple.Filter<[1, 'a'?, 2?, 3?], string | undefined>, ['a'?]>(),
    t.equal<Tuple.Filter<[1, 2?, 3?], number | undefined>, [1, 2?, 3?]>(),
    t.equal<Tuple.Filter<[1, 2?, 3?], $IsNum>, [1]>(),
    t.equal<Tuple.Filter<[1, 'a', 2?, 3?], number | undefined>, [1, 2?, 3?]>(),
    t.equal<Tuple.Filter<[1, 2?, 3?], $IsNumOpt>, [1, 2?, 3?]>(),
    t.equal<Tuple.Filter<[1, 'a', 2?, 3?], $IsNumOpt>, [1, 2?, 3?]>()
])

test('Preserve writing mode', t => [
    t.equal<apply<Tuple.$Filter<number>, [Readonly<MixedTuple>]>, readonly [1, 2, 3]>(),
    t.equal<apply<Tuple.$Filter<$IsNum>, [Readonly<MixedTuple>]>, readonly [1, 2, 3]>(),
    t.equal<Tuple.Filter<Readonly<MixedTuple>, number>, readonly [1, 2, 3]>(),
    t.equal<Tuple.Filter<Readonly<MixedTuple>, $IsNum>, readonly [1, 2, 3]>(),
])

test('resilient to intersection with array or tuple' as const, t => [
    t.equal<Tuple.Filter<MixedTuple & unknown[], number>, [1, 2, 3]>(),
    t.equal<Tuple.Filter<MixedTuple & unknown[], $IsNum>, [1, 2, 3]>(),
    t.equal<Tuple.Filter<MixedTuple & Tuple6, number>, [1, 2, 3]>(),
    t.equal<Tuple.Filter<MixedTuple & Tuple6, $IsNum>, [1, 2, 3]>(),
])