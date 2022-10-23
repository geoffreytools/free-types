import { test } from 'ts-test';
import { free } from 'free-types-core';
import { thunk, eval } from '../../utility-types/thunk'
import { $Next } from '../../utility-types/arithmetic/$Next'

{
    // @ts-expect-error: eval checks that args match constraints
    type wrongArg = eval<thunk<free.WeakSet, [1]>>

}


test('thunk<Type>' as const, t =>
    t.equal<thunk<$Next>, thunk<$Next, []>>(),
)

test('thunk<Type, Args>' as const, t => [
    t.equal<eval<thunk<$Next, [1]>>, 2>(),
    t.equal<eval<thunk<free.Record, ['key', 'value']>>, Record<'key', 'value'>>(),
])

test('thunk<Composition, Args>' as const, t =>
    t.equal<
        eval<thunk<[free.Record, free.WeakSet], ['key', 'value']>>,
        WeakSet<Record<'key', 'value'>>
    >()
)

test('thunk<Type, Thunk>' as const, t => [
    t.equal<
        eval<thunk<
            free.WeakSet,
            thunk<[free.Record], ['key', 'value']>
        >>,
        WeakSet<Record<'key', 'value'>>
    >(),
    t.equal<
        eval<thunk<
            free.WeakSet,
            thunk<[free.Record, free.Array], ['key', 'value']>
        >>,
        WeakSet<Array<Record<'key', 'value'>>>
    >()
])

test('thunk<Composition, Thunk>' as const, t => [
    t.equal<
        eval<thunk<
            [free.WeakSet, free.Promise],
            thunk<[free.Record], ['key', 'value']>
        >>,
        Promise<WeakSet<Record<'key', 'value'>>>
    >(),
    t.equal<
        eval<thunk<
            [free.WeakSet, free.Promise],
            thunk<[free.Record, free.Array], ['key', 'value']>
        >>,
        Promise<WeakSet<Array<Record<'key', 'value'>>>>
    >()
])
