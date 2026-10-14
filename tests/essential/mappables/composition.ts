import { test } from 'ts-spec'
import { A, apply, B, free, Last, Type } from 'core'
import { Pipe, Flow } from 'free-types-core';
import { $Prop } from 'mappables/accessors'
import { $Fold } from 'mappables/Fold'
import { $MapOver } from 'mappables/MapOver'
import { $Filter } from 'mappables/Filter'
import { $Reduce } from 'mappables/Reduce'
import { $Add, $Next } from '../../../src/arithmetic'

import * as Tuple from 'essential/Tuple'
import { Refinement } from '../../../logic'
import { Filter } from 'mappables/Filter'

type TupleInput = [{ value: 1 }, { value: 2 }]
type TupleMixedInput = [{ value: 1 }, {value: 'a'}, { value: 2 }, {value: 'b'}]
type ObjInput = { a: { value: 1 }, b: { value: 2 } }

interface $Exclaim extends Type<[number]> {
    type: `${A<this>}!`
}
// @ts-expect-error: wrong composition is rejected
type Rejected = Pipe<[TupleInput], $MapOver<$Prop<'value'>>, $MapOver<$Exclaim>, $Reduce<$Add>>;

type Ok = Pipe<[[{ value: 1 }, { value: 2 }]], $MapOver<$Prop<'value'>>, $Reduce<$Add>, $Exclaim>;


test('Pipe higher order types composition' as const, t => [
    t.equal<Pipe<[TupleInput], $MapOver<$Prop<'value'>>, $Reduce<$Add>>, 3>(),
    t.equal<Pipe<[ObjInput], $MapOver<$Prop<'value'>>, $Reduce<$Add>>, 3>(),
    t.equal<Pipe<[TupleInput], $MapOver<$Prop<'value'>>, $Reduce<$Add>>, 3>(),
    t.equal<Pipe<[ObjInput], $MapOver<$Prop<'value'>>, $Reduce<$Add>>, 3>(),
])

type $MapOver_$Fold = Flow<[
    $MapOver<$Prop<'value', number>>,
    $Fold<$Add, 0>
]>

type Tuple_$MapOver_$Fold = Flow<[
    Tuple.$MapOver<$Prop<'value', number>>,
    Tuple.$Fold<$Add, 0>
]>;

// test that Filter narrows types and is otherwise composable with MapOver
type Tuple_$Filer_$Map_$Fold = Flow<[
    Tuple.$MapOver<$Prop<'value'>>,
    Tuple.$Filter<Refinement.$Extends<number>>,
    Tuple.$MapOver<$Next>,
    Tuple.$Fold<$Add, 0>
]>

// test('Pipe with generic', t => {
//     const foo = <T extends readonly { value: number | string }[]>() =>
//         t.equal<
//             Pipe<[T],
//                 Tuple.$MapOver<$Prop<'value'>>,
//                 Tuple.$Filter<number>,
//                 Tuple.$MapOver<$Next>,
//                 Tuple.$Fold<$Add, 0>
//             >, 0
//         >()

//     return foo();
// })

// handle generic inputs

// Filter in Pipe compiles : direct input
type Gen<Ts extends string[]> = Pipe<
    // we need an annotation to make the generic concrete
    [Tuple.Filter<Ts, Last<Ts> | `$${string}`, string>], 
    Tuple.$MapOver<$NormaliseSegment>,
    Tuple.$Fold<$CamelCase, 'get'>
>

// Filter in Pipe compiles: undirect input
type GenT2<Ts extends string[]> = Pipe<
    [Ts],
    // we need an annotation to make the generic concrete
    Tuple.$Filter<Last<Ts> | `$${string}`, string>,
    Tuple.$MapOver<$NormaliseSegment>,
    Tuple.$Fold<$CamelCase, 'get'>
>

type Gen2<Nums extends number[]> = Pipe<
    [Nums],
    $Filter<Last<Nums> | 10, number>,
    $MapOver<$Next>
>

type FlowT2 = Flow<[
    Tuple.$Filter<number>,
    Tuple.$MapOver<$Next>,
]>

type Flow2 = Flow<[
    $Filter<number>,
    $MapOver<$Next>,
]>

type FlowGen2<T extends (number | string)[]> = Pipe<
    [T],
    $Filter<number>,
    $MapOver<$Next>
>

type FlowTGen2<T extends (number | string)[]> = Pipe<
    [T],
    Tuple.$Filter<number>,
    Tuple.$MapOver<$Next>
>

// Check model
type Gen3<Ts extends string[]> = Pipe<
    [Ts],
    // @ts-expect-error: the annotation is type checked
    Tuple.$Filter<Last<Ts> | `$${string}`, 'hello'>,
    Tuple.$MapOver<$NormaliseSegment>,
    Tuple.$Fold<$CamelCase, 'get'>
>

type GenBase<Ts extends string[]> = Pipe<
    [Filter<Ts, Last<Ts> | `$${string}`, string>], 
    $MapOver<$NormaliseSegment>,
    $Fold<$CamelCase, 'get'>
>

type FlowBase<Ts extends string[]> = Flow<[
    $Filter<Last<Ts> | `$${string}`, string>, 
    $MapOver<$NormaliseSegment>,
    $Fold<$CamelCase, 'get'>
]>

type GenBase2<Ts extends string[]> = Pipe<
    [Ts],
    // $Filter<Last<Ts> | `$${string}`, string>, 
    $MapOver<$NormaliseSegment>,
    $Fold<$CamelCase, 'get'>
>

type Wrong<Ts extends string[]> = Pipe<
    // @ts-expect-error: wrong composition
    [Filter<Ts, Last<Ts> | `$${string}`>], 
    $NormaliseSegment,
    $Fold<$CamelCase, 'get'>
>
type Wrong2<Ts extends number[]> = Pipe<
    [Ts],
    Tuple.$MapOver<$Next>,
    // @ts-expect-error: expects a string
    Tuple.$Fold<$CamelCase, 'get'>
>

interface $NormaliseSegment extends Type<[string], string> {
    type: A<this> extends `$${infer I}` ? I : A<this> 
}

type CamelCase<A extends string, B extends string> =
    string extends A ? string
    : `${A}${Uppercase<Str.Head<B>>}${Str.Tail<B>}`

interface $CamelCase extends Type<[string, string], string> {
    type: CamelCase<A<this>, B<this>>
}

namespace Str {
    export type Head<T extends string> =
        string extends T ? string
        : T extends `${infer A}${string}` ? A : never;
    
    export type Tail<T extends string> = 
        string extends T ? string
        : T extends `${string}${infer A}` ? A : never;
}

// test('Return type of composition resolves to a value even with generics', t => (
//     <T extends (number | string)[]>() => t.equal<
//         number[],
//         Tuple.Filter<T, Refinement.$Extends<number>>
        
//     >()
// )())

test('Flow higher order types composition' as const, t => [
    t.equal<apply<$MapOver_$Fold, [TupleInput]>, 3>(),
    t.equal<apply<$MapOver_$Fold, [ObjInput]>, 3>(),
    t.equal<apply<Tuple_$MapOver_$Fold, [TupleInput]>, 3>(),
    t.equal<apply<Tuple_$Filer_$Map_$Fold, [TupleMixedInput]>, 5>(),
])

test('Pipe higher order types composition with Tuple' as const, t => [
    t.equal<Pipe<[TupleInput], Tuple.$MapOver<$Prop<'value'>>, Tuple.$Reduce<$Add>>, 3>(),
    t.equal<Pipe<[TupleInput], Tuple.$MapOver<$Prop<'value'>>, Tuple.$Reduce<$Add>>, 3>(),
])