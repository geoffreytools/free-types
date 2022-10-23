import { test } from 'ts-test';
import { Type, apply, partial, A, B, C } from 'free-types-core'

interface $Cuboid extends Type<[number, number, number]> {
    type: `H${A<this>} W${B<this>} L${C<this>}`
}

test('partially apply 0 argument' as const, t => [
    t.equal<apply<partial<$Cuboid, []>, [1, 2, 3]>, "H1 W2 L3">(),
])

test('partially apply 1 argument' as const, t => [
    t.equal<apply<partial<$Cuboid, [1]>, [2, 3]>, "H1 W2 L3">(),
])

test('partially apply 2 arguments' as const, t => [
    t.equal<apply<partial<$Cuboid, [1, 2]>, [3]>, "H1 W2 L3">(),
])

test('partially apply all arguments' as const, t => [
    t.equal<apply<partial<$Cuboid, [1, 2, 3]>, []>, "H1 W2 L3">(),
    t.equal<apply<partial<$Cuboid, [1, 2, 3]>>, "H1 W2 L3">(),
])

test('incrementally apply arguments' as const, t => [
    t.equal<
        apply<partial<partial<partial<partial<$Cuboid, []>, [1]>, [2]>, [3]>>,
        "H1 W2 L3"
    >()
])

{   /* partial type checking */

    // @ts-expect-error: partial type checks 1st arg
    type wrong1stArg = partial<$Cuboid, ['1']>

    // @ts-expect-error: partial type checks 2nd arg
    type wrong2ndArg = partial<partial<$Cuboid, [1]>, ['2']>

    // @ts-expect-error: partial type checks 3rd arg
    type wrong3rdArg = partial<partial<$Cuboid, [1, 2]>, ['3']>

    // @ts-expect-error: partial can't overshoot
    type tooManyArgs = partial<$Cuboid, [1, 2, 3, 4]>

    // @ts-expect-error: partial of partial can't overshoot
    type tooManyArgs2 = partial<partial<$Cuboid, [1]>, [2, 3, 4]>
}

{   /* apply type checking */

    // @ts-expect-error: `apply` must apply all remaning args
    type missingArg = apply<partial<$Cuboid, [1]>, [2]>

    // @ts-expect-error: `apply` type checks remaining args
    type wrong3rdArg = apply<partial<$Cuboid, [1]>, [2, '3']>

    // @ts-expect-error: `apply` type checks remaining args (bis)
    type wrong3rdArgBis = apply<partial<$Cuboid, [1, 2]>, ['3']>
}

// undefined

type Foo<A extends undefined, B> = [A, B]

interface $Foo extends Type<[undefined, unknown]> {
    type: Foo<A<this>, B<this>>
}

test("`undefined` can be used as a constraint" as const, t => [
    t.equal<apply<$Foo, [undefined, 1]>, [undefined, 1]>(),
    t.equal<apply<partial<$Foo, [undefined]>, [1]>, [undefined, 1]>()
])