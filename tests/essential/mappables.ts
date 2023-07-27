import { test } from 'ts-spec'
import { A, apply, B, C, partial, Type, $Const } from '../../core'
import { Flow } from '../../essential/composition/Flow'
import { Pipe } from '../../essential/composition/Pipe'
import { $Index, $Prop, $SetIndex, $SetProp } from '../../essential/mappables/accessors'
import { Ap } from '../../essential/mappables/Ap'
import { $Fold, Fold } from '../../essential/mappables/Fold'
import { Lift } from '../../essential/mappables/Lift'
import { $MapOver, MapOver } from '../../essential/mappables/MapOver'
import { $Reduce, Reduce } from '../../essential/mappables/Reduce'
import { Add } from '../../essential/utils'
import { $Add, $Next } from '../../utility-types/arithmetic'
import { $Stitch } from '../../utility-types/strings/$Stitch'

test('MapOver works on tuples' as const, t => 
    t.equal<MapOver<[1,2,3], $Next>, [2,3,4]>()
)

test('MapOver works on readonly tuples' as const, t => 
    t.equal<MapOver<readonly [1,2,3], $Next>, readonly [2,3,4]>()
)

test('MapOver works on arrays' as const, t => 
    t.equal<MapOver<(1|2|3)[], $Next>, (2|3|4)[]>()
)

test('MapOver works on readonly arrays' as const, t => 
    t.equal<MapOver<readonly (1|2|3)[], $Next>, readonly (2|3|4)[]>()
)

test('MapOver preserves tupleness' as const, t => 
    t.equal<[...MapOver<[1,2,3], $Next>], [2,3,4]>()
)

test('MapOver preserves optional array elements' as const, t => [
    t.equal<[...MapOver<[1,2?,3?], $Next>], [2,3?,4?]>(),
    t.equal<[...MapOver<readonly [1,2?,3?], $Next>], [2,3?,4?]>()
])

test('MapOver works on objects' as const, t => 
    t.equal<MapOver<{a: 1, b: 2}, $Next>, {a: 2, b: 3}>()
)

test('MapOver preserves optional fields' as const, t => 
    t.equal<MapOver<{a?: 1, b?: 2}, $Next>, {a?: 2, b?: 3}>()
)

type $123 = MapOver<[1,2,3], $Const>;
type $abc = MapOver<{ a: 1, b: 2, c: 3 }, $Const>;

test('Ap works on tuples' as const, t => 
    t.equal<Ap<$123, [0, 0, 0]>, [1,2,3]>(),
)

test('Ap preserves tupleness' as const, t => 
    t.equal<[...Ap<$123, [0, 0, 0]>], [1,2,3]>(),
)

test('Ap works on objects' as const, t => 
    t.equal<Ap<$abc, { a: 0, b: 0, c: 0 }>, { a: 1, b: 2, c: 3 }>()
)

test('Reduce works on tuples' as const, t => [
    t.equal<Reduce<[1], $Add>, 1>(),
    t.equal<Reduce<[1, 2], $Add>, 3>(),
    t.equal<Reduce<[1, 2, 3], $Add>, 6>(),
    t.equal<Reduce<[1, 2, 3, 4], $Add>, 10>(),
])


// procedural type checking can be turned off
type Foo<T extends [number, ...number[]]> = Reduce<T, $Add, unknown>;
//                                                 -        -------


test('Reducer output can be a subtype of the input' as const, t => [
    t.equal<Reduce<['a', 2, true], $Stitch<':'>>, 'a:2:true'>(),
])

{
    // @ts-expect-error: Reduce/tuple type checking
    type Wrong1 = Reduce<['a'], $Add>

    // @ts-expect-error: Reduce/tuple type checking
    type Wrong2 = Reduce<['a', 1], $Add>

    // @ts-expect-error: Reduce/tuple type checking
    type Wrong3 = Reduce<[1, 'b'], $Add>
}

// @ts-expect-error: Reduce/tuple: input must not be empty
type EmptyTupleError = Reduce<[], $Add>

test('Reduce works on objects' as const, t => [
    t.equal<Reduce<{a: 1}, $Add>, 1>(),
    t.equal<Reduce<{a: 1, b: 2}, $Add>, 3>(),
    t.equal<Reduce<{a: 1, b: 2, c: 3}, $Add>, 6>(),
    t.equal<Reduce<{a: 1, b: 2, c: 3, d: 4}, $Add>, 10>()
])

{
    // @ts-expect-error: Reduce/object type checking
    type Wrong1 = Reduce<{a: 'a'}, $Add>

    // @ts-expect-error: Reduce/object type checking
    type Wrong2 = Reduce<{a: 'a', b: 1}, $Add>

    // @ts-expect-error: Reduce/object type checking
    type Wrong3 = Reduce<{a: 1, b: 'b'}, $Add>
}

// @ts-expect-error: Reduce/object: input must not be empty
type EmptyObjectError = Reduce<{}, $Add>


test('Fold works on tuples' as const, t => [
    t.equal<Fold<[], 0, $Add>, 0>(),
    t.equal<Fold<[1], 0, $Add>, 1>(),
    t.equal<Fold<[1, 2], 0, $Add>, 3>(),
    t.equal<Fold<[1, 2, 3], 0, $Add>, 6>(),
    t.equal<Fold<[1, 2, 3, 4], 0, $Add>, 10>(),
])

test('Fold works on empty tuples' as const, t =>
    t.equal<Fold<[], 0, $Add>, 0>(),
)

test('Fold works on objects' as const, t => [
    t.equal<Fold<{a: 1}, 0, $Add>, 1>(),
    t.equal<Fold<{a: 1, b: 2}, 0, $Add>, 3>(),
    t.equal<Fold<{a: 1, b: 2, c: 3}, 0, $Add>, 6>(),
    t.equal<Fold<{a: 1, b: 2, c: 3, d: 4}, 0, $Add>, 10>()
])

test('Fold works on empty objects' as const, t => 
    t.equal<Fold<{}, 0, $Add>, 0>()
)


test('$Index' as const, t => [
    t.equal<apply<$Index<0>, [[string, number]]>, string>(),
    t.equal<apply<$Index<1>, [[string, number]]>, number>(),
    t.equal<apply<Flow<[$MapOver<$Next, 2>, $Index<1>]>, [[10, 20]]>, 21>(),
    t.equal<apply<Flow<[$MapOver<$Next, 2>, $Index<0>]>, [[10, 20]]>, 11>(),
    t.equal<apply<Flow<[$MapOver<$Next, number>, partial<$Index, [1]>]>, [[10, 20]]>, 21>(),
    t.equal<apply<Flow<[$MapOver<$Next, number>, partial<$Index, [0]>]>, [[10, 20]]>, 11>(),
])

test('$SetProp sets known property value' as const, t => [
    t.equal<apply<$SetProp, [5, 'a', {a: 1}]>, {a: 5}>(),
    t.equal<apply<$SetProp<5>, ['a', {a: 1}]>, {a: 5}>(),
    t.equal<apply<$SetProp<5, 'a'>, [{a: 1}]>, {a: 5}>(),
])

test('$SetProp does not set new values' as const, t =>
    t.equal<apply<$SetProp, [2, 'b', {a: 1}]>, {a: 1}>()
)

test('$SetIndex' as const, t => [
    t.equal<apply<$SetIndex, [5, 0, [1]]>, [5]>(),
    t.equal<apply<$SetIndex<5>, [0, [1]]>, [5]>(),
    t.equal<apply<$SetIndex<5, 0>, [[1]]>, [5]>(),
])

test('$SetIndex does not set new values' as const, t =>
    t.equal<apply<$SetIndex<1>, [5, [1]]>, [1]>()
)

/* composition */

type TupleInput = [{ value: 1 }, { value: 2 }]
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

type ff = Pipe<[ObjInput], $MapOver<$Prop<'value'>>, $Reduce<$Add>>

type $Composition1 = Flow<[$MapOver<$Prop<'value', number>>, $Fold<$Add, 0>]>
type $Composition2 = Flow<[$MapOver<$Prop<'value', number>>, $Fold<$Add, 0>]>
type $Composition3 = Flow<[$MapOver<$Prop<'value', number>>, $Fold<$Add, 0>]>

test('Flow higher order types composition' as const, t => [
    t.equal<apply<$Composition1, [TupleInput]>, 3>(),
    t.equal<apply<$Composition1, [ObjInput]>, 3>(),
    t.equal<apply<$Composition2, [TupleInput]>, 3>(),
    t.equal<apply<$Composition3, [ObjInput]>, 3>()
])

interface $Add3 extends Type<[number, number, number]> {
    type: Add<Add<A<this>, B<this>>, C<this>>
}

test('Lift' as const, t => [
    t.equal<Lift<$Next, [[1]]>, [2]>(),
    t.equal<Lift<$Next, [[1, 2]]>, [2, 3]>(),
    t.equal<Lift<$Next, [[1, 2, 3]]>, [2, 3, 4]>(),
    t.equal<Lift<$Next, [{ a:1 }]>, { a:2 }>(),
    t.equal<Lift<$Add, [[1], [2]]>, [3]>(),
    t.equal<Lift<$Add, [[1, 10], [2, 20]]>, [3, 30]>(),
    t.equal<Lift<$Add, [[1, 5, 10], [2, 10, 20]]>, [3, 15, 30]>(),
    t.equal<Lift<$Add, [{a:1, b: 10}, {a:2, b: 20}]>, {a:3, b: 30}>(),
    t.equal<Lift<$Add3, [[1, 10], [2, 20], [3, 30]]>, [6, 60]>(),
    t.equal<Lift<$Add3, [[1, 5, 10], [2, 10, 20], [3, 15, 30]]>, [6, 30, 60]>(),
    t.equal<Lift<$Add3, [{a:1, b: 10}, {a:2, b: 20}, {a:3, b: 30}]>, {a:6, b: 60}>(),
])


test('lift mismatch' as const, t => [
    t.equal<Lift<$Add, [[1, 3], [2]]>, [3]>(),
    t.equal<Lift<$Add, [{a:1, b: 10}, {a:2, c: 20}]>, {a:3}>(),

])

// @ts-expect-error: length does not match arity (tuple)
{type a = Lift<$Add, [[1, 10], [2, 20], [3, 30]]>}
// @ts-expect-error: length does not match arity (object)
{type a = Lift<$Add3, [[1, 10], [2, 20]]>}

// @ts-expect-error: value doesn't match constraint (tuple)
{type a = Lift<$Next, [['1']]>}
// @ts-expect-error: value doesn't match constraint (object)
{type a= Lift<$Next, [{ a:'1' }]>}
