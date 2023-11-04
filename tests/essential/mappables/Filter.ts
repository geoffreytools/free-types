import { test } from 'ts-spec'
import { apply } from 'free-types-core';
import { $Filter, Filter, $FilterOut, FilterOut } from 'src/essential/mappables/Filter'
import { Mappable } from 'src/essential/mappables'
import { $Extends, Refinement } from 'src'
type MixedTuple = [1, 'a', 2, true, 3, symbol];
type MixedObj = { a: 1, b: 'a', c: 2, d: true, e: 3, f: symbol };

type $IsNumber =  Refinement.$Refine<$Extends<number>, number>

test('$Filter return type is narrowed', t => [
    t.equal<$Filter<number>['type'], Mappable<number>>(),
])

test('$FilterOut return type is narrowed', t => [
    t.equal<$FilterOut<number, string>['type'], Mappable<string>>(),
])

test('Filter tuple with raw refinement', t => [
    t.equal<apply<$Filter<number>, [MixedTuple]>, [1, 2, 3]>(),
    t.equal<Filter<MixedTuple, number>, [1, 2, 3]>()
])

test('Filter tuple with refinement predicate', t => [
    t.equal<apply<$Filter<$IsNumber>, [MixedTuple]>, [1, 2, 3]>(),
    t.equal<Filter<MixedTuple, $IsNumber>, [1, 2, 3]>()
])

test('FilterOut tuple with raw refinement', t => [
    t.equal<apply<$FilterOut<number>, [MixedTuple]>, ['a', true, symbol]>(),
    t.equal<FilterOut<MixedTuple, number>, ['a', true, symbol]>()
])

test('Filter out tuple with refinement predicate', t => [
    t.equal<apply<$FilterOut<$IsNumber>, [MixedTuple]>, ['a', true, symbol]>(),
    t.equal<FilterOut<MixedTuple, $IsNumber>, ['a', true, symbol]>()
])

test('Filter object', t => [
    t.equal<apply<$Filter<number>, [MixedObj]>, { a: 1, c: 2, e: 3 }>(),
    t.equal<Filter<MixedObj, number>, { a: 1, c: 2, e: 3 }>()
])

test('FilterOut object', t => [
    t.equal<apply<$FilterOut<number>, [MixedObj]>,{ b: 'a', d: true, f: symbol }>(),
    t.equal<FilterOut<MixedObj, number>,{ b: 'a', d: true, f: symbol }>()
])

test('Filter with union predicate', t => [
    t.equal<Filter<MixedTuple, 1 | 2>, [1, 2]>(),
    t.equal<Filter<MixedObj, 'a' | true>, { b: 'a', d: true }>()
])
