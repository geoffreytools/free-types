import { test } from 'ts-spec'
import { A, B, C, Type } from '../../../core'
import { Lift } from '../../../essential/mappables/Lift'
import { Add } from '../../../essential/utils'
import { $Add, $Next } from '../../../utility-types/arithmetic'

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
