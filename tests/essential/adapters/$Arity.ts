import { test } from 'ts-test';
import { Type, apply } from 'free-types-core';
import { $Arity } from '../../../essential/adapters/$Arity';

interface $FirstArg extends Type { type: this['arguments'][0] }

type $FirstArgOf2 = $Arity<2, $FirstArg>;

test('$Arity sets the arity' as const, t =>
    t.equal<$FirstArgOf2['constraints']['length'], 2>()
)

/* use case */

type Foo<$T extends Type<2>> = apply<$T, [1, 2]>;

// @ts-expect-error: control (Type doesn't extend Type<2>)
type Rejected = Foo<$FirstArg>

// $Arity sets the arity
type Accepted = Foo<$FirstArgOf2>
