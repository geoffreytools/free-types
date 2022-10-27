import { Type, A, B, C, apply, partial } from 'free-types-core';
import { test } from 'ts-spec';
import { $Optional, $Alter } from '../../../essential/adapters/$Optional';


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