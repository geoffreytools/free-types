import { test } from 'ts-spec'
import { Type, apply } from 'free-types-core';
import { $Filter, Filter, $FilterOut, FilterOut } from '../../../essential/mappables/Filter'

type MixedTuple = [1, 'a', 2, true, 3, symbol];
type MixedObj = { a: 1, b: 'a', c: 2, d: true, e: 3, f: symbol };

interface $IsNumber extends Type<1> {
    type: this[0] extends number ? true : false
}

test('Filter tuple', t => [
    t.equal<apply<$Filter<number>, [MixedTuple]>, [1, 2, 3]>(),
    t.equal<Filter<MixedTuple, number>, [1, 2, 3]>()
])

test('Filter predicate', t => [
    t.equal<apply<$Filter<$IsNumber>, [MixedTuple]>, [1, 2, 3]>(),
    t.equal<apply<$FilterOut<$IsNumber>, [MixedTuple]>, ['a', true, symbol]>(),
])

test('FilterOut tuple', t => [
    t.equal<apply<$FilterOut<number>, [MixedTuple]>, ['a', true, symbol]>(),
    t.equal<FilterOut<MixedTuple, number>, ['a', true, symbol]>()
])

test('Filter object', t => [
    t.equal<apply<$Filter<number>, [MixedObj]>, { a: 1, c: 2, e: 3 }>(),
    t.equal<Filter<MixedObj, number>, { a: 1, c: 2, e: 3 }>()
])

test('FilterOut object', t => [
    t.equal<apply<$FilterOut<number>, [MixedObj]>,{ b: 'a', d: true, f: symbol }>(),
    t.equal<FilterOut<MixedObj, number>,{ b: 'a', d: true, f: symbol }>()
])