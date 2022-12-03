import { test } from 'ts-spec';
import { apply} from 'free-types-core';
import { $Head, $Tail, $Last, $Init, $Concat } from '../../dist/utility-types/tuples';

test('$Head' as const, t =>
    t.equal<apply<$Head, [[1,2,3]]>, 1>()
)

test('$Tail' as const, t =>
    t.equal<apply<$Tail, [[1,2,3]]>, [2, 3]>()
)

test('$Last' as const, t =>
    t.equal<apply<$Last, [[1,2,3]]>, 3>()
)

test('$Init' as const, t =>
    t.equal<apply<$Init, [[1,2,3]]>, [1, 2]>()
)

test('$Concat' as const, t =>[
    t.equal<apply<$Concat, [[1,2], [3, 4]]>, [1, 2, 3, 4]>(),
    t.equal<apply<$Concat, [[1,2], 3]>, [1, 2, 3]>(),
    t.equal<apply<$Concat, [1, [2, 3, 4]]>, [1, 2, 3, 4]>(),
    t.equal<apply<$Concat, [1, 2]>, [1, 2]>(),
    t.equal<apply<$Concat, [[], []]>, []>(),
    t.equal<apply<$Concat, [[1], []]>, [1]>(),
    t.equal<apply<$Concat, [[], [2]]>, [2]>()
])

test('$Concat signature' as const, t =>[
    t.equal<$Concat['constraints'], [unknown, unknown]>(),
    t.equal<$Concat['type'], unknown[]>(),
])