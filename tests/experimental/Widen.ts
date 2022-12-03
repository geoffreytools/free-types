import { Type } from '../..';
import { test, _ } from 'ts-spec'
import { Widen } from '../../dist/experimental/Widen';

test('basic types' as const, t => [
    t.equal<Widen<1>, number>(),
    t.equal<Widen<'a'>, string>(),
    t.equal<Widen<true>, boolean>()
])

test('array types' as const, t => [
    t.equal<Widen<['a', 2, true]>, [string, number, boolean]>(),
    t.equal<Widen<('a' | 2 | true)[]>, (string | number | boolean)[]>()
])

test('object type' as const, t =>
    t.equal<
        Widen<{ a: 'a', b: 2, c: true }>,
        { a: string, b: number, c: boolean }
    >()
)

test('built-in types' as const, t => [
    t.equal<Widen<Set<1>>, Set<number>>(),
    t.equal<Widen<Set<'a'>>, Set<string>>(),
    t.equal<Widen<Set<true>>, Set<boolean>>(),
])

test('deep types' as const, t =>
    t.equal
        <Widen<['a', { b: 2, c: Set<[true, Promise<1>]> }]>,
        [string, { b: number, c: Set<[boolean, Promise<number>]> }]
    >()
)

test('tagged primitives types' as const, t =>
    t.equal<Widen<4 & { tag: 'foo' }>, number & { tag: 'foo' }>()
)

test('tagged types' as const, t => {
    type Bar<T> = { _tag: 'bar', value: T };
    type Qux<T> = { _tag: 'qux', value: T };

    return [
        t.equal<Widen<Bar<'a'>>, Bar<string>>(),
        t.equal<Widen<Qux<2>>, Qux<number>>(),
        t.not.equal<Widen<Bar<'a'>>, Widen<Qux<'a'>>>()
    ];
})


test('custom classes' as const, t => {
    class Foo<T> { constructor (private v: T){} }
    interface $Foo extends Type<1> { type:Foo<this[0]> }

    return [
        t.equal<Widen<Foo<1>, [$Foo]>, Foo<number>>(),
        t.equal<Widen<Foo<'a'>, [$Foo]>, Foo<string>>(),
        t.equal<Widen<Foo<true>, [$Foo]>, Foo<boolean>>()
    ];
})


test('custom classes with narrow constraints' as const, t => {
    class Bibi<T extends 1 | 2> { constructor (private v: T){} }
    interface $Bibi extends Type<[1 | 2]> {
        type: this[0] extends this['constraints'][0] ? Bibi<this[0]> : never
    }

    class Bobo<T extends 'a' | 'b'> { constructor (private v: T){} }
    interface $Bobo extends Type<['a' | 'b']> {
        type: this[0] extends this['constraints'][0] ? Bobo<this[0]> : never
    }

    class Bubu<T extends 'a' | true> { constructor (private v: T){} }
    interface $Bubu extends Type<['a' | true]> {
        type: this[0] extends this['constraints'][0] ? Bubu<this[0]> : never
    }

    return [
        t.equal<Widen<Bibi<1>, [$Bibi]>, Bibi<1 | 2>>(),
        t.equal<Widen<Bobo<'a'>, [$Bobo]>, Bobo<'a' | 'b'>>(),
        t.equal<Widen<Bubu<true>, [$Bubu]>, Bubu<true | 'a'>>()
    ];
})