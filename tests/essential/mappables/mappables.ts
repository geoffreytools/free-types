import { test } from 'ts-spec'
import { apply, partial } from '../../../core'
import { Flow } from '../../../essential/composition/Flow'
import { $Index, $SetIndex, $SetProp } from '../../../essential/mappables/accessors'
import { $MapOver } from '../../../essential/mappables/MapOver'
import { $Next } from '../../../utility-types/arithmetic'

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