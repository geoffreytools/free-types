import { test } from 'ts-spec';
import { Type, apply, partial,partialRight, A, B, C } from 'free-types-core'
import { $Optional } from '../../../dist/essential/adapters/$Optional';

interface $Cuboid extends Type<[number, number, number]> {
    type: `H${A<this>} W${B<this>} L${C<this>}`
}
type $OptCuboid<
    H extends number = never,
    W extends number = never,
    L extends number = never
> = $Optional<$Cuboid, [H, W, L]>

test('partial' as const, t => [
    t.equal<apply<partial<$OptCuboid<1>, []>, [2, 3]>, "H1 W2 L3">(),
    t.equal<apply<partial<$OptCuboid<1>, [2, 3]>>, "H1 W2 L3">(),
    t.equal<apply<partial<$OptCuboid<1>, [2]>, [3]>, "H1 W2 L3">(),
    t.equal<apply<partial<$OptCuboid<1, 2>, []>, [3]>, "H1 W2 L3">(),
    t.equal<apply<partial<$OptCuboid<1, 2>, [3]>>, "H1 W2 L3">(),
])


test('partialRight' as const, t => [
    t.equal<apply<partialRight<$OptCuboid<1>, []>, [2, 3]>, "H1 W2 L3">(),
    t.equal<apply<partialRight<$OptCuboid<1>, [2, 3]>>, "H1 W2 L3">(),
    t.equal<apply<partialRight<$OptCuboid<1>, [3]>, [2]>, "H1 W2 L3">(),
    t.equal<apply<partialRight<$OptCuboid<1, 2>, []>, [3]>, "H1 W2 L3">(),
    t.equal<apply<partialRight<$OptCuboid<1, 2>, [3]>>, "H1 W2 L3">(),
])