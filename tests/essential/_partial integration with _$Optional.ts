import { test } from 'ts-spec';
import { Type, apply, A, B, C } from 'free-types-core'
import { _$Optional } from '../../essential/adapters/$Optional';
import { _partial, _ } from '../../essential/_partial';

interface $Cuboid extends Type<[number, number, number]> {
    type: `H${A<this>} W${B<this>} L${C<this>}`
}
type $OptCuboid<
    H extends number | _ = never,
    W extends number | _ = never,
    L extends number | _ = never
> = _$Optional<$Cuboid, [H, W, L]>

test('_partial' as const, t => [
    t.equal<apply<_partial<$OptCuboid<1>, [_]>, [2, 3]>, "H1 W2 L3">(),
    t.equal<apply<_partial<$OptCuboid<1>, [_, _]>, [2, 3]>, "H1 W2 L3">(),
    t.equal<apply<_partial<$OptCuboid<_>, [_, 2]>, [1, 3]>, "H1 W2 L3">(),
    t.equal<apply<_partial<$OptCuboid<_>, [_, 2, _]>, [1, 3]>, "H1 W2 L3">(),
    t.equal<apply<_partial<$OptCuboid<_, 2>, [1]>, [3]>, "H1 W2 L3">(),
    t.equal<apply<_partial<$OptCuboid<_, 2>, [1, _]>, [3]>, "H1 W2 L3">(),
    t.equal<apply<_partial<$OptCuboid<_, _, 3>, [1]>, [2]>, "H1 W2 L3">(),
    t.equal<apply<_partial<$OptCuboid<_, _, 3>, [1, _]>, [2]>, "H1 W2 L3">()
])
