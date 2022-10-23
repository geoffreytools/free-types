import { Type, apply, HKT, A, B, Head, Tail } from '../../../'

export {
    Functor,
    Apply,
    fmap,
    liftA2,
    blueBird,
    blackBird,
    ApplyBox,
    FreeApplyBox,
    FunctorBox,
    FreeFunctorBox,
    WrongApplyBox,
    FreeWrongApplyBox,
    Just,
    Nothing,
    Maybe,
    FreeMaybe,
    FreeJust,
    Either,
    Left,
    Right,
    $Either,
    either,
    CustomError
};

/* interfaces */

type $Apply<Args extends number | unknown[] = unknown[]> =
    Type<Args, Apply<Type>>;

type $Functor<Args extends number | unknown[] = unknown[]> =
    Type<Args, Functor<Type>>;

interface Functor<$F extends Type> extends HKT {
    map <B>(f: (a: Head<this['HKT']>) => B):
        apply<$F, [B, ...Tail<this['HKT']>]>
}

interface Apply<$F extends Type> extends Functor<$F>, HKT {
    ap <B>(fab: apply<$F, [(a: Head<this['HKT']>) => B, ...Tail<this['HKT']>]>):
        apply<$F, [B, ...Tail<this['HKT']>]>
}

/* lift */

const fmap = <$F extends $Functor>() =>
    <A, B> (f: (a: A) => B) =>
        <E>(fa: apply<$F, [A, E]>) =>
            fa.map(f) as apply<$F, [B, E]>

const liftA2 = <$F extends $Apply>() =>
    <A, B, C> (f: (a: A) => (b: B) => C) =>
        <E>(fa: apply<$F, [A, E]>) =>
            (fb: apply<$F, [B, E]>) =>
                fb.ap(fa.map(f)) as apply<$F, [C, E]>


/* basic combinators */

const blueBird = <A, B, C>
    (f: (a: A) => B, g: (b: B) => C) =>
        (a: A) =>
            g(f(a));

const blackBird = <A, B, C, D>
    (f: (a: A) => (b:B) => C, g: (c: C) => D) =>
        (a: A) => (b: B) =>
            g(f(a)(b));


/* Types */


// ApplyBox
class ApplyBox<A> implements Apply<FreeApplyBox> {
    HKT!: [A]
    constructor (private value: A) {}
    ap<B>(box: ApplyBox<(a: A) => B>): ApplyBox<B> {
        return new ApplyBox(box.value(this.value))
    }
    map<B>(f: (a: A) => B): ApplyBox<B> {
        return new ApplyBox(f(this.value));
    }
}

interface FreeApplyBox extends $Apply<1> {
    type: ApplyBox<A<this>>
}

// FunctorBox

class FunctorBox<A> implements Functor<FreeFunctorBox> {
    HKT!: [A]
    constructor (private value: A) {}
    map<B>(f: (a: A) => B): FunctorBox<B> {
        return new FunctorBox(f(this.value));
    }
}

interface FreeFunctorBox extends $Functor<1> {
    type: FunctorBox<A<this>>
}

// distinct but identical to ApplyBox
class WrongApplyBox<A> implements Apply<FreeWrongApplyBox> {
    HKT!: [A]
    constructor (private value: A) {}
    ap<B>(box: WrongApplyBox<(a: A) => B>): WrongApplyBox<B> {
        return new WrongApplyBox(box.value(this.value))
    }
    map<B>(f: (a: A) => B): WrongApplyBox<B> {
        return new WrongApplyBox(f(this.value));
    }
}

interface FreeWrongApplyBox extends $Apply<1> {
    type: WrongApplyBox<A<this>>
}


// Maybe
type Maybe<T> = Nothing | Just<T>

// using Apply<FreeJust> allows to better type check the implementation
class Just<A> implements Apply<FreeJust> {
    HKT!: [A]
    _brand!: 'Just'
    constructor (private value: A) {}
    map<B>(f: (a: A) => B): Just<B> { return new Just(f(this.value)); }
    ap<B>(maybe: Just<(a: A) => B>): Just<B>
    ap(maybe: Nothing): Nothing
    ap<B>(maybe: Maybe<(a: A) => B>): Just<B> | Nothing {
        return maybe instanceof Nothing
            ? maybe
            : new Just(maybe.value(this.value))
    }
}

class Nothing implements Apply<FreeMaybe> {
    HKT!: [any]
    _brand!: 'Nothing'
    map(_f: any): Nothing { return new Nothing()}
    ap <B>(_maybe: Maybe<(a: any) => B>): Nothing { return this }
}

interface FreeMaybe extends $Apply<1> {
    type: Maybe<A<this>>
}

interface FreeJust extends $Apply<1> {
    type: Just<A<this>>
}

type isStrictlyNullish<T> = [T] extends [undefined] ? true : [T] extends [null] ? true : false;

type isNullable<T> = (T extends undefined ? true : T extends null ? true : false) extends false ? false : true;


type PrettyMaybe<T> =
    isNullable<T> extends true
    ? isStrictlyNullish<T> extends true
        ? Nothing
        : Maybe<NonNullable<T>>
    : Just<T>;

const Maybe = {
    of <T>(x: T): Just<T> { return new Just(x) },
    fromNullable <T>(x: T): PrettyMaybe<T> {
        return x === null || x === undefined
        ? new Nothing() : new Just(x) as any
    }
}

class Left<E extends Error, A> implements Apply<$Either> {
    HKT!: [A, E]
    constructor (private value: E) {}
    map<B>(_: (a: A) => B): Either<E, B> { return this as any; }
    ap<B>(either: Either<E, (a: A) => B>): Either<E, B> {
        return (either instanceof Left ? either : this) as any
    }
}

class Right<E extends Error, A> implements Apply<$Either> {
    HKT!: [A, E]
    constructor (private value: A) {}
    map<B>(f: (a: A) => B): Right<E, B> { return new Right(f(this.value)); }
    ap<B>(either: Either<E, (a: A) => B>): Either<E, B> {
        return (
            either instanceof Left ? either
            : new Right(either.value(this.value))
        ) as any
    }
}

type Either<E extends Error, A> = Right<E, A> | Left<E, A>

interface $Either extends $Apply<[unknown, Error]> {
    type: Either<B<this>, A<this>>
}

const either = <E extends Error>() => <T>(x: T) => new Right(x) as Either<E, T>;

class CustomError extends Error {
    constructor (
        public message: string,
        public recoverable: boolean
    ) {
        super();
        this.name = 'CustomError';
    }
}