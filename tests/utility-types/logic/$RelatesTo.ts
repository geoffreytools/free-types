import { apply } from 'free-types-core';
import { test } from 'ts-spec';
import { $RelatesTo } from '../../../utility-types/logic/';

test('$RelatesTo' as const, t => [
    t.true<apply<$RelatesTo<string>, ['foo']>>(),
    t.true<apply<$RelatesTo<'foo'>, [string]>>(),
    t.false<apply<$RelatesTo<string>, [number]>>()
])