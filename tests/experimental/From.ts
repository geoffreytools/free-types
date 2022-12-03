import { test } from 'ts-spec'
import { apply } from 'free-types-core'
import { From } from '../../dist/experimental/From'


test('tuples' as const, t => [
    t.equal<apply<From<[number, string]>, [1, 'foo']>, [1, 'foo']>(),
    t.equal<apply<From<[number, string, 2], [1]>, ['foo']>, [number, 'foo', 2]>()
])

test('objects' as const, t =>  {
    type Template = { a: number, b: string };

    type $T = From<Template, ['a', 'b']>;

    // @ts-expect-error: type check path
    {type $T = From<Template, ['c', 'd']>;}

    type Test = apply<$T, [1, 'foo']>
    type Result = { a: 1, b: 'foo' };

    type Constraints = $T['constraints']
    type ExpectedConstraints = [number, string];

    return [
        t.equal<Test, Result>(),
        t.equal<Constraints, ExpectedConstraints>()
    ]
})

test('reorder arguments' as const, t =>  {
    type Template = { a: number, b: string };

    type $T = From<Template, ['b', 'a']>;


    type Test = apply<$T, ['foo', 1]>
    type Result = { a: 1, b: 'foo' };

    type Constraints = $T['constraints']
    type ExpectedConstraints = [string, number];

    return [
        t.equal<Test, Result>(),
        t.equal<Constraints, ExpectedConstraints>()
    ]
})

test('select 1 argument' as const, t =>  {
    type Template = { a: number, b: string, c: 2 };

    type $T = From<Template, ['b']>;

    type Test = apply<$T, ['foo']>;
    type Result = { a: number, b: 'foo', c: 2 };

    type Constraints = $T['constraints']
    type ExpectedConstraints = [string];

    return [
        t.equal<Test, Result>(),
        t.equal<Constraints, ExpectedConstraints>()
    ]

})

test('args are optional for object of 1 element' as const, t =>  {
    type Template = { a: number };

    type $T = From<Template>;

    type Test = apply<$T, [1]>
    type Result = { a: 1 };

    type Constraints = $T['constraints']
    type ExpectedConstraints = [number];

    return [
        t.equal<Test, Result>(),
        t.equal<Constraints, ExpectedConstraints>()
    ]
})

test('args are optional for tuples of arbitrary lengths' as const, t =>  {
    type Template = [number, string, boolean];

    type $T = From<Template>;

    type Test = apply<$T, [1, 'a', true]>
    type Result = [1, 'a', true];

    type Constraints = $T['constraints']
    type ExpectedConstraints = [number, string, boolean];

    return [
        t.equal<Test, Result>(),
        t.equal<Constraints, ExpectedConstraints>()
    ]
})


test('works on arbitrarily many arguments' as const, t => {
    type A = {a: 1}
    type B = {a: 1, b: 2}
    type C = {a: 1, b: 2, c: 3}
    type D = {a: 1, b: 2, c: 3, d: 4}

    type $A = From<A>
    type $B = From<B, ['a', 'b']>
    type $C = From<C, ['a', 'b', 'c']>
    type $D = From<D, ['a', 'b', 'c', 'd']>

type R = {
    a: string, b: string, c: string, d: string, e: string,
    f: string, g: string, h: string, i: string, j: string,
    k: 11, l: 12, m: 13, n: 14, o: 15, p: 16, q: 17, r: 18
}

type $R = From<R, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']>;
    return [
        t.equal<apply<$A, [1]>, A>(),
        t.equal<apply<$B, [1, 2]>, B>(),
        t.equal<apply<$C, [1, 2, 3]>, C>(),
        t.equal<apply<$D, [1, 2, 3, 4]>, D>(),
        t.equal<
            apply<$R, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']>, {
                a: "1", b: "2", c: "3", d: "4", e: "5", f: "6", g: "7", h: "8", i: "9", j: "10",
                k: 11, l: 12, m: 13, n: 14, o: 15, p: 16, q: 17, r: 18
            }
        >()
    ]
})
