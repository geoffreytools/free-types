import { apply } from 'free-types-core';
import { test } from 'ts-test';
import { $Intersect } from '../../../utility-types/logic/';

test('$Intersect' as const, t =>
    t.equal<
        apply<$Intersect<{ tag: 'euro' }>, [1]>,
        1 & { tag: 'euro' }
    >(),
)