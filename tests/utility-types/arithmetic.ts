import { test } from 'ts-spec';
import { apply } from 'free-types-core';
import { $Abs, $Next, $Prev, $Add, $Subtract, $Multiply, $Divide, $Max, $Min, $Lt, $Lte, $Gt, $Gte } from '../../dist/utility-types/arithmetic';

test('$Abs' as const, t => [
    t.equal<apply<$Abs, [-5]>, 5>(),
    t.equal<$Abs['type'], number>(),
    t.equal<$Abs['constraints'], [number]>()
])

test('$Next' as const, t => [
    t.equal<apply<$Next, [5]>, 6>(),
    t.equal<$Next['type'], number>(),
    t.equal<$Next['constraints'], [number]>()
])

test('$Prev' as const, t => [
    t.equal<apply<$Prev, [6]>, 5>(),
    t.equal<$Prev['type'], number>(),
    t.equal<$Prev['constraints'], [number]>()
])

test('$Add' as const, t => [
    t.equal<apply<$Add, [5, 6]>, 11>(),
    t.equal<$Add['type'], number>(),
    t.equal<$Add['constraints'], [number, number]>(),
    t.equal<$Add<1>['constraints'], [number]>(),
    t.equal<$Add<1>['type'], number>()
])

test('$Subtract' as const, t => [
    t.equal<apply<$Subtract, [6, 5]>, 1>(),
    t.equal<apply<$Subtract<5>, [6]>, 1>(),
    t.equal<$Subtract['type'], number>(),
    t.equal<$Subtract['constraints'], [number, number]>(),
    t.equal<$Subtract<1>['constraints'], [number]>(),
    t.equal<$Subtract<1>['type'], number>()
])

test('$Multiply' as const, t => [
    t.equal<apply<$Multiply, [5, 6]>, 30>(),
    t.equal<$Multiply['type'], number>(),
    t.equal<$Multiply['constraints'], [number, number]>(),
    t.equal<$Multiply<1>['constraints'], [number]>(),
    t.equal<$Multiply<1>['type'], number>()
])

test('$Divide' as const, t => [
    t.never<apply<$Divide, [30, 0]>>(),
    t.equal<apply<$Divide, [5, 6]>, 0>(),
    t.equal<apply<$Divide, [30, 6]>, 5>(),
    t.equal<apply<$Divide<6>, [30]>, 5>(),
    t.equal<$Divide<1>['constraints'], [number]>(),
    t.equal<$Divide<1>['type'], number>()
])

test('$Lt' as const, t => [
    t.true<apply<$Lt, [5, 6]>>(),
    t.false<apply<$Lt, [5, 5]>>(),
    t.false<apply<$Lt, [6, 5]>>(),
    t.equal<$Lt['type'], boolean>(),
    t.equal<$Lt['constraints'], [number, number]>(),
    t.equal<$Lt<1>['constraints'], [number]>(),
    t.equal<$Lt<1>['type'], boolean>()
])

test('$Lte' as const, t => [
    t.true<apply<$Lte, [5, 6]>>(),
    t.true<apply<$Lte, [5, 5]>>(),
    t.false<apply<$Lte, [6, 5]>>(),
    t.equal<$Lte['type'], boolean>(),
    t.equal<$Lte['constraints'], [number, number]>(),
    t.equal<$Lte<1>['constraints'], [number]>(),
    t.equal<$Lte<1>['type'], boolean>()

])

test('$Gt' as const, t => [
    t.false<apply<$Gt, [5, 5]>>(),
    t.true<apply<$Gt, [6, 5]>>(),
    t.false<apply<$Gt, [5, 6]>>(),
    t.equal<$Gt['type'], boolean>(),
    t.equal<$Gt['constraints'], [number, number]>(),
    t.equal<$Gt<1>['constraints'], [number]>(),
    t.equal<$Gt<1>['type'], boolean>()
])

test('$Gte' as const, t => [
    t.true<apply<$Gte, [5, 5]>>(),
    t.true<apply<$Gte, [6, 5]>>(),
    t.false<apply<$Gte, [5, 6]>>(),
    t.equal<$Gte['type'], boolean>(),
    t.equal<$Gte['constraints'], [number, number]>(),
    t.equal<$Gte<1>['constraints'], [number]>(),
    t.equal<$Gte<1>['type'], boolean>()
])

test('$Max' as const, t => [
    t.equal<apply<$Max, [5, 6]>, 6>(),
    t.equal<apply<$Max, [6, 5]>, 6>(),
    t.equal<apply<$Max, [6, 6]>, 6>(),
    t.equal<$Max['type'], number>(),
    t.equal<$Max['constraints'], [number, number]>(),
    t.equal<$Max<1>['constraints'], [number]>(),
    t.equal<$Max<1>['type'], number>()
])

test('$Min' as const, t => [
    t.equal<apply<$Min, [5, 6]>, 5>(),
    t.equal<apply<$Min, [6, 5]>, 5>(),
    t.equal<apply<$Min, [5, 5]>, 5>(),
    t.equal<$Min['type'], number>(),
    t.equal<$Min['constraints'], [number, number]>(),
    t.equal<$Min<1>['constraints'], [number]>(),
    t.equal<$Min<1>['type'], number>()
])