import { test } from 'ts-spec'
import { Signature } from 'src'
import { $Add, $Subtract } from 'src/utility-types/arithmetic'

test('Inspect the signature of a single type' as const, t => [
    t.equal<Signature<$Add>, {
        input: [number, number],
        output: number
    }>()
])

test('Inspect the signature of a multiple types' as const, t => [
    t.equal<Signature<[$Add, $Subtract]>, [
        {
            type: $Add,
            input: [number, number],
            output: number
        }, {
            type: $Subtract,
            input: [number, number],
            output: number
        }
    ]>()
])