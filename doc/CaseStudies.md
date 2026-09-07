# free-types

[free-types](../README.md) | **[Case studies](./CaseStudies.md)** | [Documentation](./Documentation.md) | [Guide](./Guide.md)

# Case studies

[Dependency inversion](#dependency-inversion) | [Polymorphism](#polymorphism)

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
const unwrapPayload = <T>({ payload }: MyAction<T>) => payload;

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
// type appendReducer: (state: Encrypted[], action: MyAction<Encrypted>) => Encrypted[]
```
Free types enabled us to invert dependencies: `$Action` is owned by the library and the user code depends on it. We were able to specify both the input and the output types, and our contract kept both the implementer and the user honest across packages.

## Polymorphism&nbsp;[↸](#use-cases)

When a type-level algorithm must handle special cases, free types enable defining a common interface so that the algorithm is written once.

[type-lenses](https://github.com/geoffreytools/type-lenses) finds the paths to a value inside an arbitrary type: a tuple, an array, an object, a function, or a type such as `Map` which free types can unwrap. It walks each shape one index at a time, through an iterator which follows this contract:

```typescript
import { Type } from 'free-types';

type $Iterator = {
    /** the value at an index */
    value: $Accessor,
    /** the path to the value at an index */
    path: $Accessor<unknown[]>,
    /** whether an index is past the end */
    done: $Accessor
};

type $Accessor<R = unknown> = Type<[number], R>;
```

A tuple and an object implement it this way:

```typescript
import { A } from 'free-types';

interface $Tuple<T extends readonly unknown[]> extends $Iterator {
    value: $TupleValue<T>
    path: $TuplePath
    done: $TupleDone<T>
}

interface $TupleValue<T extends readonly unknown[]> extends $Accessor {
    type: T[A<this>]
}

interface $TuplePath extends $Accessor {
    type: [A<this>]
}

interface $TupleDone<T extends readonly unknown[]> extends $Accessor {
    type: A<this> extends T['length'] ? true : false
}

interface $Struct<T, Keys extends (keyof T)[]> extends $Iterator {
    value: $StructValue<T, Keys>
    path: $StructPath<Keys>
    done: $StructDone<Keys>
}

interface $StructValue<T, Keys extends (keyof T)[]> extends $Accessor {
    type: T[Keys[A<this>]]
}

interface $StructPath<Keys extends unknown[]> extends $Accessor {
    type: [Keys[A<this>]]
}

interface $StructDone<Keys extends unknown[]> extends $Accessor {
    type: A<this> extends Keys['length'] ? true : false
}
```

The search applies the iterator, and never branches on a shape:

```typescript
import { apply, Next } from 'free-types';

type ShallowSearch<
    Needle,
    $I extends $Iterator,
    I extends number = 0,
    Paths extends unknown[] = []
> = (
    apply<$I['done'], [I]> extends true ? Paths
    : apply<$I['value'], [I]> extends Needle
    ? ShallowSearch<Needle, $I, Next<I>, [...Paths, apply<$I['path'], [I]>]>
    : ShallowSearch<Needle, $I, Next<I>, Paths>
);

type InTuple = ShallowSearch<number, $Tuple<[1, 'a', 2]>>;
// [[0], [2]]

type InObject = ShallowSearch<number, $Struct<{ a: 1, b: 'a', c: 2 }, ['a', 'b', 'c']>>;
// [["a"], ["c"]]
```

The search in type-lenses also goes deep, breadth first, and stops at a given number of results. Each of these features is written once and works for every shape. Supporting a new shape means writing an iterator, and the search does not change.
