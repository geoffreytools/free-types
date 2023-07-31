# free-types

**[free-types](./README.md)** | [Use Cases](./doc/UseCases.md) | [Documentation](./doc/Documentation.md) | [Guide](./doc/Guide.md) | [Algebraic data types](./doc/ADTs.md)

A type-level library enabling the creation and the manipulation of type constructors which can be detached from their type parameters.

Such "free" type constructors can be passed around and composed, making known programming patterns also available at the type level.

The goal of this library is to support type-level programming and dependency inversion. Distinctive features are support for: type constraints, partial application, composition with built-in adapters and higher order types, type constructor inference, all sorts of arities and a few experimental features such as pattern matching with destructuring.

Related projects: [free-types-transform](https://github.com/geoffreytools/free-types-transform), [type-lenses](https://github.com/geoffreytools/type-lenses).

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

If you don't know what to do with this, here are a few [use cases](./doc/UseCases.md). More utils can be found in the [documentation](./doc/Documentation.md) and you can also follow the [guide](./doc/Guide.md) if you want to make the most out of the library and understand how it works.

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
