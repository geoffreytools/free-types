import { test } from 'ts-spec'
import { $Reduce, Reduce } from '../../../essential/mappables/Reduce'
import { $Add } from '../../../utility-types/arithmetic'
import { $Stitch } from '../../../utility-types/strings/$Stitch'

test('Reduce works on tuples' as const, t => [
    t.equal<Reduce<[1], $Add>, 1>(),
    t.equal<Reduce<[1, 2], $Add>, 3>(),
    t.equal<Reduce<[1, 2, 3], $Add>, 6>(),
    t.equal<Reduce<[1, 2, 3, 4], $Add>, 10>(),
])

// procedural type checking can be turned off
type Foo<T extends [number, ...number[]]> = Reduce<T, $Add, unknown>;
//                                                 -        -------

test('Reducer output can be a subtype of the input' as const, t => [
    t.equal<Reduce<['a', 2, true], $Stitch<':'>>, 'a:2:true'>(),
])

{
    // @ts-expect-error: Reduce/tuple type checking
    type Wrong1 = Reduce<['a'], $Add>

    // @ts-expect-error: Reduce/tuple type checking
    type Wrong2 = Reduce<['a', 1], $Add>

    // @ts-expect-error: Reduce/tuple type checking
    type Wrong3 = Reduce<[1, 'b'], $Add>
}

// @ts-expect-error: Reduce/tuple: input must not be empty
type EmptyTupleError = Reduce<[], $Add>

test('Reduce works on objects' as const, t => [
    t.equal<Reduce<{a: 1}, $Add>, 1>(),
    t.equal<Reduce<{a: 1, b: 2}, $Add>, 3>(),
    t.equal<Reduce<{a: 1, b: 2, c: 3}, $Add>, 6>(),
    t.equal<Reduce<{a: 1, b: 2, c: 3, d: 4}, $Add>, 10>()
])

{
    // @ts-expect-error: Reduce/object type checking
    type Wrong1 = Reduce<{a: 'a'}, $Add>

    // @ts-expect-error: Reduce/object type checking
    type Wrong2 = Reduce<{a: 'a', b: 1}, $Add>

    // @ts-expect-error: Reduce/object type checking
    type Wrong3 = Reduce<{a: 1, b: 'b'}, $Add>
}

// @ts-expect-error: Reduce/object: input must not be empty
type EmptyObjectError = Reduce<{}, $Add>