import { test } from 'ts-spec'
import { apply, Type, Checked, A } from 'free-types-core';
import * as Tuple from '../../../src/essential/Tuple';
import { $Extends, Refinement } from '../../../src';

type ExpectNumericArr<T extends readonly number[]> = T;

// Accept generic return type
{type Gen<T extends readonly number[]> = ExpectNumericArr<Tuple.Filter<T, $IsNumber>>}

// @ts-expect-error: type check generic return type
{type Gen<T extends number[]> = ExpectNumericArr<Tuple.Filter<T, $IsString>>}

interface $AcceptImplicit extends Type<[number[]], number[]> {
    // Accept implicit return type
    type: Tuple.Filter<Checked<A, this>, $IsNumber>
}

//@ts-expect-error: type check implicit return type
interface $RejectImplicit extends Type<[number[]], string[]> {
    type: Tuple.Filter<Checked<A, this>, $IsNumber>
}

type MixedTuple = [1, 'a', 2, true, 3, symbol];

type $IsNumber =  Refinement.$Refine<$Extends<number>, number>
type $IsString =  Refinement.$Refine<$Extends<string>, string>

test('$Filter return type is narrowed', t => [
    t.equal<Tuple.$Filter<number>['type'], (number | undefined)[]>(),
])

test('$FilterOut return type is narrowed', t => [
    t.equal<Tuple.$FilterOut<number, string>['type'], (string | undefined)[]>(),
])

test('Filter tuple with raw refinement', t => [
    t.equal<apply<Tuple.$Filter<number>, [MixedTuple]>, [1, 2, 3]>(),
    t.equal<Tuple.Filter<MixedTuple, number>, [1, 2, 3]>(),
])

test('Filter tuple with refinement predicate', t => [
    t.equal<apply<Tuple.$Filter<$IsNumber>, [MixedTuple]>, [1, 2, 3]>(),
    t.equal<Tuple.Filter<MixedTuple, $IsNumber>, [1, 2, 3]>(),
])

test('FilterOut tuple with raw refinement', t => [
    t.equal<apply<Tuple.$FilterOut<number>, [MixedTuple]>, ['a', true, symbol]>(),
    t.equal<Tuple.FilterOut<MixedTuple, number>, ['a', true, symbol]>(),
])

test('Filter out tuple with refinement predicate', t => [
    t.equal<apply<Tuple.$FilterOut<$IsNumber>, [MixedTuple]>, ['a', true, symbol]>(),
    t.equal<Tuple.FilterOut<MixedTuple, $IsNumber>, ['a', true, symbol]>(),
])