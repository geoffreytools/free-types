import { apply } from 'free-types-core';
import { test } from 'ts-spec';
import { $Choose } from '../../../utility-types/logic/';
import { $Gte } from '../../../utility-types/arithmetic/';

type $Max = $Choose<$Gte>;

test('$Choose' as const, t => [
    t.equal<apply<$Max, [5, 10]>, 10>(),
])