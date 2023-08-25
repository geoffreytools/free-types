import { test } from 'ts-spec'
import { apply, Type, Checked, A } from 'free-types-core';
import * as Tuple from '../../../src/essential/Tuple';
import { $Extends, Refinement } from '../../../src';

type ExpectStringArr<T extends readonly string[]> = T;

type MixedTuple = [1, 'a', 2, true, 3, symbol];
type Tuple6 = [unknown, unknown, unknown, unknown, unknown, unknown];
type $IsNum =  Refinement.$Refine<$Extends<number>, number>
type $IsStrOpt =  Refinement.$Refine<$Extends<string | undefined>, string |undefined>
type $IsStr =  Refinement.$Refine<$Extends<string>, string>
type $IsNumStr =  Refinement.$Refine<$Extends<number | string>, number | string>
type $IsUndefined = Refinement.$Refine<$Extends<undefined>, undefined>

/* type checking */

// Accept generic return type
{type Gen<T extends readonly string[]> = ExpectStringArr<Tuple.FilterOut<T, $IsNum>>}

// @ts-expect-error: type check generic return type
{type Gen<T extends (number | string)[]> = ExpectStringArr<Tuple.FilterOut<T, $IsStr>>}

interface $AcceptPredicate extends Type<[(number|string)[]], string[]> {
    // Accept implicit return type
    type: Tuple.FilterOut<Checked<A, this>, $IsNum>
}

interface $AcceptRefinement extends Type<[(number|string)[]], string[]> {
    // Accept implicit return type
    type: Tuple.FilterOut<Checked<A, this>, number>
}

// @ts-expect-error: type check implicit return type
interface $RejectPredicate extends Type<[(number|string)[]], string[]> {
    type: Tuple.FilterOut<Checked<A, this>, $IsStr>
}

// @ts-expect-error: type check implicit return type
interface $RejectRefinement extends Type<[(number|string)[]], string[]> {
    type: Tuple.FilterOut<Checked<A, this>, string>
}

test('Resolve to a value when input is generic', t => [
    (<T extends (number | string)[]>() => t.equal<
        Tuple.FilterOut<T, Refinement.$Extends<number>>,
        string[]
    >())(),
    (<T extends (number | string)[]>() => t.equal<
        Tuple.FilterOut<T, number>,
        string[]
    >())(),
    (<T extends (number | string)[]>() => t.equal<
        apply<Tuple.$FilterOut<Refinement.$Extends<number>>, [T]>,
        string[]
    >())(),
    (<T extends (number | string)[]>() => t.equal<
        apply<Tuple.$FilterOut<number>, [T]>,
        string[]
    >())()
])

test('$FilterOut return type is narrowed', t => [
    t.equal<Tuple.$FilterOut<number, string>['type'], string[]>(),
    t.equal<Tuple.$FilterOut<$IsNum, string>['type'], string[]>(),
])

/* Inference */

test('FilterOut tuple with raw refinement', t => [
    t.equal<apply<Tuple.$FilterOut<number>, [MixedTuple]>, ['a', true, symbol]>(),
    t.equal<Tuple.FilterOut<MixedTuple, number>, ['a', true, symbol]>(),
    t.equal<apply<Tuple.$FilterOut<number | string>, [MixedTuple]>, [true, symbol]>(),
    t.equal<Tuple.FilterOut<MixedTuple, number | string>, [true, symbol]>(),
])

test('FilterOut tuple with refinement predicate', t => [
    t.equal<apply<Tuple.$FilterOut<$IsNum>, [MixedTuple]>, ['a', true, symbol]>(),
    t.equal<Tuple.FilterOut<MixedTuple, $IsNum>, ['a', true, symbol]>(),
    t.equal<apply<Tuple.$FilterOut<$IsNumStr>, [MixedTuple]>, [true, symbol]>(),
    t.equal<Tuple.FilterOut<MixedTuple, $IsNumStr>, [true, symbol]>(),
])

test('FilterOut array', t => [
    t.equal<Tuple.FilterOut<(number | string)[], number>, string[]>(),
    t.equal<Tuple.FilterOut<(number | string)[], $IsNum>, string[]>()
])


test('FilterOut excludes undefined when appropriate', t => [
    t.equal<Tuple.FilterOut<[1, '2'?, 3?], string>, [1, 3?]>(),
    t.equal<Tuple.FilterOut<[1, '2'?, 3?], $IsStr>, [1, 3?]>(),
    t.equal<Tuple.FilterOut<[1, '2', 3?], string>, [1, 3?]>(),
    t.equal<Tuple.FilterOut<[1, '2'?, 3?], string | undefined>, [1, 3?]>(),
    t.equal<Tuple.FilterOut<[1, 2?, 3?], $IsStrOpt>, [1, 2?, 3?]>(),
    t.equal<Tuple.FilterOut<[1, '2'?, 3?], $IsStrOpt>, [1, 3?]>(),
    t.equal<Tuple.FilterOut<[1, 2?, 3?], undefined>, [1]>(),
    t.equal<Tuple.FilterOut<[1, 2?, 3?], $IsUndefined>, [1]>(),
    t.equal<Tuple.FilterOut<[1, undefined], undefined>, [1]>(),
    t.equal<Tuple.FilterOut<[1, undefined], $IsUndefined>, [1]>()
])

test('Preserve writing mode', t => [
    t.equal<apply<Tuple.$FilterOut<number>, [Readonly<MixedTuple>]>, readonly ['a', true, symbol]>(),
    t.equal<apply<Tuple.$FilterOut<$IsNum>, [Readonly<MixedTuple>]>, readonly ['a', true, symbol]>(),
    t.equal<Tuple.FilterOut<Readonly<MixedTuple>, number>, readonly ['a', true, symbol]>(),
    t.equal<Tuple.FilterOut<Readonly<MixedTuple>, $IsNum>, readonly ['a', true, symbol]>(),
])

test('resilient to intersection with array or tuple' as const, t => [
    t.equal<Tuple.FilterOut<MixedTuple & unknown[], number>, ['a', true, symbol]>(),
    t.equal<Tuple.FilterOut<MixedTuple & unknown[], $IsNum>, ['a', true, symbol]>(),
    t.equal<Tuple.FilterOut<MixedTuple & Tuple6, number>, ['a', true, symbol]>(),
    t.equal<Tuple.FilterOut<MixedTuple & Tuple6, $IsNum>, ['a', true, symbol]>(),
])
