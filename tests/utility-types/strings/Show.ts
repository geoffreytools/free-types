import { test } from 'ts-spec';
import { Show } from '../../../src/strings/Show';
import { Show as FreeShow } from 'experimental/Show';

test('Show base types' as const, t => [
    t.equal<Show<any>, 'any'>(),
    t.equal<Show<never>, 'never'>(),
    t.equal<Show<unknown>, 'unknown'>(),
    t.equal<Show<string>, 'string'>(),
    t.equal<Show<number>, 'number'>(),
    t.equal<Show<bigint>, 'bigint'>(),
    t.equal<Show<boolean>, 'boolean'>(),
    t.equal<Show<null>, 'null'>(),
    t.equal<Show<undefined>, 'undefined'>(),
    t.equal<Show<'a'>, 'a'>(),
    t.equal<Show<true>, 'true'>(),
    t.equal<Show<false>, 'false'>(),
    t.equal<Show<1>, '1'>(),
])

test('Show tuple' as const, t =>
    t.equal<Show<[1, 2]>, '[1, 2]'>()
)
test('Show array' as const, t =>
    t.equal<Show<number[]>, 'number[]'>()
)

test('Show object' as const, t =>
    t.equal<Show<{a: 1, b: 2}>, '{ a: 1, b: 2 }'>()
)

test('Show function' as const, t => [
    t.equal<Show<() => string>, '() => string'>(),
    t.equal<Show<(a: number) => string>, '(a: number) => string'>(),
    t.equal<Show<(a: number, b: string) => void>, '(a: number, b: string) => void'>(),
    t.equal<Show<(...args: any[]) => string>, '(...args: any[]) => string'>(),
    t.extends<Show<(...args: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) => void>, `${string}, p: 0, q: 0) => void`>(),
    // known limitation
    t.not.equal<Show<(a: number, ...args: number[]) => string>, '(a: number, ...args: number[]) => string'>()
])

test('Show known class' as const, t => [
    t.equal<Show<Map<string, number>>, 'Map<string, number>'>(),
])

test('Show union' as const, t => [
    t.extends<
        Show<1 | 2 | 3>,
        | '(1 | 2 | 3)'
        | '(1 | 3 | 2)'
        | '(2 | 3 | 1)'
        | '(2 | 1 | 3)'
        | '(3 | 1 | 2)'
        | '(3 | 2 | 1)'
    >(),
])

test('Show deeply nested type' as const, t =>
    t.extends<Show<[1, 2, {a: 3, b: Map<string, 4>, c: [(1|2)[], (a: number, b: string) => void ]}]>,
        | '[1, 2, { a: 3, b: Map<string, 4>, c: [(1 | 2)[], (a: number, b: string) => void] }]'
        | '[1, 2, { a: 3, b: Map<string, 4>, c: [(2 | 1)[], (a: number, b: string) => void] }]'
    >()
)

test('Show undefined nested in a tuple, a union or an optional property' as const, t => [
    t.equal<Show<[undefined]>, '[undefined]'>(),
    t.equal<Show<[a?: 1]>, '(1 | undefined)[]'>(),
    t.equal<Show<{ a?: number }>, '{ a: (number | undefined) }'>(),
])

test('Show index signatures' as const, t =>
    t.extends<Show<{ [k: string]: number }>,
        | '{ string: number, number: number }'
        | '{ number: number, string: number }'
    >()
)

test('Show agrees with the free-types implementation on edge cases' as const, t => [
    t.equal<Show<{}>, FreeShow<{}>>(),
    t.equal<Show<{ readonly a: 1 }>, FreeShow<{ readonly a: 1 }>>(),
    t.equal<Show<{ 0: 'a' }>, FreeShow<{ 0: 'a' }>>(),
    t.equal<Show<[]>, FreeShow<[]>>(),
    t.equal<Show<['', 1]>, FreeShow<['', 1]>>(),
    t.equal<Show<readonly number[]>, FreeShow<readonly number[]>>(),
    t.equal<Show<readonly [1, 2]>, FreeShow<readonly [1, 2]>>(),
    t.equal<Show<string[][]>, FreeShow<string[][]>>(),
    t.equal<Show<1n>, FreeShow<1n>>(),
    t.equal<Show<symbol>, FreeShow<symbol>>(),
    t.equal<Show<boolean | 1>, FreeShow<boolean | 1>>(),
    t.equal<Show<`a${string}`>, FreeShow<`a${string}`>>(),
    t.equal<Show<() => any>, FreeShow<() => any>>(),
    t.equal<Show<() => number | undefined>, FreeShow<() => number | undefined>>(),
    t.equal<Show<(a: { b: [1] }) => () => 2>, FreeShow<(a: { b: [1] }) => () => 2>>(),
    t.equal<Show<Set<[1, string]>>, FreeShow<Set<[1, string]>>>(),
    t.equal<Show<Promise<Map<1, 2>>>, FreeShow<Promise<Map<1, 2>>>>(),
    t.equal<Show<Date>, FreeShow<Date>>(),
    t.equal<Show<object>, FreeShow<object>>(),
])

// Show can take a generic
type Nested<$T> = `<${Show<$T>}`;
