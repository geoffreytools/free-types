import { apply } from 'free-types-core';
import { test } from 'ts-spec';
import { $Includes } from '../../../src/logic';

test('$Includes' as const, t => [
    t.true<apply<$Includes<'foo'>, [string]>>(),
    t.false<apply<$Includes<'foo'>, [number]>>()
])