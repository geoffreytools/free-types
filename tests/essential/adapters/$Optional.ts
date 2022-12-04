import { Type, A, B, C, apply, partial, Optional } from 'free-types-core';
import { test } from 'ts-spec';
import { $Optional, _$Optional, $Alter, _ } from '../../../essential';


interface $Box3 extends Type<[number, number, number]> {
    type: `${A<this>} x ${B<this>} x ${C<this>}`
}

type $Box<
    A extends number = never,
    B extends number = never
> = $Optional<$Box3, [A, B]>

// @ts-expect-error: Generics must match the type constraints
type $Rejected<A = never> = $Optional<$Box3, [A]>

test('$Optional' as const, t => [
    t.equal<apply<$Box<1>, [2, 3]>, '1 x 2 x 3'>(),
    t.equal<apply<$Box<1, 2>, [3]>, '1 x 2 x 3'>(),
    t.equal<apply<partial<$Box<1>, [2]>, [3]>, '1 x 2 x 3'>(),
])

test('$Optional and optional parameter' as const, t => {
    interface $OptionalBox3 extends Type<[number, number, number?]> {
        type: `${A<this>} x ${B<this>} x ${Optional<C, this>}`
    }

    type $OptionalBox<A extends number = never, B extends number = never> =
        $Optional<$OptionalBox3, [A, B]>;
    
    return [
        t.equal<$OptionalBox<1, 2>['constraints'], [(number | undefined)?]>(),
        t.equal<apply<$OptionalBox<1>, [2]>, `1 x 2 x ${number}`>(),
        t.equal<apply<$OptionalBox<1, 2>>, `1 x 2 x ${number}`>(),
        t.equal<apply<$OptionalBox<1, 2>, [3]>, `1 x 2 x 3`>()
    ]
})

test('_$Optional with default value and reordering' as const, t => {
    interface $OptionalBox3 extends Type<[number, number, number?]> {
        type: `${A<this>} x ${B<this>} x ${Optional<C, this, B<this>>}`
    }

    type $OptionalBox<A extends number = never, B extends number = never> =
        _$Optional<$OptionalBox3, [A, _, B]>;

    return [
        t.equal<apply<$OptionalBox<1, 3>, [2]>, `1 x 2 x 3`>(),
        t.equal<apply<$OptionalBox<1>, [2, 3]>, `1 x 2 x 3`>(),
        t.equal<apply<$OptionalBox<1>, [2]>, `1 x 2 x 2`>()
    ]
})

/* edge case */

// this should not error
type Inspect$BoxConstraints<A extends number, B extends number> =
    $Box<A, B>['constraints']

/* full application */

type $BoxFull<
    A extends number = never,
    B extends number = never,
    C extends number = never
> = $Alter<$Box3, [A, B, C]>

test('setting Evaluate to `true` enables fully applying with generics' as const, t =>
    t.equal<$BoxFull<1, 2, 3>, '1 x 2 x 3'>()
)