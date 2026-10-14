import { apply } from 'free-types-core';
import { test } from 'ts-spec';
import { $Choose } from '../../../src/logic';
import { $Gte } from '../../../src/arithmetic';

type $Max = $Choose<$Gte>;

test('$Choose' as const, t => [
    t.equal<apply<$Max, [5, 10]>, 10>(),
])