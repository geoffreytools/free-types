import { test, _ } from 'ts-test';
import { Type, apply, HKT, A } from '../../../'
import { Maybe, Just, Nothing, Either, $Either, Left, Right, either, CustomError } from './implementations';

const inc = (n: number) => n + 1;
const exclaim = (n: unknown) => n + '!'
const tuple = <T>(x: T): [T] => [x];

// Maybe

const justNum = new Just(1);
const justString = new Just('a');
const nothing = new Nothing();

const nullOrNumber = Math.random() > 0.5 ? 1 : null;
const UndefOrNumber = Math.random() > 0.5 ? 1 : undefined;

const justInc = new Just(inc);
const justExclaim = new Just(exclaim);
const justTuple = new Just(tuple);

test('Maybe.fromNullable infers the narrowest type possible' as const, t => [
    t.equal (Maybe.fromNullable(1), <Just<number>>_),
    t.equal (Maybe.fromNullable(null), <Nothing>_),
    t.equal (Maybe.fromNullable(undefined), <Nothing>_),
    t.equal (Maybe.fromNullable(nullOrNumber), <Maybe<number>>_),
    t.equal (Maybe.fromNullable(UndefOrNumber), <Maybe<number>>_),
]);

test('Maybe.map works on monomorphic fns' as const, t => [
    t.equal (justNum.map(inc), <Just<number>>_),
    t.equal (justNum.map(exclaim), <Just<string>>_),
    t.equal (nothing.map(exclaim), <Nothing>_),
]);

{
    // @ts-expect-error : wrong arg
    justString.map(inc)
}

test('Maybe.map works on polymorphic fns' as const, t => [
    t.equal (justNum.map(tuple), <Just<[number]>>_),
    t.equal (nothing.map(tuple), <Nothing>_)
]);

test('Maybe.ap works on monomorphic fns' as const, t => [
    t.equal (justNum.ap(justInc), <Just<number>>_),
    t.equal (justNum.ap(justExclaim), <Just<string>>_),
    t.equal (nothing.ap(justInc), <Nothing>_),
]);

test('Maybe.ap works on directly applied polymorphic fns' as const, t => [
    t.equal (justNum.ap(new Just(tuple)), <Just<[number]>>_),
]);

test('Maybe.ap does not work in other cases*' as const, t => [
    t.not.equal (justNum.ap(justTuple), <Just<[number]>>_),
]);


// Either

const eitherNum = either<CustomError>()(1);
const eitherStr = either<CustomError>()('a');
const eitherExclaim = either<CustomError>()(exclaim);
const eitherTuple = either<CustomError>()(tuple);

test('Either.map works on monomorphic fns' as const, t => [
    t.equal (eitherNum.map(inc), <Either<CustomError, number>>_),
    t.equal (eitherNum.map(exclaim), <Either<CustomError, string>>_),
]);

test('Either.map works on polymorphic fns' as const, t => [
    //@ts-expect-error: design limitation
    t.equal (eitherNum.map(tuple), <Either<CustomError, [number]>>_),
]);

{
    // @ts-expect-error : type check argument
    eitherStr.map(inc)
}

test('Either.ap works on monomorphic fns' as const, t => [
    t.equal (eitherNum.ap(eitherExclaim)) <Either<CustomError, string>>(),
]);

test('Either.ap works on directly applied polymorphic fns' as const, t => [
    t.equal (eitherNum.ap(either<CustomError>()(tuple)), <Either<CustomError, [number]>>_),
]);

test('Either.ap works on all polymorphic fns' as const, t => [
    // @ts-expect-error: design limitation
    t.equal (eitherNum.ap(eitherTuple), <Either<CustomError, [number]>>_),
]);


{
    const foo = new Right(42).map((n) => n + 1);//?
    const bar = new Right(42).map((n) => n + '!');//?

    // @ts-expect-error
    const bad = new Right(42).map((n: string) => n + '!');

    const baz = (new Left(new CustomError('error', true)) as Either<CustomError, number>).map((n: number) => n + 1);//?

    // @ts-expect-error
    const unknown: apply<$Either, [number, CustomError]> = new Right('string')

    const l = new Left(new CustomError('2', true))

    const left = new Left(new CustomError('error', true)) as Either<CustomError, number>;
    const right = either<CustomError>()(1);

    const add = (a: number) => (b: number) => a + b;

    const r1 = right.map((x: number) => x + 1)

    const r2 = right.ap(left.map(add))
}


/// Extract

interface Extract<E extends Type<1>> extends HKT {
    extract: (this: apply<E, [this['HKT'][0]]>) => this['HKT'][0]
}

type $Extract = Type<1, Extract<Type<1>>>

class Foo<T> implements Extract<$Foo> {
    HKT!: [T]
    _free!: $Foo
    constructor(private value: T){}
    extract () { return this.value }
};

interface $Foo extends Type<1> {
    type: Foo<A<this>>
}

{
    const foo = new Foo(2).extract()
}


// * type parameter is not propagated to the generic of the callback, but of the HOF itself. see https://github.com/microsoft/TypeScript/issues/32041#issuecomment-504780504
