import { apply } from 'free-types-core'
import { test } from 'ts-spec'
import * as Mappable from 'src/essential/mappables/Fold'
import { $Add } from 'src/utility-types/arithmetic'

test('Fold works on tuples' as const, t => [
    t.equal<Mappable.Fold<[], 0, $Add>, 0>(),
    t.equal<Mappable.Fold<[1], 0, $Add>, 1>(),
    t.equal<Mappable.Fold<[1, 2, 3, 4], 0, $Add>, 10>(),
])

test('$Fold works on tuples' as const, t => [
    t.equal<Mappable.Fold<[], 0, $Add>, 0>(),
    t.equal<Mappable.Fold<[1], 0, $Add>, 1>(),
    t.equal<Mappable.Fold<[1, 2, 3, 4], 0, $Add>, 10>(),
])

test('Fold works on objects' as const, t => [
    t.equal<Mappable.Fold<{}, 0, $Add>, 0>(),
    t.equal<Mappable.Fold<{a: 1}, 0, $Add>, 1>(),
    t.equal<Mappable.Fold<{a: 1, b: 2, c: 3, d: 4}, 0, $Add>, 10>()
])
test('$Fold works on objects' as const, t => [
    t.equal<apply<Mappable.$Fold<$Add, 0>, [{}]>, 0>(),
    t.equal<apply<Mappable.$Fold<$Add, 0>, [{a: 1}]>, 1>(),
    t.equal<apply<Mappable.$Fold<$Add, 0>, [{a: 1, b: 2, c: 3, d: 4}]>, 10>()
])