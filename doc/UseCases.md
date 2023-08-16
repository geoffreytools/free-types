# free-types

[free-types](../README.md) | **[Use Cases](./UseCases.md)** | [Documentation](./Documentation.md) | [Guide](./Guide.md) | [Algebraic data types](./ADTs.md)

# Use Cases

[Dependency inversion](#dependency-inversion)
| [Polymorphism](#polymorphism)
| [Reuse](#reuse)

## Dependency inversion&nbsp;[↸](#use-cases)

A common use case for free types is the following: you write a library that enables users to expand its behaviour, or you have no knowledge of the types they are using, yet you need it somehow.

For example, let's say we want to provide users with a way to convert a binary function into a redux reducer, that is to say: we create a wrapper that dispatches to the original function, with the payload unwrapped from the action.

For your reference, a reducer in redux has the shape `(a: State, b: Action) => State` where `Action` is `{ type: string }`, with an optional payload which can be encoded in any way the user likes.
```typescript
// So we may have this
declare const append: <T>(a: T[], b: T) => T[];

// and we want... that?
const appendReducer = magicFunction(append);
// type: appendReducer: <T>(a: T[], b: { type: string, payload: T }) => T[]
//                                                     ----------
export declare const magicFunction:
   <State, Payload>(fn: (a:State, b:Payload) => State) =>
      (state: State, action: { type: string, payload: Payload }) => State;
//                                           ----------------
```
The problem we face is that we don't want to be prescribing the shape of the action: in the code above it needs to have a `payload` field containing the payload, but the user could decide to store it in a `value` field or it could be nested in a datastructure alongside metadata.

A way to remedy this problem is to let the user provide to a `magicFunctionFromAction` factory a function which knows how to unwrap the payload from their action type:
```typescript
export declare const magicFunctionFromAction:
   (unwrap: <Payload>(action: TheirActionType<Payload>) => Payload) =>
      <State, Payload>(fn: (a:State, b:Payload) => State) =>
         (state: State, action: TheirActionType<Payload>) => State;
```
Now how do we type this? `TheirActionType` is precisely what we don't know.

This is where free type constructors come into play: we can require a free Action type constructor accepting an argument (the payload's type) and returning an Action type. We encode this requirement in the following contract:
```typescript
import { Type } from 'free-types';

export type $Action = Type<1, { type: string }>
```
We can now update `magicFunctionFromAction` to use the provided constructor and our problem disappears:
```typescript
import { apply } from 'free-types';

export declare const magicFunctionFromAction:
   <$A extends $Action>(unwrap: <Payload>(action: apply<$A, [Payload]>) => Payload) =>
      <State, Payload>(fn: (a: State, b: Payload) => State) =>
         (state: State, action: apply<$A, [Payload]>) => State;
```
> As a side-note, if our library needed to do something with `{ type: string }`, for example adding a prefix to it or whatnot, because `$A` extends `$Action` it would know that `apply<$A, [Payload]>['type']` exists and is of type `string`.

In order to use our incredible library, our user will need to use our `$Action` contract as a template for their free type constructor:
```typescript
import { magicFunctionFromAction, $Action } from 'incredible library';

// free type constructor from template
interface $MyAction extends $Action { type: MyAction<this[0]> }

// well apparently they also wanted to call it `payload` ¯\_(ツ)_/¯
type MyAction<Payload> = { payload: Payload, type: string }; 

// unwrap function
declare const unwrapPayload = <T>({ payload }: Action<T>) => payload;

// custom magicFunction from our factory function
const magicFunction = magicFunctionFromAction<$MyAction>(unwrapPayload);

const appendReducer = magicFunction(append);
// type appendReducer = <T>(state: T[], action: MyAction<T>) => T[]
```
`$Action` checks that `MyAction` does return `{ type: string }`, which is a requirement of redux, and every type is wired correctly.

Now imagine that our opinionated framework deals with sensitive data and that we want to force our user's reducers to take encrypted payloads. We now have a type constraint on the input as well.

Let's update our contract:
```typescript
type Encrypted = { cypher: string, iv: string };
export type $Action = Type<[Encrypted], { type: string }>
```
It now mandates that we update `magicFunctionFromAction` because `apply` won't let us pass an argument that is not `Encrypted` to `$A`:
```typescript
declare const magicFunctionFromAction:
   <$A extends $Action>(unwrap: (action: apply<$A, [Encrypted]>) => Encrypted) =>
      <State>(fn: (a: State, b: Encrypted) => State) =>
         (state: State, action: apply<$A, [Encrypted]>) => State;
```
On the user end, the definition of the Action type does not change. The new `$Action` contract has tainted `$MyAction` with the requirement, and because they fed it to our factory, the binary function our user wants to lift is now required to deal with encrypted data:
```typescript
const appendReducer = magicFunction(append<Encrypted>);
// type appendReducer: (state: Encrypted[], action: Action<Encrypted>) => Encrypted[]
```
Free types enabled us to invert dependencies: `$Action` is owned by the library and the user code depends on it. We were able to specify both the input and the output types, and our contract kept both the implementer and the user honest accros packages.

## Polymorphism&nbsp;[↸](#use-cases)

Sometimes you need to write a non-trivial utility type with special cases, and just as in regular old programming, you can leverage polymorphism to simplify the logic and make your life easier.

This is what happened to me when implementing find and replace for [type-lenses](https://github.com/geoffreytools/type-lenses): I needed to perform a breadth-first search on an arbitrarily complex type and collect matching paths in a predictable order, while honouring a user-specified limit.

Eventually, the sort of hub responsible for finding paths looked like this:

```typescript
type GetPaths<T, Needle, Limit extends number, Acc extends unknown[][] = []> = 
    // ignore this:
    // Limit extends 0 | never ? Acc

    // : IsAny<T> extends true
    // ? IsAny<Needle> extends true ? [] : NOT_FOUND

    // : IsNeedle<T, Needle> extends true
    // ? []

    : IsArray<T> extends true
    ? Search<Needle, Limit, Acc, $Array<T & unknown[]>>

    : T extends readonly unknown[]
    ? Search<Needle, Limit, Acc, $Tuple<T>>

    : T extends GenericFree
    ? Search<Needle, Limit, Acc, $Free<T>>

    : T extends Fn
    ? Search<Needle, Limit, Acc, $Fn<T>>

    : T extends { [k: PropertyKey]: unknown }
    ? Search<Needle, Limit, Acc, $Struct<T>>

    : NOT_FOUND;
```
You can tell that I invoke some kind of constructor for each special case, taking `T` as an argument. Here is what their definitions look like:

```typescript
interface $Array<T extends readonly unknown[]> extends $Iterator {
    value: Const<T[number]>
    path: Const<[number]>
    done: $Done
}

interface $Tuple<T extends readonly unknown[]> extends $Iterator {
    value: $GetValue<T>
    path: $GetPath
    done: $Done<T>
}

interface $Struct<T, Keys extends (keyof T)[] = GetKeys<T>> extends $Iterator {
    value: $GetValue<T, Keys>
    path: $GetPath<Keys>
    done: $Done<Keys>
}

interface $Fn<
    T extends Fn,
    P extends unknown[] = [...Parameters<T>, ReturnType<T>]
> extends $Iterator {
    value: $GetValue<P>
    path: $GetPath<Prev<P['length']>>
    done: $Done<P>
}

interface $Free<T, U extends Unwrapped = unwrap<T>> extends $Iterator {
    value: $GetValue<U['args']>
    path: $GetPath<U['type']>
    done: $Done<U['args']>
}
```
```typescript
// with
type $Iterator = {
    value: $Accessor,
    path: $Accessor<unknown[]>,
    done: $Accessor
};

type $Accessor<R = unknown> = Type<[number], R>;
```
Work is sometimes performed in the "constructor" via a second parameter. I could also have used an additional field.

Each of the classes implement their own `$GetValue`, `$GetPath` and `$Done` methods (with occasional sharing).

Here is how one of the methods is defined for each class:

```typescript
// $Array uses a constant

// $Tuple
interface $GetPath extends $Accessor {
    type: [A<this>]
}

// $Struct
interface $GetPath<Keys extends unknown[]> extends $Accessor {
    type: [Keys[A<this>]]
}

// $Fn
interface $GetPath<Last extends number> extends $Accessor {
    type: A<this> extends Last ? [Output] : [Param<A<this>>]
}

// $Free
interface $GetPath<$T extends Type> extends $Accessor {
    type: [$T, A<this>]
}
```
Now `Search` doesn't exactly look pristine, but I hope your imagination can appreciate how worse it could have got.
```typescript
type Search<
    Needle,
    Limit extends number,
    Acc extends unknown[][],
    $I extends $Iterator,
    I extends number = 0,
    Shallow extends ShallowSearchResult = ShallowSearch<Needle, Limit, $I>,
    Deep extends unknown[][] = [],
    Path extends unknown[] = apply<$I['path'], [I]>,
    End = apply<$I['done'], [I]>,
    L extends number = number & Subtract<Limit, Shallow['total']['length']>
> = (L extends 0 | never ? true : End) extends true
    ? MergeSearchResult<Acc, Shallow['total'], Deep, Needle>
    : Search<
        Needle, Limit, Acc, $I, Next<I>, Shallow,
        Path extends Shallow['total'][number] ? Deep : [
            ...MergeDeduplicate<Shallow['partial'], Deep>, 
            ...DeepSearch<Needle, L, Acc, apply<$I['value'], [I]>, Path>
        ]
    >;
```
Our calls to `apply<$I['methodName'], [I]>` replaced annoying special casing. One can argue that the case of `$Array` is a little degenerate, we could have handled it outside of `Search`, but it makes our code a little more systematic and easy to read.

Polymorphism helped us streamline a non-trivial utility type and separate concerns. I grant you that it is a little verbose, but it is also boring. When is the last time you wrote a boring utility type of such a scale?

## Reuse&nbsp;[↸](#use-cases)

A single free type can have a fertile and type-safe life.

Take the procedural type `$Stitch`:
```typescript
import { $Stitch } from 'free-types';

type FooBar = apply<$Stitch, ['-', 'foo', 'bar']> // "foo-bar"
```
We can partially apply it to create special-purpose types:
```typescript
// With this familiar syntax, if you decide to implement it
type $Concat = $Stitch<''>;

type Concatenated = apply<$Concat, ['foo', 'bar']>;
// "foobar"
```
```typescript
// `partial` or `partialRight` are always an option
import { partial } from 'free-types';

type $Amazed = partial<$Concat, ['Waw, ']>;

type Reaction = apply<$Amazed, ['this UI is gorgeous']>;
// "Waw, this UI is gorgeous"
```
We can compose more complex types:
```typescript
import { Flow } from 'free-types';

type $OverReact = Flow<[$Amazed, partialRight<$Concat, ['!!!!']>]>;

type OverReaction = apply<$OverReact, ['look at this website']>;
// "Waw, look at this website!!!!"
```

Arguments can be modified before they are applied:
```typescript
import { $Before, Const } from 'free-types';

type $Drunk = $Before<$Amazed, Const<'*hips*'>>;

type Failure = apply<$Drunk, ['The space in the Schwarzschild metric does not expand']>;
// "Waw, *hips*"
```
We can map over elements of a list or object:
```typescript
import { MapOver } from 'free-types';

type Facts = ['the Moon is a satellite', 'France is not in Canada'];
type RealityShowQuotes = MapOver<Facts, $Amazed>;
// [
//  "Waw, the Moon is a satellite"
//  "Waw, France is not in Canada"
//]
```
Arguments can be routed from lists or objects:
```typescript
import { Lift } from 'free-types';

type FirstNames = { a: 'Alan', b: 'Grace' };
type LastNames = { a: 'Turing', b: 'Hopper' };

type Names = Lift<$Stitch<' '>, [FirstNames, LastNames]>;
// { a: "Alan Turing", b: "Grace Hopper" }
```
One can't mention `map` or `lift` without `reduce`:
```typescript
import { Reduce } from 'free-types';

type $Hesitation = $Stitch<', you know, '>;
type Sentence = ['Well', 'it may just be a habit', 'or some other cause'];

type HesitantSpeech = Reduce<Sentence, $Hesitation>
// "Well, you know, it may just be a habit, you know, or some other cause"
```
There is nothing stopping a higher order type from being a free-type itself:
```typescript
import { $Reduce } from 'free-types';

type $BarackObama = $Reduce<$Stitch<' . . . '>>;

type ObamaSpeech = apply<$BarackObama, [Sentence]>;
// "Well . . . it may just be a habit . . . or some other cause"
```
