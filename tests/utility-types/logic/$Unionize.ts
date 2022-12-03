import { apply } from 'free-types-core';
import { test } from 'ts-spec';
import { $Unionize } from '../../../dist/utility-types/logic/';

test('$Unionize' as const, t =>
    t.equal<
        apply<$Unionize, [1, 2]>,
        1 | 2
    >(),
)