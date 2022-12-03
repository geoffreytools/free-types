import { apply } from 'free-types-core';
import { test } from 'ts-spec';
import { $Choose } from '../../../dist/utility-types/logic/';
import { $Gte } from '../../../dist/utility-types/arithmetic/';

type $Max = $Choose<$Gte>;

test('$Choose' as const, t => [
    t.equal<apply<$Max, [5, 10]>, 10>(),
])