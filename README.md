# free-types

**[free-types](./README.md)** | [Documentation](./doc/Documentation.md) | [Guide](./doc/Guide.md) | [Algebraic data types](./doc/ADTs.md)

A type-level library enabling the creation and the manipulation of type constructors which can be detached from their type parameters.

Such "free" type constructors can be passed around and composed, making known programming patterns also available at the type level.

The goal of this library is to support type-level programming and dependency inversion. Distinctive features are support for: type constraints, partial application, composition with built-in adapters and higher order types, type constructor inference, all sorts of arities and a few experimental features such as pattern matching with destructuring.

Related projects: [free-types-transform](https://github.com/geoffreytools/free-types-transform), [type-lenses](https://github.com/geoffreytools/type-lenses).

## Why

The types we write do not improve performance and disappear at runtime. Being able to write a type that is wrong makes the pain that is maintaining types utterly useless. Higher kinded types enable expressive and terse type transformations, but it should not be at the expense of type safety, and there is no reason for you not to be guided by the compiler as you chain higher order types and combinators.

This conviction made me tackle the harder problem of implementing higher kinded types with the acknolegment of, and support for, type constraints. When I designed this library, the only implementations of HKT were things like [pelotom/hkts](https://github.com/pelotom/hkts), [SimonMeskens/TypeProps](https://github.com/SimonMeskens/TypeProps) or [gcanti/fp-ts](https://github.com/gcanti/fp-ts) with a focus on implementing algebraic data types. I am now seeing more general purpose implementations which have many merits but I stand by my commitment to promote type safety in type-level programming, which was also the motivation behind [ts-spec](https://github.com/geoffreytools/ts-spec).

## How to install

```
npm install free-types
```

## How to use
Given a generic class `Foo` with some type constraint:
```typescript
class Foo<T extends number> {
    constructor(private value: T) {}
}
```
We can create a free type constructor:
```typescript
import { Type, A } from 'free-types'

interface $Foo extends Type<[number]> {
    type: Foo<A<this>>
}
```
Which can then be passed as an argument to another type responsible for applying it.
```typescript
import { apply } from 'free-types';

type Foo42 = Apply42<$Foo>; // Foo<42>

type Apply42<$T extends Type<[number]>> = apply<$T, [42]>;
```

## Dependency inversion

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

## Reuse

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
And all of this is type safe.

You can find many more utils in the [documentation](./doc/Documentation.md). You can also follow the [guide](./doc/Guide.md) if you want to make the most out of the library and understand how it works.

Happy typing!

## Limitations and pain points

Workarounds for the following problems can be found in the guide and in the documentation:

1) The expansion/evaluation of free types is not deferred until they receive arguments;

1) Types using procedural type constraints don't work well with generics;

1) Free types currently support neither dependent type constraints nor procedural type constraints;

1) Free types arguments are covariant;

1) Intersected tuples don't spread properly.

### Type safety

I was a bit heavy on type safety, in part to prove that it could be made type safe. As a result, some types are harder to use than they should, especially given that some limitations make correct expression not compile. I usually deal with this with an optional parameter, which is terrible. I am very open to discussion on that matter.

### Performance

My experience with free-types is that the overhead is not an issue unless you nest them like crazy. A good example is [Show](https://github.com/geoffreytools/free-types/blob/public/src/experimental/Show.ts) which I purposefully wrote with combinators staked on top of combinators in a big recursive switch. Benchmarking it against a vanilla implementation is on my todo list but it's clearly a monster type. My advice is to be reasonable and to remember that real programming happens at runtime.

I experimented a lot with this library, not everything is optimised, which is why I divided it into subsets to clarify their level of performance and value.

Querying a subset also has an impact on the initial type instantiation duration, so you are advised to import only what you need if you can't rely on incremental builds.

- `free-types/core`\
    everything you need to create, apply and unwrap free types\
    takes 125-210ms to instantiate with tsc --generateTrace

- `free-types/essential`\
    composed of `core` + everything you need to compose, adapt and lift free types\
    takes 450-500ms to instantiate with tsc --generateTrace
    
- `free-types`\
    composed of `essential` + `utility-types`\
    takes 660-725ms to instantiate with tsc --generateTrace

- `utility-types`\
    companion types divided into subsets such as `/strings`, `/arithmentic`, `/logic` or `/tuples`

- `experimental`\
    companion types: `From`, `FromDeep`, `Match`, `Widen` and `Show`
