import { test } from 'ts-spec'
import { $Fold, Fold } from '../../../essential/mappables/Fold'
import { $Add } from '../../../utility-types/arithmetic'

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
