import { test } from 'ts-test';
import { Type, apply, partialRight, A, B, C } from 'free-types-core'

interface $Cuboid extends Type<[number, number, number]> {
    type: `H${A<this>} W${B<this>} L${C<this>}`
}

test('partially apply 0 argument' as const, t => [
    t.equal<apply<partialRight<$Cuboid, []>, [1, 2, 3]>, "H1 W2 L3">(),
])

test('partially apply 1 argument' as const, t => [
    t.equal<apply<partialRight<$Cuboid, [3]>, [1, 2]>, "H1 W2 L3">(),
])

test('partially apply 2 arguments' as const, t => [
    t.equal<apply<partialRight<$Cuboid, [2, 3]>, [1]>, "H1 W2 L3">(),
])

test('partially apply all arguments' as const, t => [
    t.equal<apply<partialRight<$Cuboid, [1, 2, 3]>, []>, "H1 W2 L3">(),
    t.equal<apply<partialRight<$Cuboid, [1, 2, 3]>>, "H1 W2 L3">(),
])

test('incrementally apply arguments' as const, t => [
    t.equal<
        apply<
            partialRight<
                partialRight<
                    partialRight<
                        partialRight<
                            $Cuboid,
                        []>,
                    [3]>,
                [2]>,
            [1]>
        >,
        "H1 W2 L3"
    >()
])

{   /* partial type checking */

    // @ts-expect-error: partial type checks 1st arg
    type wrong1stArg = partialRight<$Cuboid, ['3']>

    // @ts-expect-error: partial type checks 2nd arg
    type wrong2ndArg = partialRight<partialRight<$Cuboid, [3]>, ['2']>

    // @ts-expect-error: partial type checks 3rd arg
    type wrong3rdArg = partialRight<partialRight<$Cuboid, [2, 3]>, ['1']>

    // @ts-expect-error: partial can't overshoot
    type tooManyArgs = partialRight<$Cuboid, [1, 2, 3, 4]>

    // @ts-expect-error: partial of partial can't overshoot
    type tooManyArgs2 = partialRight<partialRight<$Cuboid, [4]>, [1, 2, 3]>
}

{   /* apply type checking */

    // @ts-expect-error: `apply` must apply all remaning args
    type missingArg = apply<partialRight<$Cuboid, [3]>, [1]>

    // @ts-expect-error: `apply` type checks remaining args
    type wrong3rdArg = apply<partialRight<$Cuboid, [3]>, [1, '2']>

    // @ts-expect-error: `apply` type checks remaining args (bis)
    type wrong3rdArgBis = apply<partialRight<$Cuboid, [3, 3]>, ['1']>
}

// undefined

type Foo<A extends undefined, B> = [A, B]

interface $Foo extends Type<[undefined, unknown]> {
    type: Foo<A<this>, B<this>>
}

test("`undefined` can be used as a constraint" as const, t => [
    t.equal<apply<$Foo, [undefined, 1]>, [undefined, 1]>(),
    t.equal<apply<partialRight<$Foo, [1]>, [undefined]>, [undefined, 1]>()
])