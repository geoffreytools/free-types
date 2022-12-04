import { test } from 'ts-spec';
import { Type, apply } from 'free-types-core';
import { $Arity } from '../../../essential/adapters/$Arity';

interface $FirstArg extends Type { type: this['arguments'][0] }
interface $OptionalArg extends Type<[unknown, unknown?]> { type: this['arguments'][1] }

type $FirstArgOf2 = $Arity<2, $FirstArg>;
type $OptionalArgOf2 = $Arity<2, $OptionalArg>;

test('$Arity sets the arity' as const, t => [
    t.equal<$FirstArgOf2['constraints']['length'], 2>(),
    t.equal<$OptionalArgOf2['constraints']['length'], 2>(),
])

/* use case */

type Foo<$T extends Type<2>> = apply<$T, [1, 2]>;

// @ts-expect-error: control (Type doesn't extend Type<2>)
type Rejected = Foo<$FirstArg>

// @ts-expect-error: control (Type doesn't extend Type<2>)
type Rejected2 = Foo<$OptionalArg>

// $Arity sets the arity
type Accepted = Foo<$FirstArgOf2>

// $Arity sets the arity
type Accepted2 = Foo<$OptionalArgOf2>