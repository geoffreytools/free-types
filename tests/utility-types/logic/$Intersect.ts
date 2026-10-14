import { apply } from 'free-types-core';
import { test } from 'ts-spec';
import { $Intersect } from '../../../src/logic';

test('$Intersect' as const, t =>
    t.equal<
        apply<$Intersect<{ tag: 'euro' }>, [1]>,
        1 & { tag: 'euro' }
    >(),
)