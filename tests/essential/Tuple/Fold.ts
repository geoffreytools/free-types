import { apply, Type, Checked, A } from 'free-types-core'
import { test } from 'ts-spec'
import * as Tuple from 'essential/Tuple'
import { $Add } from '../../../src/arithmetic'

type ExpectNumericArr<T extends number> = T;

// Accept generic return type
{type Gen<T extends readonly number[]> = ExpectNumericArr<Tuple.Fold<T, 0, $Add>>}

// @ts-expect-error: type check generic return type
{type Gen<T extends number[]> = ExpectNumericArr<Tuple.Fold<T, $IsString>>}

interface $AcceptImplicit extends Type<[number[]], number> {
    // Accept implicit return type
    type: Tuple.Fold<Checked<A, this>, 0, $Add>
}

test('Return type of composition resolves to a value even with generics', t => (
    <T extends number[]>() =>
        t.equal<apply<Tuple.$Fold<$Add, 0>, [T]>, number>()
)())

// @ts-expect-error: type check implicit return type
interface $RejectImplicit extends Type<[number[]], string> {
    type: Tuple.Fold<Checked<A, this>, 0, $Add>
}

test('Tuple.Fold works' as const, t => [
    t.equal<Tuple.Fold<[], 0, $Add>, 0>(),
    t.equal<Tuple.Fold<[1], 0, $Add>, 1>(),
    t.equal<Tuple.Fold<[1, 2, 3, 4], 0, $Add>, 10>(),
])

test('Tuple.$Fold works' as const, t => [
    t.equal<apply<Tuple.$Fold<$Add, 0>, [[]]>, 0>(),
    t.equal<apply<Tuple.$Fold<$Add, 0>, [[1]]>, 1>(),
    t.equal<apply<Tuple.$Fold<$Add, 0>, [[1, 2, 3, 4]]>, 10>(),
])

