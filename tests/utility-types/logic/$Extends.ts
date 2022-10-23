import { apply } from 'free-types-core';
import { test } from 'ts-test';
import { $Extends } from '../../../utility-types/logic/';

test('$Extends' as const, t => [
    t.true<apply<$Extends<string>, ['foo']>>(),
    t.false<apply<$Extends<string>, [2]>>()
])