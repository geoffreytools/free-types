import { _, test } from 'ts-test';

import {
    fmap,
    liftA2,
    blueBird,
    blackBird,
    ApplyBox,
    Left,
    Right,
    Either,
    $Either,
    CustomError,
} from './implementations';

/* Fns */

const inc = (x: number) => x + 1
const exclaim = (x: unknown) => x + '!';
const tuple = <A>(a: A): [A] => [a]

const add = (a: number) => (b: number) => a + b;
const pair = <A>(a: A) => <B>(b: B): [A, B] => [a, b]

const $inc = fmap<$Either>()(inc);
const $exclaim = fmap<$Either>()(exclaim);
const $tuple = fmap<$Either>()(tuple);

const $add = liftA2<$Either>()(add);
const $pair = liftA2<$Either>()(pair);

const $incExclaim = blueBird($inc, $exclaim);
const $addExclaim = blackBird($add, $exclaim);


/* values */

const applyBoxNum = new ApplyBox(1);

const right1 = new Right(1) as Either<CustomError, number>;
const right2 = new Right(2) as Either<CustomError, number>;
const rightStr = new Right('a') as Either<CustomError, string>;
const left1 = new Left(new CustomError('error 1', true)) as Either<CustomError, number>;
const left2 = new Left(new CustomError('error 2', true)) as Either<CustomError, number>;

/* fmap tests */

test('Either fmap(monomorphic): is OK but too wide' as const, t => [
    t.equal ($exclaim(right1), <Either<CustomError, string>>_),
    t.equal ($inc(right1), <Either<CustomError, number>>_),
    t.equal ($inc(left1), <Either<CustomError, number>>_),
]);

test('fmap(polymorphic): is OK' as const, t =>
    // @ts-expect-error: *
    t.equal ($tuple(right1), <Either<CustomError, [number]>>_)
);


{
    // @ts-expect-error: fmap wrong argument type
    $inc(rightStr)

    // @ts-expect-error: fmap wrong instance type
    $inc(applyBoxNum)

    // not applicable
    // // @ts-expect-error: fmap wrong $Type
    // $inc(right1)
};

test('fmap(monomorphic) composition: is OK' as const, t => [
    t.equal ($incExclaim(right1), <Either<CustomError, string>>_)
]);

{
    // @ts-expect-error: fmap composition wrong argument type
    $incExclaim(rightStr)

    // @ts-expect-error: fmap composition wrong instance type
    $incExclaim(applyBoxNum)

    // not applicable
    // // @ts-expect-error: fmap composition wrong $Type
    // $incExclaim(right1)
};

test('LiftA2(monomorphic): is OK' as const, t => [
    t.equal ($add(right1)(right2), <Either<CustomError, number>>_),
    t.equal ($add(right1)(left2), <Either<CustomError, number>>_),
    t.equal ($add(left1)(right2), <Either<CustomError, number>>_),
    t.equal ($add(left1)(left2), <Either<CustomError, number>>_),
]);

test('LiftA2(polymorphic): is OK' as const, t => 
    // @ts-expect-error: *
    t.equal ($pair(applyBoxNum)(applyBoxStr), <Either<CustomError, [number, string]>>_)
);

{
    // @ts-expect-error: LiftA2 wrong argument type 1
    $add(rightStr)(right2)

    // @ts-expect-error: LiftA2  wrong argument type 2
    $add(right1)(rightStr)

    // @ts-expect-error: LiftA2  wrong argument type 1&2
    $add(rightStr)(rightStr)

    // @ts-expect-error: LiftA2 wrong instance type 1
    $add(applyBoxNum)(right2)
    
    // @ts-expect-error: LiftA2 wrong instance type 2
    $add(right1)(applyBoxNum)

    // @ts-expect-error: LiftA2 wrong instance type 1&2
    $add(applyBoxNum)(applyBoxNum)

    // not applicable
    // // @ts-expect-error liftA2 wrong $Type
    // $add(right1)(right2)
};

test('liftA2(monomorphic) composition: is OK' as const, t =>
    t.equal ($addExclaim(right1)(right2), <Either<CustomError, string>>_),
);

{
    // @ts-expect-error: LiftA2 composition wrong argument type 1
    $addExclaim(rightStr)(right2)
    
    // @ts-expect-error: LiftA2 composition wrong argument type 2
    $addExclaim(right1)(rightStr)

    // @ts-expect-error: LiftA2 composition wrong argument type 1&2
    $addExclaim(rightStr)(rightStr)

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