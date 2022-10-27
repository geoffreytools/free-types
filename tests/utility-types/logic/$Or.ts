import { apply } from 'free-types-core';
import { test } from 'ts-spec';

import { $Or } from '../../../utility-types/logic/';

test('$Or' as const, t => [
    t.equal<apply<$Or, [1, 2]>, 1>(),
    t.equal<apply<$Or, [1, false]>, 1>(),
    t.equal<apply<$Or, [false, 2]>, 2>(),
    t.equal<apply<$Or, [false, false]>, false>(),
])