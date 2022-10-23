import { Type, apply, A, B } from '../../'


interface Functor<F extends Type<1>> {
    map: <A, B>(f: (a: A) => B) => (Fa: apply<F, [A]>) => apply<F, [B]>;
}

interface Functor2<F extends Type<2>, E> {
    map: <A, B>(f: (a: A) => B) => (Fa: apply<F, [A, E]>) => apply<F, [B, E]>;
}

// maybe 
type Nothing = { tag: 'Nothing' };
type Just<T> = { tag: 'Just', value: T };

interface Maybe extends Type<1> {
    type: Nothing | Just<A<this>>
}

const Nothing = (): Nothing => ({ tag: 'Nothing' });
const Just = <A>(value: A): Just<A> => ({ tag: 'Just', value });

const Maybe: Functor<Maybe> = {
    map: f => maybe =>
        maybe.tag === 'Nothing'
        ? Nothing()
        : Just(f(maybe.value))
};

{
    const foo = Maybe.map ((n: number) => n + 1) (Just(42));//?
    const bar = Maybe.map (n => n + '!') (Just(42));//?

    // @ts-expect-error
    const bad = Maybe.map ((n: string) => n + '!') (Just(42));
    
    const baz = Maybe.map((n: unknown) => n + '!') (Nothing());//?
    
    // @ts-expect-error
    const unknown: apply<Maybe, [number]> = Just('string')
}

// either

type Left<T> = { tag: 'Left', value: T };
type Right<U> = { tag: 'Right', value: U };

interface Either extends Type<2> {
    type: Right<A<this>> | Left<B<this>>
}

const Left = (value: Error): Left<Error> => ({ tag: 'Left', value });
const Right = <A>(value: A): Right<A> => ({ tag: 'Right', value });


const Either: Functor2<Either, Error> = {
    map: f => either =>
        either.tag === 'Left'
        ? either
        : Right(f(either.value))
};

{
    const foo = Either.map ((n: number) => n + 1) (Right(42));
    const bar = Either.map ((n: unknown) => n + '!') (Right(42));

    // @ts-expect-error
    const bad = Either.map ((n: string) => n + '!') (Right(42));
    
    const baz = Either.map((n: unknown) => n + '!') (Left(Error('error')));
}


interface Extract<E extends Type<1>> {
    extract: <A>(Ea: apply<E, [A]>) => A;
}

type Foo<T> = { value: T };

interface $Foo extends Type<1> {
    type: Foo<A<this>>
}

const createFoo = <T>(value: T) => ({ value });

const Foo: Extract<$Foo> = {
    extract: ({ value }) => value
}

