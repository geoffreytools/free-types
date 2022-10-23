import { test } from 'ts-test';
import { Foo } from 'foo/Foo-interface'

test('control' as const, t => [
    t.equal<Foo<'T1', 1>, [0, 1]>(),
    t.equal<Foo<'T2', 1>, [0, 1, '2']>(),
    // This should not be allowed
    t.equal<Foo<'Id', 0>, [0, ...any[]]>()
])