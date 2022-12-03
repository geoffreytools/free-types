import { free } from 'free-types-core';
import { Type, A, unwrap, Unwrapped, Replace } from 'free-types-core';
import { test, _ } from 'ts-spec'

test('unwrap known type' as const, t =>
    t.equal<unwrap<Map<'a', 1>>, Unwrapped<'Map', free.Map, ['a', 1]>>()
)

test('unwrap tuple of any length' as const, t =>
    t.equal<
        unwrap<[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]>,
        Unwrapped<'Tuple', free.Tuple, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]>
    >()
)

test('disambiguate readonly types' as const, t => [
    t.equal<unwrap<Array<'a'>>, Unwrapped<'Array', free.Array, ['a']>>(),
    t.equal<unwrap<readonly 'a'[]>, Unwrapped<'ReadonlyArray', free.ReadonlyArray, ['a']>>(),
    t.equal<unwrap<readonly [1,2,3]>, Unwrapped<'ReadonlyTuple', free.ReadonlyTuple, [1, 2, 3]>>(),
])

// extends known types with module augmentation

class Foo<T> {
    constructor (private value: T) {}
}

interface $Foo extends Type<1> {
    type:  Foo<A<this>>
}

declare module 'free-types-core/dist/TypesMap' {
    interface TypesMap {
      Foo: $Foo
    }
}

test('unwrap type added with module augmentation' as const, t => 
    t.equal<unwrap<Foo<'a'>>, Unwrapped<'Foo', $Foo, ['a']>>()
)

// feed Unwrap with a list of types

class Bar<T> {
    constructor (private value: T) {}
}

interface $Bar extends Type<1> {
    type:  Bar<A<this>>
}

interface CustomMap {
    Bar: $Bar
}

test('unwrap type supplied as a custom map' as const, t => [
    t.equal<unwrap<Bar<'a'>, [$Bar]>, Unwrapped<'0', $Bar, ['a']>>(),
    t.equal<unwrap<Bar<'a'>, { a: $Bar }>, Unwrapped<'a', $Bar, ['a']>>(),
    t.equal<unwrap<Bar<'a'>, CustomMap>, Unwrapped<'Bar', $Bar, ['a']>>()
])

// @ts-expect-error: reject built-ins
type BuiltinsObjRejected = unwrap<Bar<'a'>, Set<1>>

// Replace

test('Replace' as const, t => [
    t.equal<Replace<Map<'a', 1>, ['b', 2]>, Map<'b', 2>>(),
    t.equal<Replace<WeakMap<{a: 1}, 1>, [{b: 2}, 2]>, WeakMap<{b: 2}, 2>>()
])

{
    // @ts-expect-error: Replace args are type checked
    type wrongReplace = Replace<WeakMap<{a: 1}, 1>, ['b', 2]>;
}

{   // Replace as type constraint

    function foo<T extends C, C = Replace<T, [number]>>(_: T) {};
    function bar<T extends C, C = Replace<T, [object, number]>>(_: T) {};

    // OK arity 1
    foo(new Set([1]));

    // OK arity 2
    bar(new WeakMap([[{a: 1}, 1]]))

    // @ts-expect-error: Replace as type constraint arity 1
    const wrongInnerValueSet = foo(new Set('a'))
    
    // @ts-expect-error: Replace as type constraint arity 2
    const wrongInnerValueWeakMap = bar(new WeakMap([[{a: 1}, 'a']]))
    
}