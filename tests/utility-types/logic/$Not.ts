import { apply } from 'free-types-core';
import { test } from 'ts-spec';
import { $Extends, $Not } from '../../../dist/utility-types/logic/';

type $IsNotString = $Not<$Extends<string>>;

test('$Not' as const, t => [
    t.true<apply<$IsNotString, [2]>>(),
    t.false<apply<$IsNotString, ['foo']>>()
])