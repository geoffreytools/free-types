import { _, test } from 'ts-spec';

import {
    fmap,
    liftA2,
    blueBird,
    blackBird,
    ApplyBox,
    FreeApplyBox,
    FunctorBox,
    WrongApplyBox,
} from './implementations';

/* Fns */

const inc = (x: number) => x + 1
const exclaim = (x: unknown) => x + '!';
const tuple = <A>(a: A): [A] => [a]

const add = (a: number) => (b: number) => a + b;
const pair = <A>(a: A) => <B>(b: B): [A, B] => [a, b]

const $inc = fmap<FreeApplyBox>()(inc);
const $exclaim = fmap<FreeApplyBox>()(exclaim);
const $tuple = fmap<FreeApplyBox>()(tuple);

const $add = liftA2<FreeApplyBox>()(add);
const $pair = liftA2<FreeApplyBox>()(pair);

const $incExclaim = blueBird($inc, $exclaim);
const $addExclaim = blackBird($add, $exclaim);

/* values */

const applyBoxNum = new ApplyBox(1);
const functorBoxNum = new FunctorBox(1);
const applyBoxNum2 = new ApplyBox(2);
const applyBoxStr = new ApplyBox('a');
const wrongApplyBox = new WrongApplyBox(1);

/* fmap tests */

test('fmap(monomorphic): is OK' as const, t => [
    t.equal($exclaim(applyBoxNum), <ApplyBox<string>>_),
    t.equal($inc(applyBoxNum), <ApplyBox<number>>_),
]);

test('fmap(polymorphic): is OK' as const, t =>
    // @ts-expect-error: *
    t.equal ($tuple(applyBoxNum), <ApplyBox<[number]>>_)
);

{
    // @ts-expect-error: fmap wrong argument type
    $inc(applyBoxStr)

    // @ts-expect-error: fmap wrong instance type
    $inc(wrongApplyBox)

    // not applicable
    // // @ts-expect-error: fmap wrong $Type
    // $inc(applyBoxNum)
};

test('fmap(monomorphic) composition: is OK' as const, t => [
    t.equal ($incExclaim(applyBoxNum), <ApplyBox<string>>_)
]);

{
    // @ts-expect-error: fmap composition wrong argument type
    $incExclaim(applyBoxStr)

    // @ts-expect-error: fmap composition wrong instance type
    $incExclaim(wrongApplyBox)

    // not applicable
    // // @ts-expect-error: fmap composition wrong $Type
    // $incExclaim(applyBoxNum)
};

/* liftA2 tests */

test('LiftA2(monomorphic): is OK' as const, t => [
    t.equal ($add(applyBoxNum)(applyBoxNum2), <ApplyBox<number>>_)
]);

test('LiftA2(polymorphic): is OK' as const, t => 
    // @ts-expect-error: *
    t.equal ($pair(applyBoxNum)(applyBoxStr), <ApplyBox<[number, string]>>_)
);

{
    // @ts-expect-error: LiftA2 only accepts Apply
    $addExclaim(functorBoxNum)

    // @ts-expect-error: LiftA2 wrong argument type 1
    $add(applyBoxNum)(applyBoxStr)

    // @ts-expect-error: LiftA2  wrong argument type 2
    $add(applyBoxStr)(applyBoxNum)

    // @ts-expect-error: LiftA2  wrong argument type 1&2
    $add(applyBoxStr)(applyBoxStr)

    // @ts-expect-error: LiftA2 wrong instance type 2
    $add(applyBoxNum)(wrongApplyBox)

    // @ts-expect-error: LiftA2 wrong instance type 1
    $add(wrongApplyBox)(applyBoxNum)

    // @ts-expect-error: LiftA2 wrong instance type 1&2
    $add(wrongApplyBox)(wrongApplyBox)

    // not applicable
    // // @ts-expect-error liftA2 wrong $Type
    // $add(applyBoxNum)(applyBoxNum)
};

test('liftA2(monomorphic) composition: is OK' as const, t =>
    t.equal ($addExclaim(applyBoxNum)(applyBoxNum2), <ApplyBox<string>>_),
);

{
    // @ts-expect-error: LiftA2 composition wrong argument type 2
    $addExclaim(applyBoxNum)(applyBoxStr)

    // @ts-expect-error: LiftA2 composition wrong argument type 1
    $addExclaim(applyBoxStr)(applyBoxNum)

    // @ts-expect-error: LiftA2 composition wrong argument type 1&2
    $addExclaim(applyBoxStr)(applyBoxStr)

    // @ts-expect-error: LiftA2 composition wrong instance type 2
    $addExclaim(applyBoxNum)(wrongApplyBox)

    // @ts-expect-error: LiftA2 composition wrong instance type 1
    $addExclaim(wrongApplyBox)(applyBoxNum)

    // @ts-expect-error: LiftA2 composition wrong instance type 1&2
    $addExclaim(wrongApplyBox)(wrongApplyBox)

    // not applicable
    // // @ts-expect-error: liftA2 composition wrong $Type
    // $addExclaim(applyBoxNum)(applyBoxNum)
};

// * type parameter is not propagated to the generic of the callback, but to the HOF's. see https://github.com/microsoft/TypeScript/issues/32041#issuecomment-504780504