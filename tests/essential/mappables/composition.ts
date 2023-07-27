import { test } from 'ts-spec'
import { A, apply, Type } from '../../../core'
import { Flow } from '../../../essential/composition/Flow'
import { Pipe } from '../../../essential/composition/Pipe'
import { $Prop } from '../../../essential/mappables/accessors'
import { $Fold } from '../../../essential/mappables/Fold'
import { $MapOver } from '../../../essential/mappables/MapOver'
import { $Reduce } from '../../../essential/mappables/Reduce'
import { $Add } from '../../../utility-types/arithmetic'

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

type $A = Flow<[$MapOver<$Prop<'value', number>>, $Fold<$Add, 0>]>
type $B = Flow<[$MapOver<$Prop<'value', number>>, $Fold<$Add, 0>]>
type $C = Flow<[$MapOver<$Prop<'value', number>>, $Fold<$Add, 0>]>

test('Flow higher order types composition' as const, t => [
    t.equal<apply<$A, [TupleInput]>, 3>(),
    t.equal<apply<$A, [ObjInput]>, 3>(),
    t.equal<apply<$B, [TupleInput]>, 3>(),
    t.equal<apply<$C, [ObjInput]>, 3>()
])
