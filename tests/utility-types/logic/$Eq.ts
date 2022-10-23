import { apply } from 'free-types-core';
import { test } from 'ts-test';
import { $Eq } from '../../../utility-types/logic/';

type $Is1 = $Eq<1>;

test('$Eq' as const, t => [
    t.true<apply<$Is1, [1]>>(),
    t.false<apply<$Is1, [2]>>()
])