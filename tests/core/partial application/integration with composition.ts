import { test } from 'ts-test';
import { apply, partialRight, free, partial } from "../../..";
import { $Rest } from '../../../essential/adapters/$Rest';
import { Flow } from '../../../essential/composition/Flow';
import { Pipe } from '../../../essential/composition/Pipe';

type Control = [free.Promise, free.Array, free.Set];

type SimpleComp = [
    free.Promise,
    partialRight<free.Map, ['foo']>,
    free.Set
];

type IntermediaryComp = [
    free.Promise,
    partial<free.Function, [['foo']]>,
    free.Set
];

type ComplexComp = [
    free.Promise,
    $Rest<partialRight<free.Function, ['foo']>, 1>,
    free.Set
];

type $Control = Flow<Control>;
type $SimpleComp = Flow<SimpleComp>;
type $IntermediaryComp = Flow<IntermediaryComp>;
type $ComplexComp = Flow<ComplexComp>;

test('Flow compiles' as const, t => [
    t.not.never<Flow<Control>>(),
    t.not.never<Flow<SimpleComp>>(),
    t.not.never<Flow<IntermediaryComp>>(),
    t.not.never<Flow<ComplexComp>>()
])

test('partial with Pipe' as const, t => [
    t.equal<Pipe<[1], Control>, Set<Promise<1>[]>>(),
    t.equal<Pipe<[1], SimpleComp>, Set<Map<Promise<1>, "foo">>>(),
    t.equal<Pipe<[1], IntermediaryComp>, Set<(a: 'foo') => Promise<1>>>(),
    t.equal<Pipe<[1], ComplexComp>, Set<(a: Promise<1>) => "foo">>(),
])

test('partial with Flow' as const, t => [
    t.equal<apply<$Control, [1]>, Set<Promise<1>[]>>(),
    t.equal<apply<$SimpleComp, [1]>, Set<Map<Promise<1>, "foo">>>(),
    t.equal<apply<$IntermediaryComp, [1]>, Set<(a: 'foo') => Promise<1>>>(),
    t.equal<apply<$ComplexComp, [1]>, Set<(a: Promise<1>) => "foo">>(),
])
