# free-types

[free-types](../README.md) | [Documentation](./Documentation.md) | [Guide](./Guide.md) | **[Algebraic data types](./ADTs.md)**

## Algebraic data types

One can't reasonably implement higher kinded types without mentioning ADTs.

The state of the art on the matter is I believe [fp-ts](https://github.com/gcanti/fp-ts), and actually you could simply copy and paste the way they implement static land with free types: you would only need to get rid of the `URI` / module augmentation shcheme which is no longer necessary.

It is not what I am going to develop though, because it would be a little dull.

You can look up these (short) guides/articles to catch up if you don't know fp-ts:
- [Higher kinded types in TypeScript, static and fantasy land](https://medium.com/@gcanti/higher-kinded-types-in-typescript-static-and-fantasy-land-d41c361d0dbe) (gcanti on <i>medium</i>)
-  [How to write type class instances for your data type](https://gcanti.github.io/fp-ts/guides/HKT.html) (fp-ts doc)

In the following lines I took an approach which is more class oriented because free-types can take advantage of a feature unique to classes.

### contract

- We will define the type class `Apply` and implement it for:
    - `Box` (Identity), which is a unary type,
    -  and `Either`, which is a binary union type (`Left<E>` | `Right<A>`);

- We will define `fmap` and `liftA2` and use them to lift monomorphic unary and binary functions so that they can take `Box` or `Either` as argument(s);

- And we will compose those lifted functions to demonstrate that type information is not lost.


## implementation

There are many interconnected moving pieces, so be prepared to see dependencies you don't understand. It should all come together later.

- [See it working](#see-it-working)
- [Defining Box and Either](#defining-box-and-either)
- [Defining Functor and Apply](#defining-functor-and-apply)
- [Defining fmap and liftA2](#defining-fmap-and-lifta2)
- [Defining $Functor and $Apply](#defining-functor-and-apply-1)
- Customisation
    - [Adding type constraints](#adding-type-constraints)
    - [Fixing type parameters](#fixing-type-parameters)

### See it working

Set up:

```typescript
// we define our monomorphic functions
const increment = (x: number) => x + 1;
const exclaim = (x: unknown) => x + '!';
const add = (a: number) => (b: number) => a + b;

// we lift them into Box
const incBox = fmap<$Box>()(increment)
const exclaimBox = fmap<$Box>()(exclaim)
const addBox = liftA2<$Box>()(add);

// we compose the result
const incExclaimBox = compose(incBox, exclaimBox);
const addExclaimBox = compose2(addBox, exclaimBox);

// same thing for Either
const incEither = fmap<$Either>()(increment)
const exclaimEither = fmap<$Either>()(exclaim)
const addEither = liftA2<$Either>()(add);
const incExclaimEither = compose(incEither, exclaimEither);
const addEitherxclaimEither = compose2(addE, exclaimEither);

// combinators
const compose = <A, B, C>
    (f: (a: A) => B, g: (b: B) => C) =>
        (a: A) =>
            g(f(a));

const compose2 = <A, B, C, D>
    (f: (a: A) => (b:B) => C, g: (c: C) => D) =>
        (a: A) => (b: B) =>
            g(f(a)(b));
```
> Ideally we should not have to bind `fmap` and `liftA2` to a specific instance, but it is currently "not possible" to make TS infer the correct type constructor. I am having trouble decomposing n-ary sum types such as `Either`, but it may be possible to define truly general lifting functions (at the cost of increased complexity) with the help of `unwrap`.

This results in:
```typescript
incExclaimBox: <E>(a: Box<number>) => Box<string>
addExclaimBox: <E>(a: Box<number>) => (b: Box<number>) => Box<string>

incExclaimEither: <E>(a: Either<E, number>) => Either<E, string>
addExclaimEither: <E>(a: Either<E, number>) => (b: Either<E, number>) => Either<E, string>
```
> `E` is generated whether we use it or not. We will cover that later.

In action:
```typescript
const box1 = new Box(1);   // Box<number>
const box2 = new Box(2);   // Box<number>
const boxA = new Box('A'); // Box<string>

incExclaimBox(box1); // Box<string>
addExclaimBox(box1)(box2); // Box<string>
incExclaimBox(boxA); // Box<string> not assignable Box<number>
//            ----  

const either1 = either<Error>()(1);   // Either<Error, number>;
const either2 = either<Error>()(2);   // Either<Error, number>;
const eitherA = either<Error>()('A'); // Either<Error, string>;

incExclaimEither(either1); // Either<Error, string>
addExclaimEither(either1)(either2); // Either<Error, string>
incExclaimEither(eitherA); // Either<Error, string> not assignable to Either<Error, number>
//               -------
```
> `either` is a little helper which lets us specify the Left type when creating a `Right` instance.

### Defining Box and Either

#### Box
First let's create a free type `$Box` for our class `Box`:

```typescript
interface $Box extends $Apply<1> {
    type: Box<A<this>>
}
```
> You may wonder why we didn't simply extend `Type<1>`: `$Apply` is a requirement of `fmap` and `liftA2`.

We then define `Box`:
```typescript
class Box<A> implements Apply<$Box> {
    HKT!: [A]
    constructor (private value: A) {}
    map<B>(f: (a: A) => B): Box<B> {
        return new Box(f(this.value));
    }
    ap<B>(box: Box<(a: A) => B>): Box<B> {
        return new Box(box.value(this.value))
    }
}
```
- We made `Box` implement `Apply<$Box>` in order to type check our implementation;
- The `HKT` field exposes `A` to `Apply`.

#### Either
It is pretty much the same process as for `Box` but we need to pay attention to a couple of things:

- Either should normally be defined like so: `Either<E, A> = Left<E> | Right<A>`. Here we need `Left` and `Right` to hold both `E` and `A`. This is a known problem with the class implementation;
- Contrary to convention, we need `A` to be in first position at the free-type level, so we need to flip the parameters at some point.

```typescript
type Either<E, A> = Left<E, A> | Right<E, A>;

interface $Either extends $Apply<2> {
    type: Either<B<this>, A<this>> // notice the flip
}

class Left<E, A> implements Apply<$Either> {
    HKT!: [A, E] // notice the flip
    constructor (private value: E) {}
    map<B>(_: (a: A) => B): Either<E, B> { return this as any; }
    ap<B>(either: Either<E, (a: A) => B>): Either<E, B> {
        return (either instanceof Left ? either : this) as any
    }
}

class Right<E, A> implements Apply<$Either> {
    HKT!: [A, E] // notice the flip
    constructor (private value: A) {}
    map<B>(f: (a: A) => B): Right<E, B> { return new Right(f(this.value)); }
    ap<B>(either: Either<E, (a: A) => B>): Either<E, B> {
        return (
            either instanceof Left ? either
            : new Right(either.value(this.value))
        ) as any
    }
}

const either = <E extends Error>() => <A>(x: A) =>
    new Right(x) as Either<E, A>;
```
>You may have noticed that `Apply` was able to take the unary free type `$Box` and the binary free type `$Either` without distinction.
>
>This is a distinctive feature of free types. In [the article implementing `Option`](https://medium.com/@gcanti/higher-kinded-types-in-typescript-static-and-fantasy-land-d41c361d0dbe), Giulio Canti uses `Functor1`, `URIS` and `URI2HKT`. Had he implemented `Either`, he would have needed `Functor2`, `URIS2` and `URI2HKT2`.
>
>This is because fp-ts relies on interface merging and module augmentation: every addition to an interface must have the same type parameters.

### Defining Functor and Apply

<br>

> As mentioned before, we only need one interface for each arity of `Functor` and `Apply`. This is made possible by the fact that our implementation relies on tuples.

```typescript
interface Functor<$F extends Type> extends HKT {
    map <B>(f: (a: Head<this['HKT']>) => B):
        apply<$F, [B, ...Tail<this['HKT']>]>
}

interface Apply<$F extends Type> extends Functor<$F>, HKT {
    ap <B>(fab: apply<$F, [(a: Head<this['HKT']>) => B, ...Tail<this['HKT']> ]>):
        apply<$F, [B, ...Tail<this['HKT']>]>
}
type HKT = { HKT: [any, ...any[]] };

type Head<T extends [unknown, ...unknown[]]> = T[0];

type Tail<T extends [unknown, ...unknown[]]> =
    T extends [unknown, ...infer R] ? R : never;
```
Take note that `Apply` depends on `Functor`. This is what we want.

`map` and `ap` are defined as methods, not functions, because we need the bivariance.

### Defining fmap and liftA2

> Notice  that `fmap` and `liftA2` don't require overloads. You can have an idea of [what it would have looked like](https://gcanti.github.io/fp-ts/guides/HKT.html#how-to-type-functions-which-abstracts-over-type-classes) otherwise.

```typescript
const fmap = <$F extends $Functor>() =>
    <A, B> (f: (a: A) => B) =>
        <E>(fa: apply<$F, [A, E]>) =>
            fa.map(f) as apply<$F, [B, E]>

const liftA2 = <$F extends $Apply>() =>
    <A, B, C> (f: (a: A) => (b: B) => C) =>
        <E>(fa: apply<$F, [A, E]>) =>
            (fb: apply<$F, [B, E]>) =>
                fb.ap(fa.map(f)) as apply<$F, [C, E]>
```
The parameter `E` is what is inferred when the arity of our type is 2. We limited ourselves to arities of 1 and 2 for clarity, but we could ad more.


### Defining $Functor and $Apply

```typescript
type $Apply<Args extends number | unknown[] = unknown[]> =
    Type<Args, Apply<Type>>;
    
type $Functor<Args extends number | unknown[] = unknown[]> =
    Type<Args, Functor<Type>>;
```

What we are saying with these interfaces is that we are expecting a free type matching a certain constraint and returning an instance of `Functor` or `Apply`. This lets TS know that we can use `map` and/or `ap` when we pass in an instance of `$Functor` or `$Apply` to `map` and `liftA2`.


### Adding type constraints
It is seemingly trivial to constrain the type parameter `E` for example: 

```typescript
class Left<E extends Error, A> implements Apply<$Either> {
    //     ---------------
    HKT!: [A, E]
    constructor (private value: E) {}
    map<B>(_: (a: A) => B): Either<E, B> { return this as any; }
    ap<B>(either: Either<E, (a: A) => B>): Either<E, B> {
        return (either instanceof Left ? either : this) as any
    }
}

class Right<E extends Error, A> implements Apply<$Either> {
    //      ---------------
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
//          ---------------

interface $Either extends $Apply<[unknown, Error]> {
    //                           ----------------
    type: Either<B<this>, A<this>>
}
```
You would however experience much pain trying to allow `Either` to be nested, for type constraints and recursive types don't go together well in a structural type system.

### Fixing type parameters

We could fix the type parameter of `Left` without changing anything to our implementation:
```typescript
type $EitherError = partialRight<$Either, [Error]>
const exclaimEitherError = fmap<$EitherError>()(exclaim);
```
Another way to do it is to add a good old generic. Note however that this will *force* users to supply it:
```typescript
// Importantly, we keep an arity of 2 to match `HKT`
interface $Either<E> extends $Apply<2> {
    type: Either<E, A<this>>
}

type $EitherError = $Either<Error>
```

Finally, we could allow both syntaxes transparently:
```typescript
interface $Either<E = never> extends $Apply<2> {
    type: [E] extends [never] ? Either<B<this>, A<this>> : Either<E, A<this>>
}
```