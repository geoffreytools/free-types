import { apply } from 'free-types-core';
import { test } from 'ts-test';
import { $Extends, $Not } from '../../../utility-types/logic/';

type $IsNotString = $Not<$Extends<string>>;

test('$Not' as const, t => [
    t.true<apply<$IsNotString, [2]>>(),
    t.false<apply<$IsNotString, ['foo']>>()
])