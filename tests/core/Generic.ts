import { Type, Generic } from 'free-types-core';
import { test } from 'ts-test';

interface $Foo extends Type<[number, string]> {
    type: [this[0], this[1]]
}

test('Generic applies a free type with its type constraints' as const, t =>
    t.equal<Generic<$Foo>, [number, string]>()
)