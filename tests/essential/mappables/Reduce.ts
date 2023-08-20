import { test } from 'ts-spec'
import { $Reduce, Reduce } from '../../../src/essential/mappables/Reduce'
import { $Add } from '../../../src/utility-types/arithmetic'
import { $Stitch } from '../../../src/utility-types/strings/$Stitch'

// @ts-expect-error: reject generic empty tuple
{type EmptyTuple<T extends number[]> = Reduce<T, $Add>}

// @ts-expect-error: reject generic empty object
{type Empty<T extends {}> = Reduce<T, $Add>}

// @ts-expect-error: reject empty tuple
{type EmptyTupleError = Reduce<[], $Add>}

// @ts-expect-error: reject empty object
{type EmptyObjectError = Reduce<{}, $Add>}

// Accept generic non-empty tuple
{type OK<T extends [number, ...number[]]> = Reduce<T, $Add>}

// Require annotation for generic non-empty object
{type OK<T extends { foo: number, bar: number }> = Reduce<T, $Add, any>}

// @ts-expect-error: should not error
{type TODO<T extends { foo: number, bar: number }> = Reduce<T, $Add>}


test('Reduce works on tuples' as const, t => [
    t.equal<Reduce<[1], $Add>, 1>(),
    t.equal<Reduce<[1, 2], $Add>, 3>(),
    t.equal<Reduce<[1, 2, 3], $Add>, 6>(),
    t.equal<Reduce<[1, 2, 3, 4], $Add>, 10>(),
])

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

test('Reduce works on objects' as const, t => [
    t.equal<Reduce<{a: 1}, $Add>, 1>(),
    t.equal<Reduce<{a: 1, b: 2}, $Add>, 3>(),
    t.equal<Reduce<{a: 1, b: 2, c: 3}, $Add>, 6>(),
    t.equal<Reduce<{a: 1, b: 2, c: 3, d: 4}, $Add>, 10>(),
    t.equal<Reduce<{a: 1, b: 2, c: 3, d: 4, e: 4}, $Add>, 14>()
])

{
    // @ts-expect-error: Reduce/object type checking
    type Wrong1 = Reduce<{a: 'a'}, $Add>

    // @ts-expect-error: Reduce/object type checking
    type Wrong2 = Reduce<{a: 'a', b: 1}, $Add>

    // @ts-expect-error: Reduce/object type checking
    type Wrong3 = Reduce<{a: 1, b: 'b'}, $Add>
}