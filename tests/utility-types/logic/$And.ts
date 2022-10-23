import { apply } from 'free-types-core';
import { test } from 'ts-test';

import { $And } from '../../../utility-types/logic/';

test('$And' as const, t => [
    t.equal<apply<$And, [1, 2]>, 2>(),
    t.equal<apply<$And, [1, false]>, false>(),
    t.equal<apply<$And, [false, 2]>, false>(),
    t.equal<apply<$And, [false, false]>, false>(),
])