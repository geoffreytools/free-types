import { apply } from 'free-types-core';
import { test } from 'ts-spec';
import { $Choose } from 'src/utility-types/logic/';
import { $Gte } from 'src/utility-types/arithmetic/';

type $Max = $Choose<$Gte>;

test('$Choose' as const, t => [
    t.equal<apply<$Max, [5, 10]>, 10>(),
])