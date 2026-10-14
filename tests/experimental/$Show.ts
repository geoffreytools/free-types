import { test } from 'ts-spec';
import { Show } from 'experimental/Show';

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
    // union display order is not guaranteed by TS; accept either rendering via
    // `extends` (matches any listed member), as the 'Show union' test does above
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

// Show can take a generic
type Nested<$T> = `<${Show<$T>}`;