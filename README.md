# free-types

**[free-types](./README.md)** | [Case studies](./doc/CaseStudies.md) | [Documentation](./doc/Documentation.md) | [Guide](./doc/Guide.md)

A type-level library enabling the creation and the manipulation of type constructors which can be detached from their type parameters.

Such "free" type constructors can be passed around and composed, making known programming patterns also available at the type level.

```ts
import { Type, apply } from 'free-types'

// From any type constructor
class Foo<T extends number> {
    constructor(private value: T) {}
}

// We can define a type, free from its parameters
interface $Foo extends $Contract {
    type: Foo<this['arg'][0]>
}

// Implementing some contract, carrying their information
type $Contract = Type<[number]>;

// And apply it at a later time, for example in library code
type Foo42 = ApplyWith42<$Foo>;
//    ^? type Foo42 = Foo<42>

// With no knowledge of the concrete implementation
type ApplyWith42<$T extends $Contract> = apply<$T, [42]>;


```
[playground ⮺](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAbzgFQJ5gKYBo4EMxgA2qcAvnAGZQQhwDkVGGAtDOhgM50BQ3A9HzgAxarVwA7Em0xwAxhHEcYUAK6yY0brMK4OHYRAgAeZHAwAPGBnEATfeJUgARhigA+RNzje5CpavVoAAowKGAAN1wrOEjCFQwALhQASkRSbnT+QQB1DDkJOBsMCmBxPNw4aWxKKCYamjhgGH0wXChcEAwrKA5uUu6KXFk8gBIhQzNLazs4EYBhBWUh+AQvHyqk8eMYAAtgDgBtOjaAczoAXQOABnO3DN4BOABJcEIMTvEYUpO4Dho8+SfdrqHCyNpQVDfSo7DDAKCNcQUaAgKLABTcKqzBZA5ZwAC8KHYRgODmcrluAG4HoIAIK2PAEYiNeBRPBwHTdSqgapI+EWDpEPKldnAJztCG+IoY9gGCAAFgATPi4DTGahsk0doqjGNDG4qY8fAA9AD81LgGt2cHEEDgAGsbQB3N42E55CAUaEAhSyWrRUCCj4wVHozGqojqzXakamCxWWz6eaLYEwDwE-ARnXIHAHRWUoA)

The goal of the library is to support dependency inversion and type-level programming. Features include:

- type constraints on the parameters and on the return type;
- named, optional and variadic parameters;
- partial application, and composition with adapters;
- contravariance in higher order types;
- type constructor inference;
- a few experimental features such as pattern matching with destructuring.

Related project: [type-lenses](https://github.com/geoffreytools/type-lenses)

## How to use

```
npm install free-types
```

### Import paths

- `free-types`\
  core features + compose, adapt and lift free types

- `/core`\
  create, apply and unwrap free types

- `/strings` `/arithmetic` `/logic` `/tuples`\
  ready-made free types also under the barrel `/utility-types`

- `/experimental`\
  features which API is not stable or performance not optimized


## A few use cases

<details>
<summary><h3>Extending behaviour across packages</h3></summary>
<br>

1) Our library provides some type `Foo` which takes a subtype of `number` and must return a subtype of `number[]`;
1) We want our users to be able to extend the behaviour of `Foo`. To achieve this, we create some kind of interface `TN` which we export alongside `Foo`.
<table>
<tr><th align='center' width='50%'>module augmentation<th align='center' width='50%'>free-type</tr>
<tr>
<td valign='top'>
<div align='center'><strong>In package <code>foo</code></strong></div>

```typescript
//

export type Foo<
    T extends keyof TN<V>,
    V extends number
> = [0, ...TN<V>[T]]

export interface TN<V extends number> {}
```
<div align='center'><strong>In user package</strong></div>

```typescript
// Implementations ---------------------

import { TN } from 'foo';


declare module 'foo' {
   interface TN<V extends number> {
     T1: [V]

     // Breaks contract without warning
     T2: [V, '2']

     // Deferred warning
     Id: V
   }
}

// Main --------------------------------

import { Foo } from 'foo';


type R1 = Foo<'T1', 1>; // [0, 1]

// Breaks contract without warning
type R2 = Foo<'T2', 1>; // [0, 1, '2']

// Deferred warning
type RI = Foo<'Id', 1>; // [0, ...any[]]
```
</td><td valign='top'>
<div align='center'><strong>In package <code>foo</code></strong></div>

```typescript
import { Type, apply } from 'free-types';

export type Foo<
    $T extends $TN,
    V extends number
> = [0, ...apply<$T, V>]

export type $TN = Type<[number], number[]>
```
<div align='center'><strong>In user package</strong></div>

```typescript
// ---------------------------------------

import { $TN } from 'foo';
import { A } from 'free-types';

export interface $T1 extends $TN
    { type: [A<this>] }

// Error: $T2 incorrectly extends $TN
export interface $T2 extends $TN
    { type: [A<this>, '2'] } 

// Error: $Id incorrectly extends $TN
export interface $Id extends $TN
    { type: A<this> }


// ---------------------------------------

import { Foo } from 'foo';
import { $T1, $T2, $Id } from './utils';

type R1 = Foo<$T1, 1>; // [0, 1]

// $T2 does not satisfy the constraint $TN
type R2 = Foo<$T2, 1>; // [0, 1, '2']

// $Id does not satisfy the constraint $TN
type RI = Foo<$Id, 1>; // [0, ...any[]]

```
</td></tr>
<tr>
<td valign='top'>

1) Foreign packages are not loaded into our workspace, so type checking is deferred until `Foo` is compiled. `tsc --watch` also has to be restarted after `foo` is installed;

1) The contract on the return type of `TN` implementations is tacit and cannot be stricter than `unknown[]` (the minimum required for `Foo` to compile).

1) Passing strings as an argument is unclear, and variants could be defined anywhere because `TN` is global and stateful;

<td valign='top'>

1) `$TN` carries all the information required for type checking to take place immediately, both on the call site and on the implementation site;<br><br>

1) We were able to express that `$TN` implementations must return `number[]`, not just `unknown[]`.<br><br>

1) Passing types as an argument is self-evident and familiar (higher order functions), and their definition can easily be looked up;

</tr>
</table>

</details>

<details>
<summary><h3>Abstracting over type constructors</h3></summary>

We want to write a little util to widen a type, similar to how TS widens values:

```typescript
const foo = { a: 'foo', b: 2 }; // { a: string, b: number }
type Foo = Widen<{ a: 'foo', b: 2 }> // { a: string, b: number }
```


<table>
<tr><th align='center' width='50%'>vanilla<th align='center' width='50%'>free-type</tr>
<tr><td valign='top'>

```typescript
//

type Widen<T> =
  : T extends string ? string
  : T extends number ? number
  : T extends boolean ? boolean

  : T extends Set<string>
  ? Set<string>
  : T extends Set<number>
  ? Set<number>
  : T extends Set<boolean>
  ? Set<boolean>
  // WeakSet
  // Map
  // WeakMap
  // Promise
  // ...

  : T extends Mappable
  ? { [K in keyof T]: Widen<T[K]> }
  : T

type Mappable = unknown[] | {
    [k: PropertyKey]: unknown
}
```
</td><td valign='top'>

```typescript
import * as $ from 'free-types';

type Widen<T> =
  : T extends string ? string
  : T extends number ? number
  : T extends boolean ? boolean

  : $.unwrap<T> extends {
    type: infer $T extends $.Type,
    args: infer A extends unknown[]
  } ? $.apply<$T, Widen<A>>

  : T extends Mappable
  ? { [K in keyof T]: Widen<T[K]> }
  : T

type Mappable = unknown[] | {
    [k: PropertyKey]: unknown
}
```
</td></tr>
<tr>
<td valign="top">

1) We can't possibly enumerate every combination of built-in types, it would go on and on and on;

2) Our implementation is not open for extension, there is no way we can deal with user classes.

<td valign="top">

1) [`unwrap`](./Documentation.md/#unwrapt-ts) relies on [`TypesMap`](./Documentation.md/#typesmap) which already includes built-in type constructors;

2) `TypeMap` can be extended with module augmentation. `unwrap` also optionally  accepts a custom map/tuple of free types to narrow down the search.
</tr>
</table>

A more elaborate version of [`Widen`](./Documentation.md/#wident-ts-i) is exported by the library.

</details>

<details>
<summary><h3>Higher level utility types</h3></summary>

We have two types, `And` and `Or`, which work with 2 arguments and we want to implement the same behaviour for any number or arguments.
<table>
<tr><th align='center' width='50%'>ad hoc implementation<th align='center' width='50%'>free-type</tr>
<tr>
<td valign='top'>

```typescript
// 

type List = [unknown, ...unknown[]];

type AndN<
    L extends List,
    I extends number = 0,
    R = never
> = I extends L['length'] ? R
    : [L[I]] extends [never] ? never
    : AndN<L, Next<I>, L[I]>;

type OrN<
    L extends List,
    I extends number = 0,
    R = never,
> = I extends L['length'] ? R
    : OrN<L, Next<I>,
        [L[I]] extends [never]
        ? R : L[I]
    >;
```
</td><td valign='top'>


```typescript
import { Reduce } from 'free-types';

type List = [unknown, ...unknown[]];

type AndN<L extends List> =
    Reduce<L, $And>;

type OrN<L extends List> =
    Reduce<L, $Or>;

interface $And extends Type<2> {
    type: And<A<this>, B<this>>
}

interface $Or extends Type<2> {
    type: Or<A<this>, B<this>>
}
```
<details><summary>Or alternatively</summary>

```typescript
import { $Reduce } from 'free-types';

type $AndN = $Reduce<$And>;
type $OrN = $Reduce<$Or>;
```
We can get rid of `L` and `List` at the cost of having to call `$AndN`
and `$OrN` with `apply`.

</details>
</tr>
<tr>
<td valign='top'>

1) We did not bother reuse `And` and `Or`, because we had to write a lot of code anyway, and in doing so we came up with something smarter;

1) `AndN` and `OrN` would have to be tested, and we know how testing *types* can be overlooked;

1) If we had to maintain this, we would have to step through the tail-recursive algorithm.

<td valign='top'>

1) `Reduce` saved development time and prevented mistakes by encouraging reuse and reducing the amount of non-trivial code written;

1) Reusing working code is safer than starting from scratch. Here `AndN` and `OrN` can even be proven correct;

1) The resulting code is very readable, provided we are familiar with the pattern, which is common in JS.
</tr>
</table>

</details>

<details>
<summary><h3>Pattern matching</h3></summary>

The listing on the left is an abridged excerpt from actual code where we wanted to switch on a pair of inputs `A` and `B`.

We can't pattern match on a tuple if we need control flow analysis to carry over:
```typescript
type Bar<A extends 1, B extends 1> = ...
type Foo<A, B> = [A, B] extends [1, 1] ?  Bar<A, B> : never
// type 'A' doesn't satisfy constraint '1'   ---
```

Without free types, we have no other choice than to nest conditionals:
- because shutting off type checking with an intersection would be error prone, moreover intersections are not always transparent and can produce unwanted results;
- because an implementation of `Match` taking plain utility types would eagerly evaluate them, regardless of which clause (if any) is a match.

<table>
<tr><th align='center' width='50%'>vanilla<th align='center' width='50%'>free-type</tr>
<tr>
<td valign='top'>

```typescript
type Foo<A, B, V> =
  A extends O
    ? B extends F
      ? R1<B, V>
      : never
  : A extends P
    ? B extends F
      ? R2<V, A, B>
      : never
  : A extends K
    ? B extends U
      ? R3<B, A, V>
        : B extends N
        ? R4<V, A, B> 
        : never
  : A extends S
    ? B extends W
      ? V
      : never
  : A extends T
    ? B extends W
      ? R5<A, V>
      : never
  : never
```
</td>

<td valign='top'>

```typescript
import { Match } from 'free-types/experimental';

type Foo<A, B, V> =
    Match<[A, B], [
        [ [O, F], $R1<V>, [1] ],
        [ [P, F], $R2<V> ],
        [ [K, U], $R3<V> ],
        [ [K, N], $R4<V> ],
        [ [S, W], V ],
        [ [T, W], $R5<V>, [0] ]
    ]>
```
</td>
</tr>
<tr>
<td valign='top'>

1) Clauses depend on each-other, making it is easy to miss a case or misinterpret what falls through to the last branch;

1) A good part of the code is plumbing and indentation hell.
<td valign='top'>

1) Every case is scoped (notably the ones in which `A` extends `K`). The cognitive load is lower;

2) The wiring disappears to let your domain show through.
</tr>
</table>

</details>

<details>
<summary><h3>Composition</h3></summary>

We have 2 types `F<A, B>` and `G<T>`. We want to create a type `H` such that `H<A, B> = G<F<A, B>>` (provided the types line up).

<table>
<tr><th align='center' width='50%'>vanilla<th align='center' width='50%'>free-type</tr>
<tr><td valign='top'>

```typescript
import { F, G, CA, CB } from './FG.ts';

type H<A extends CA, B extends CB> =
    G<F<A, B>>;
```
</td><td valign='top'>

```typescript
import { $F, $G } from './FG.ts';

type $H = Flow<[$F, $G]>;


```
</td></tr>
<tr>
<td valign="top">

1) The cost of repeating or even bringing into scope type constraints makes the pattern unappealing;

1) `H` needs to know a great deal about `F` constraints.

<td valign="top">

1) The ideal of using better named / simpler types becomes more reachable;

1) Combinators such as `Flow` take care of the wiring of type constraints and hide unnecessary details.

</tr>
</table>


### Other composition patterns

A single free type can have a fertile and type-safe life.

Take the procedural type `$Stitch`:
```typescript
import { apply } from 'free-types';
import { $Stitch } from 'free-types/strings';

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
import { Flow, partialRight } from 'free-types';

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

</details>

## Quirks and limitations

- A free type is evaluated a first time when it is defined, without arguments.\
  The [guide](./doc/Guide.md#evaluation) explains how to define a good fallback for its return type.

- A type constraint on a free type's parameter can't depend on another one,\
  nor run procedural checks on its argument, because it does not exist yet.

- writing more abstract code in general will make you hit TS own quirks and gaps more often.\
  Many free-types utils give you an escape hatch so your code still compiles

- Some free-types conveniences can impact performance.\
  The [guide](./doc/Guide.md#performance) explains how to keeping it under control.
