import { test } from 'ts-spec'
import { apply } from 'free-types-core'
import { FromDeep } from '../../dist/experimental/FromDeep'

test('nested tuples' as const, t => {
    type Template = [
        [number, boolean],
        [number, boolean, string]
    ];

    type $T = FromDeep<Template, [[1, 2]]>;

    // @ts-expect-error: type check path
    {type $T = FromDeep<Template, [[1, 3]]>;}

    type Constraints = [...$T['constraints']]
    type ExpectedConstraints = [string]

    type Tested = apply<$T, ['foo']>
    type Result = [[number, boolean], [number, boolean, "foo"]];

    return [
        t.equal<Tested, Result>(),
        t.equal<Constraints, ExpectedConstraints>(),
    ];
});

test('nested objects' as const, t => {
    type Template = {
        foo: { a: string },
        bar: { a: string }
    };

    type $T = FromDeep<Template, [['foo', 'a']]>;

    // @ts-expect-error: type check path
    {type $T = FromDeep<Template, [['foo', 'b']]>;}

    type Constraints = [...$T['constraints']]
    type ExpectedConstraints = [string]

    type Tested = apply<$T, ['foo']>
    type Result = { foo: { a: 'foo' }, bar: { a: string } };

    return [
        t.equal<Tested, Result>(),
        t.equal<Constraints, ExpectedConstraints>(),
    ];
});

test('Mixed objects and tuples' as const, t => {
    type Template<T = number> = {
        a: {
            foo: [T, string],
            bar: boolean
        }
    };
    type $T = FromDeep<Template, [['a', 'foo', 0]]>

    // @ts-expect-error: type check path
    {type $T = FromDeep<Template, [['a', 'foo', [2]]]>;}

    type Constraints = [...$T['constraints']]
    type ExpectedConstraints = [number]

    type Tested = apply<$T, [1]>;
    type Result = Template<1>

    return [
        t.equal<Tested, Result>(),
        t.equal<Constraints, ExpectedConstraints>(),
    ];
});

test('nested objects, multiple depths' as const, t => {
    type Template<T = number, U = number> = {
        a: T
        callback: { foo: U }
    };

    type $T = FromDeep<Template, ['a', ['callback', 'foo']]>

    // @ts-expect-error: type check path
    {type $T = FromDeep<Template, [['a', 'foo', [2]]]>;}

    type Constraints = [...$T['constraints']]
    type ExpectedConstraints = [number, number]

    type Tested = apply<$T, [1, 2]>;
    type Result = Template<1, 2>

    return [
        t.equal<Tested, Result>(),
        t.equal<Constraints, ExpectedConstraints>(),
    ];
})

test('mixed multiple arguments' as const, t => {
    type Template<T = number, U = string> = {
        a: {
            foo: [T, string],
            bar: boolean
        }
        b: {
            bibi: [number, U],
            bobo: boolean
        }
    };

    type $T = FromDeep<Template, [
        ['a', 'foo', 0],
        ['b', 'bibi', 1]
    ]>

    // @ts-expect-error: type check path
    {type $T = FromDeep<Template, [['a', 'foo', [2]]]>;}

    type Constraints = [...$T['constraints']]
    type ExpectedConstraints = [number, string]

    type Tested = apply<$T, [1, 'hello']>;
    type Result = Template<1, 'hello'>

    return [
        t.equal<Tested, Result>(),
        t.equal<Constraints, ExpectedConstraints>(),
    ];
});
