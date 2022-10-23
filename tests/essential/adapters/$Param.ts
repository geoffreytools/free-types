import { apply, free } from 'free-types-core';
import { test } from 'ts-test';
import { $Param } from '../../../essential/adapters/$Param';

test('$Param turns Type<1> to a Type<N> focused on A' as const, t =>
    t.equal<apply<$Param<0, free.Id>, [1, 2]>, 1>()
)