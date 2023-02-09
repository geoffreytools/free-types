# free-types

**[free-types](./README.md)** | [Documentation](./doc/Documentation.md) | [Guide](./doc/Guide.md) | [Algebraic data types](./doc/ADTs.md)

A type-level library enabling the creation and the manipulation of type constructors which can be detached from their type parameters.

Such "free" type constructors can be passed around, composed and partially applied, making known programming patterns also available at the type level.

The goal of this library is to be more general purpose than existing implementations focussing on algebraic data types. A dinstinctive feature is that it supports type constraints (with [limitations](#limitations-and-pain-points)). It is also simpler to use than implementations relying on module augmentation.

Related projects: [free-types-transform](https://github.com/geoffreytools/free-types-transform), [type-lenses](https://github.com/geoffreytools/type-lenses), [ts-spec](https://github.com/geoffreytools/ts-spec)

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
## The life of a free type

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
