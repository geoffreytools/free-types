import { test } from 'ts-spec';
import { apply, partialRight, free } from "../../..";
import { $Rest } from 'src/essential/adapters/$Rest';
import { Pipe, Flow } from 'free-types-core';

type C = [
    free.Promise,
    $Rest<partialRight<free.Function, ['foo']>, 1>,
    free.Set
];
type $H = Flow<C>;

test('Flow compiles' as const, t => [
    t.not.never<Flow<C>>()
])

test('partial with Pipe' as const, t => [
    t.equal<Pipe<[1], C[0], C[1], C[2]>, Set<(a: Promise<1>) => "foo">>(),
])

test('partial with Flow' as const, t => [
    t.equal<apply<$H, [1]>, Set<(a: Promise<1>) => "foo">>(),
])