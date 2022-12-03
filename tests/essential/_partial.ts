import { test } from 'ts-spec';
import { Type, apply, A, B, C } from 'free-types-core'
import { _, _partial } from '../../dist/essential/_partial';
import { _$Optional } from '../../dist/essential/adapters/$Optional';

interface $Cuboid extends Type<[number, number, number]> {
    type: `H${A<this>} W${B<this>} L${C<this>}`
}

test('partially apply 0 argument' as const, t => [
    t.equal<apply<_partial<$Cuboid, [_]>, [1, 2, 3]>, "H1 W2 L3">(),
    t.equal<apply<_partial<$Cuboid, [_, _]>, [1, 2, 3]>, "H1 W2 L3">(),
    t.equal<apply<_partial<$Cuboid, [_, _, _]>, [1, 2, 3]>, "H1 W2 L3">(),
])

test('partially apply 1 argument' as const, t => [
    t.equal<apply<_partial<$Cuboid, [1]>, [2, 3]>, "H1 W2 L3">(),
    t.equal<apply<_partial<$Cuboid, [1, _]>, [2, 3]>, "H1 W2 L3">(),
    t.equal<apply<_partial<$Cuboid, [1, _, _]>, [2, 3]>, "H1 W2 L3">(),
    t.equal<apply<_partial<$Cuboid, [_, 2]>, [1, 3]>, "H1 W2 L3">(),
    t.equal<apply<_partial<$Cuboid, [_, 2, _]>, [1, 3]>, "H1 W2 L3">(),
    t.equal<apply<_partial<$Cuboid, [_, _, 3]>, [1, 2]>, "H1 W2 L3">(),
])

test('partially apply 2 arguments' as const, t => [
    t.equal<apply<_partial<$Cuboid, [1, 2]>, [3]>, "H1 W2 L3">(),
    t.equal<apply<_partial<$Cuboid, [1, 2, _]>, [3]>, "H1 W2 L3">(),
    t.equal<apply<_partial<$Cuboid, [1, _, 3]>, [2]>, "H1 W2 L3">(),
    t.equal<apply<_partial<$Cuboid, [_, 2, 3]>, [1]>, "H1 W2 L3">(),
])

test('partially apply all arguments' as const, t => [
    t.equal<apply<_partial<$Cuboid, [1, 2, 3]>, []>, "H1 W2 L3">(),
    t.equal<apply<_partial<$Cuboid, [1, 2, 3]>>, "H1 W2 L3">(),
])

test('incrementally apply arguments' as const, t => [
    t.equal<
        apply<_partial<_partial<_partial<_partial<$Cuboid, []>, [1]>, [2]>, [3]>>,
        "H1 W2 L3"
    >()
])

{   /* partial type checking */

    // @ts-expect-error: _partial type checks 1st arg
    type wrong1stArg = _partial<$Cuboid, ['1']>

    // @ts-expect-error: _partial type checks 2nd arg
    type wrong2ndArg = _partial<$Cuboid, [_, '2']>

    // @ts-expect-error: _partial type checks 3rd arg
    type wrong3rdArg = _partial<$Cuboid, [_, _, '3']>

    // @ts-expect-error: partial can't overshoot
    type tooManyArgs = _partial<$Cuboid, [1, 2, 3, 4]>

    // @ts-expect-error: partial of partial can't overshoot
    type tooManyArgs2 = _partial<_partial<$Cuboid, [1]>, [2, 3, 4]>

}

{   /* apply type checking */

    // @ts-expect-error: `apply` must apply all remaning args
    type missingArg = apply<_partial<$Cuboid, [_, 2]>, [1]>

    // @ts-expect-error: `apply` type checks remaining args (_)
    type wrong3rdArg_ = apply<_partial<$Cuboid, [_, 2]>, [1, '3']>

    // @ts-expect-error: `apply` type checks remaining args (1)
    type wrong3rdArg2 = apply<_partial<$Cuboid, [1, 2]>, ['3']>

    // @ts-expect-error: `apply` type checks remaining args (2)
    type wrong3rdArg1 = apply<_partial<$Cuboid, [1]>, [2, '3']>

    // @ts-expect-error: `apply` type checks remaining args (3)
    type wrong3rdArg0 = apply<_partial<$Cuboid, []>, [1, 2, '3']>
}