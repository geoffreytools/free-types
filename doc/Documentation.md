# free-types

[free-types](../README.md) | **[Documentation](./Documentation.md)** | [Guide](./Guide.md) | [Algebraic data types](./ADTs.md)

# Documentation

  [Creation](#creation)
| [Helpers](#helpers-)
| [Application](#application)
| [Decomposition](#decomposition)
| [Composition](#composition-)
| [Adapters](#adapters)
| [Higher order types](#higher-order-types)
| [Operators](#operators-and-other-utils)

#### Foreword

In this documentation the types `Mappable` and `NonEmptyMappable` appear often. I use them to mean array and object literal types. The conflation of arrays and objects in one type is useful because no type definition can reject empty objects and thus expecting a `NonEmptyMappable` will force you to check that the input is not empty regardless of it being an array or an object.

### Creation
<table>
<tr><th>type</th><th>description</th></tr>
</td></tr><tr><td valign='top' width='210'><h6><code>Type<&#8288;Input?, Output?></code></td><td width='600'>


Extend `Type` with an interface to define a free type.

```typescript
interface $Foo extends Type {
    type: 'foo'
}
```
Access arguments with `this`:
```typescript
interface $Foo extends Type {
    type: this[0]
}
```

Define constraints on the inputs: 

```typescript
// variadic types with no constraint
interface $Foo extends Type { ... }
interface $Foo extends Type<number> { ... }
interface $Foo extends Type<unknown[]> { ... }

// Setting the arity:
interface $Foo extends Type<1> { ... }

// Setting the arity + a specific constraint:
interface $Foo extends Type<[number, number]> { ... }

// equivalent to the former:
interface $Foo extends Type<2> {
    constraints: [number, number]
    ...
}
```

Define constraints on the output: 

```typescript
interface $Foo extends Type<unknown[], string> {
    type: string
}
```

Public fields:

- `this['arguments']`: a copy of the arguments
- `$T['type']`: the return type
- `$T['constraints']`: the type constraints

</td></tr><tr><td valign='top'><h6><code>Const<&#8288;T></code></td><td>

Turn a type `T` into a constant `Type<❋, T>`, totally ignoring arity and type constraints on the input.

```typescript
type Foo = MapOver<[1, 2, 3], Const<'A'>>; // [A, A, A]
type Bar = MapOver<[1, 2, 3], $Next>; // [2, 3, 4]
```
</td></tr><tr><td valign='top'><h6><code>$Const</code></td><td>

A free version of `Const`

```typescript
type Consts = MapOver<[1,2,3], $Const>
//   Consts : [Type<❋, 1>, Type<❋, 2>, Type<❋, 3>]
```

</td></tr><tr><td valign='top' width='210'><h6><code>From<&#8288;T, Args?></code></td><td>

Create a new `Type` based upon a mappable type `T` using the tuple `Args` to determine which field to turn into a parameter and in what order they must be applied.

```typescript
type $Foo = From<{ a: number, b: string, c: boolean }, ['b', 'a']>;
type Foo = apply<$Foo, ['a', 1]>
//   Foo : { a: 1, b: "a", c: boolean }

type $Bar = From<[number, string, boolean], [1, 0]>;
type Bar = apply<$Bar, ['a', 1]>
//   Bar : [1, "a", boolean]
```
The values of `T` are used as type constraints:
```typescript
type Rejected = apply<$Foo, [1, 'a']>
//                          --------
type Rejected = apply<$Bar, [1, 'a']>
//                          --------
// [1, "a"] doesn't satisfy the constraint [string, number]
```
#### Optinal `Args`
When `Args` is omitted, the resulting free type *should* take as many arguments as there are fields in `T` in the same order as they appear in `T`:

```typescript
type $Foo = From<{ a: number }>;
type Foo = apply<$Foo, [1]>
//   Foo : { a: 1 }

type $Bar = From<[number, string]>;
type Bar = apply<$Bar, [1, 'foo']>
//   Bar : [1, "foo"]
```

The ordering of the arguments is only guarantied for tuples, so do supply `Args` when using `From` on multiple-fields objects.

</td></tr><tr><td valign='top' width='210'><h6><code>FromDeep<&#8288;T, Paths></code></td><td>

A variation of `From` which enables `Args` to be made of paths, in order to reach deep properties:

```typescript
type $Foo = From<
    { a: { b: [number, string], c: boolean } },
    [['a', 'b', 0], 'c']
>;

type Foo = apply<$Foo, [1, true]>
//   Foo : { a: { b: [1, string], c: true } }
```

I keep `From` and `FromDeep` separate for now because I expect the latter to perform worse. I may merge them in the future when my Typescript-foo improves.

</td></tr>

</td></tr><tr><td valign='top'><h6><code>$partial<&#8288;$T></code></td><td>

A free version of [`partial`](#partialt-args). Can be useful to mimic currying.

```typescript
type $Adders = MapOver<[1 ,2 ,3], $partial<$Add>>
//   $Adders : [$Add<1>, $Add<2>, $Add<3>]

type Results = Ap<$Adders, [4, 5, 6]> // [5, 7, 9]
```

</td></tr><tr><td valign='top' width='210'><h6><code>$apply<&#8288;Args?></code></td><td>

A free, flipped, version of [`apply`](#applyt-args) which applies `this[0]` with `Args`.

```typescript
type $Apply2 = $apply<[2]>;
type Result = apply<$Apply2, [$Next]> // 3
```
</table>

### Helpers [↸](#documentation)

Helpers you may use to reduce boilerplate or assist with type checking.
<table><tr><th>type</th><th>description</th></tr>

</td></tr><tr><td valign='top'><h6><code>Contra<&#8288;$T, $U></code></td><td>

Expect a free type with contravariant arguments.

```typescript
type Foo<$T extends Type & Contra<$T, Type<2>>> =
    apply<$T, ['foo', true]>

type Bar = Foo<$Add>
//             ~~~~
```

> The implementation is not type safe because the constraint is widened to `Type` (for the implementer)

</td></tr><tr><td valign='top'><h6><code>At<&#8288;I, this, F?></code></td><td>

Check the indexation of `this` to prevent overshooting the arity:

```typescript
interface $Foo extends Type<1> { type: At<1, this> }
//                                           ----
// 'this' does not satisfy the constraint 'Type<2>'
```

>It mainly prevents off-by-one errors or forgetting to wrap type constraints in brackets (`Type<number> ≠ Type<[number]>`)

Optionally take a fallback `F` to replace `unknown`:

```typescript
interface $UnaryFunction extends Type<2> {
    type: (a: At<0, this, any>) => At<1, this>
}

type ReturnType = $UnaryFunction['type'] // (a: any) => unknown
```

</td></tr><tr><td valign='top' width='210'><h6><code>A|B|C|D|E<&#8288;this?></code></td><td>

Similar to [`At`](#ati-this), but also defuses type constraints with an **intersection**:

```typescript
interface $Foo extends Type<[string]> {
    type: `${A<this>}`
}
```
Is equivalent to:
```typescript
interface $Foo extends Type<[string]> {
    type: `${this[0] & string}`
}
```
When no argument is supplied, `A|B|C|D|E` are aliases for `0|1|2|3|4`:

```typescript
interface $Foo extends Type<[unknown, unknown[]]> {
    type: [A<this>, ...Checked<B, this>]
}
```

Is equivalent to:
```typescript
interface $Foo extends Type<[unknown, unknown[]]> {
    type: [this[0], ...Checked<1, this>]
}
```

</td></tr><tr><td valign='top'><h6><code>Checked<&#8288;I, this, F?></code></td><td>

Similar [`At`](#ati-this), but also defuses type constraints with an **inline conditional**:

```typescript
interface $Foo extends Type<[string]> {
   type: `${Checked<0, this>}`
}
```
Is equivalent to:
```typescript
interface $Foo extends Type<[string]> {
   type: `${this[0] extends string ? this[0] : string}`
}
```

`F` allows you to specify a fallback value, which by default is `this['constraints'][N]`.

</td></tr><tr><td valign='top'><h6><code>Lossy<&#8288;I, this></code></td><td>

A more general version of [`A|B|C|D|E`](#abcdethis), working for any arity:

```typescript
interface $Foo extends Type<[string]> {
    type: `${Lossy<0, this>}`
}
```
Is equivalent to:
```typescript
interface $Foo extends Type<[string]> {
    type: `${this[0] & string}`
}
```
</td></tr><tr><td valign='top'><h6><code>IsUnknown<&#8288;T></code></td><td>

Determine if `T` is strictly `unknown` (that is to say: excluding `any` and `never`).

`unknown` is the default value of every parameter and checking for it can help in situations where you need to tune the implicit return type of your free type with a surrounding conditional.

</td></tr><tr><td valign='top'><h6><code>Signature<&#8288;$T | $T[]></code></td><td>

A simple util which exposes `$T['constraints]` and `$T['type']`. Useful to to quickly inspect the signature of one or multiple free types at once.

</td></tr><tr><td valign='top'><h6><code>Remaining<&#8288;$T, N></code></td><td>

Alternate way to expect a free type in a type constraint by specifying the number `N` of arguments left to apply to `$T`:

```typescript
interface $Foo extends Type<[number, string]> { ... }
type Foo<$T extends Remaining<$Foo, 1>> = apply<$T, ['foo']>
```
`$T` can simply be an interface:
```typescript
type $I = Type<[number, string]>
type Foo<$T extends Remaining<$I, 1>> = apply<$T, ['foo']>
```

</td></tr><tr><td valign='top'><h6><code>Widen<&#8288;T, $Ts?, I?></code></td><td>

Deeply widen a type `T`:

```typescript
type Foo = Widen<(a: 1) => Promise<{ a: 'bar', b: [true] }>>
//   Foo : (a: number) => Promise<{ a: string, b: [boolean] }>
```

Works out of the box on elements of [`TypesMap`](#typesmap), can otherwise be supplied a map/tuple of free types `$Ts` to search from.

```typescript
type Wider = Widen<Foo<1>, [$Foo]> // Foo<number>

class Foo<T> { constructor (private value: T){} }
interface $Foo extends Type<1> { type: Foo<this[0]> }
```

`Widen` ignores keys of type `_${string}` by default, in order to preserve branded types.

```typescript
type Foo<T> = { _tag: 'foo', value: T };
type Wider = Widen<Foo<5>> // { _tag: 'foo', value: number };
```

You can override this behaviour by providing your own pattern `I`.



</td></tr><tr><td valign='top'><h6><code>ToTuple<&#8288;T></code></td><td>

Turn a tuple-like `T`, usually the result of the intersection with `unknown[]`, into a proper tuple.

</td></tr><tr><td valign='top'><h6><code>Slice<&#8288;T, From, To></code></td><td>

Extract the range `[From, To[` from the tuple `T`. When `To` is omitted, slice up to the end of the tuple.

</td></tr><tr><td valign='top'><code>Head<&#8288;T></code></td><td>
Extract the first element of the non-empty tuple <code>T</code>.
</td></tr><tr><td valign='top'><code>Tail<&#8288;T></code></td><td>
Extract all but the first element of the non-empty tuple <code>T</code>.
</td></tr><tr><td valign='top'><code>Last<&#8288;T></code></td><td>
Extract the last element of the tuple <code>T</code> or return <code>[]</code> if it is empty.
</td></tr><tr><td valign='top'><code>Init<&#8288;T></code></td><td>
Extract all but the last element of the non-empty tuple <code>T</code>.
</td></tr>
</table>


### Application&nbsp;[↸](#documentation)

<table>
<tr><th>type</th><th>description</th></tr>

</td></tr><tr><td valign='top' width='210'><h6><code>apply<&#8288;$T, Args></code></td><td>

Apply a free type `$T` with all its arguments `Args` and evaluate the type.

```typescript
interface $Map extends Type<2> { type: MapOver<A<this>, B<this>> };
type Foo = apply<$Map, [string, number]> // MapOver<string, number>
```

</td></tr><tr><td valign='top'><h6><code>Generic<&#8288;$T></code></td><td>

Apply a free type `$T` with its type constraints.

It is mostly equivalent to `$T['type']`, but better handles types which have no sensible default return value:

```typescript
interface $Foo extends Type<[number]> {
    type: this[0] extends number ? Foo<this[0]> : never
    // try not to do this                         -----
}

type GenericFoo = Generic<$Foo> // Foo<number>
type ReturnType = $Foo['type']; // never
```
I don't think it suites procedural types as much as it does "concrete" types, which is why it is used internally in [`unwrap`](#unwrapt-from), but not in [`Flow`](#flowt).
</td></tr><tr><td valign='top'><h6><code>partial<&#8288;$T, Args, $Model?></code></td><td>

Return a new `Type` based upon `$T`, with `Args` already applied, expecting the remaining arguments.

```typescript
interface $Foo extends Type<3> {
    type: Foo<A<this>, B<this>, C<this>>
}

type $Foo1 = partial<$Foo, [1]>
type Foo = apply<$Foo1, [2, 3]> // Foo<1, 2, 3>
```

Optionally take a `$Model` argument for cases where `$T` is a generic. It should simply repeat the type constraint:

```typescript
type Foo<$Q extends Type<[number, string]>> =
    Bar<partial<$Q, [1], Type<[number, string]>>>
//                       ----------------------
type Bar<$Q extends Type<[string]>> = apply<$Q, ['bar']>
```

</td></tr><tr><td valign='top'><h6><code>partialRight</code></td><td>

Behaves the same as `partial`, but `Args` fills the rightmost parameters of your free type:
```typescript
type $Foo23 = partialRight<$Foo, [2, 3]>
type Foo = apply<$Foo23, [1]> // Foo<1, 2, 3>
```

</td></tr><tr><td valign='top'><h6><code>_partial<&#8288;$T, Args></code></td><td>

An experimental variant of `partial`, which also allows to skip arguments in the arguments list with the placeholder `_`.

```typescript
interface $Foo extends Type<3> {
    type: Foo<A<this>, B<this>, C<this>>
}

type $Foo13 = _partial<$Foo, [1, _, 3]>
type Foo123 = apply<$Foo13, [2]> // Foo<1, 2, 3>
```

`_partial` has this bug where applying a free type with generics does not appear to produce the correct type, even though it functions correctly:
```typescript
type Foo<A, B> = Bar<_partial<$Foo, [A, B]>>;
// "not a Type<1>"   ~~~~~~~~~~~~~~~~~~~~~~
type Bar<$T extends Type<1>> = apply<$T, ['bar']>
//                  -------
```
</td></tr><tr><td valign='top'><h6><code>$Optional<&#8288;$T, Args></code></td><td>

Partially apply `$T` with all the elements of `Args` which are not `never`

This is useful when defining a flexible API:
```typescript
interface $Box3 extends Type<[number, number, number]> {
    type: `${A<this>} x ${B<this>} x ${C<this>}`
}

type $Box<A extends number = never, B extends number = never> =
    $Optional<$Box3, [A, B]>
```
Free types defined this way can be partially applied with generics as well as with `partial`:
```typescript
type Foo = apply<$Box<1>, [2, 3]>; // "1 x 2 x 3"
type Bar = apply<$Box<1, 2>, [3]>; // "1 x 2 x 3"
```
> In some circumstances, when `T` is a generic, I found that a higher order type would reject a `$Box<T>` but would accept a `partial<$Box, [T]>`.

Fully applying `$T` with `$Optional` generates a `Type<0>` without evaluating it.

</td></tr><tr><td valign='top'><h6><code>_$Optional<&#8288;$T, Args></code></td><td>

The same as `$Optional`, but behaves like `_partial` instead of `partial`.

```typescript
type $Box<
    A extends number | _ = never,
    B extends number | _ = never,
    C extends number | _ = never
> = _$Optional<$Box3, [A, B, C]>

type Foo = apply<$Box<_, 2>, [1, 3]> // "1 x 2 x 3"
```

</td></tr><tr><td valign='top'><h6><code>$Alter<&#8288;$T, Args></code></td><td>

The same as `$Optional`, with the difference that fully applying `$T` evaluates the type:

```typescript
type Box<
    A extends number = never,
    B extends number = never,
    C extends number = never
> = $Alter<$Box3, [A, B, C]>

type Foo = Box<1, 2, 3> // "1 x 2 x 3"
type Bar = apply<Box<1, 2>, [3]> // "1 x 2 x 3"
```

Since free types are not first class, this behaviour may confuse users as it makes the `$` prefix convention pointless. The performance is also expected to be worse than applying whatever classic type `$T` is based of.
</td></tr>
</table>

### Decomposition&nbsp;[↸](#documentation)

<table>
<tr><th width='210'>type</th><th width='600'>description</th></tr>

</td></tr><tr><td valign='top'><h6><code>unwrap<&#8288;T, $From?></code></td><td>

Decompose a type `T` into a pair of its constituents: `{ type: Type, args: unknown[] }` or `never` if there is no match.

```typescript
type Pair = unwrap<Set<number>>;
//   Pair: Unwrapped<free.Set, [number]>
```
Works out of the box on elements of [`TypesMap`](#typesmap) which is the default value of `From`, can otherwise be supplied a `Type` to unwrap from:

```typescript
type A = unwrap<Foo<number>, $Foo>;
//   A: Unwrapped<$Foo, [number]>
```
or an object/tuple/interface containing `Types` to search from:
```typescript
type B = unwrap<Foo<number>, [$Foo, $Bar]>;
//   B: Unwrapped<$Foo, [number]>
```

`T` is limited to arities up to 5.

</td></tr><tr><td valign='top'><h6><code>unwrapDeep<&#8288;T, $From?></code></td><td>

Deeply decompose `T` the same way as `unwrap`.

```typescript
type Tree = unwrapDeep< MapOver<1, MapOver<2, MapOver<3, 'value'>> >;

// Tree: Unwrapped<free.Map, [
//     1, Unwrapped<free.Map, [
//         2, Unwrapped<free.Map, [
//             3, "value"
//         ]>
//     ]>
// ]>
```

</td></tr><tr><td valign='top'><h6><code>$unwrap</code></td><td>

A free version of `unwrap`.

</td></tr><tr><td valign='top'><h6><code>Unwrapped<&#8288;$T?, Args?></code></td><td>

A parameterised alias for the return value of [`unwrap`](#unwrapt-from).

`Args` is required to match `$T['constraints']`.

</td></tr><tr><td valign='top'><h6><code>TypesMap</code></td><td>

A global extensible map from names to `Type`, prepopulated by elements of the namespace [`free`](#free).

You can extend it with module augmentation:

```typescript
declare module 'free-types' {
    interface TypesMap { Foo: $Foo }
}

class Foo<T> { constructor (private value: T) {} }
interface $Foo extends Type<1> { type:  Foo<this[0]> }

```

</td></tr><tr><td valign='top'><h6><code>free</code></td><td>

A namespace containing a number of built-in type constructors:

```
• Promise        • Array          • Set          • Map         
• Function       • ReadonlyArray  • ReadonlySet  • ReadonlyMap 
• UnaryFunction  • Tuple          • WeakSet      • WeakMap     
• Record         • ReadonlyTuple
```

`free.Id` is the identity for unary types. It leaves the input untouched. It can be used for example as a default transformation:

```typescript
type Foo<$T = free.Id> = {
    foo: <A>(a: A) => apply<$T, [Bar<A>]>,
}

type SimpleFoo = Foo;
// { foo: <A>(a: A) => Bar<A> }

type FooAsync = Foo<free.Promise>
// { foo: <A>(a: A) => Promise<Bar<A>> }

type FooMap = Foo<partial<free.Map, [string]>>
// { foo: <A>(a: A) => Map<string, Bar<A>> }
```

`free.Tuple` returns its arguments list as a tuple. It can be thought of as the identity of n-ary types.

`free.Function` is a free version of `(...args: any[]) => unknown`, not `Function`.

`free.UnaryFunction` is of type `Type<2>`, making it easier to compose than `free.Function` which is of type `Type<[any[], unknown]>`:

```typescript
type URLs = {
    A: 'https://foo'
    B: 'https://bar'
}

type Responses = {
    A: { foo: number } 
    B: { bar: number }
}

type Queries = Lift<free.UnaryFunction, [URLs, Responses]>
// {
//     A: (a: "https://foo") => { foo: number };
//     B: (a: "https://bar") => { bar: number };
// }

type Commands = MapOver<URLs, partialRight<free.UnaryFunction, [void]>>
// {
//     A: (a: "https://foo") => void;
//     B: (a: "https://bar") => void;
// }
```
</td></tr>
</table>

### Composition [↸](#documentation)

You should read the [part of the guide](./Guide.md#composition) dedicated to composition

<table>
<tr><th>type</th><th>description</th></tr>

</td></tr><tr><td valign='top' width='210'><h6><code>$Before<&#8288;$T, $P, I?></code></td><td>

Map over the individual arguments of `$T` with `$P` before they hit `$T`.

```typescript
type $AbsAdd = $Before<$Add, $Abs>;
type Foo = apply<$AbsAdd, [1, -2]> // same as apply<$Add, [1, 2]>
```

Optionally take and index `I` to selectively transform the argument at this position.

</td></tr><tr><td valign='top' width='210'><h6><code>$Arg<&#8288;I></code></td><td>

Get the argument at index `I`

</td></tr><tr><td valign='top' width='210'><h6><code>Pipe<&#8288;Args, $T[]></code></td><td>

Apply the composition from left to right of the free types listed in `$T[]` with the arguments list `Args` .

```typescript
type Foo = Pipe<[1, 2], [$Add, $Next, $Exclaim]> // 4!
```

</td></tr><tr><td valign='top' width='210'><h6><code>PipeUnsafe<&#8288;Args, $T[]></code></td><td>

The same as `Pipe`, only unsafe. Contrary to the former it can be used with generics:

```typescript
type Works<T extends number> = PipeUsafe<[T], [$Next]>;
//                                       ---
```

</td></tr><tr><td valign='top'><h6><code>Flow<&#8288;$T[]></code></td><td>

Return the composition from left to right of the free types listed in`$T[]`.

```typescript
type $AddNextExclaim = Flow<[$Add, $Next, $Exclaim]>
type Foo = apply<[1, 2], $AddNextExclaim> // 4!
```

</td></tr>
</table>

### Adapters&nbsp;[↸](#documentation)

<table>
<tr><th>type</th><th>description</th></tr>

</td></tr><tr><td valign='top' width='210'><h6><code>$Arity<&#8288;N, $T></code></td><td>

Turn a variadic `Type` into a `Type<N>`.

</td></tr><tr><td valign='top' width='210'><h6><code>$Flip<&#8288;$T></code></td><td>

Turn a `Type<[A, B]>` into a `Type<[B, A]>` and apply arguments accordingly.


</td></tr><tr><td valign='top'><h6><code>$Rest<&#8288;$T, N?></code></td><td>

Turn a `Type<1>` expecting a Tuple of `N` elements into a `Type<N>`. `N` is usually inferred and needs not be provided.

```typescript
type With = apply<$Rest<$Foo>, [1, 2, 3]>;

// is equivalent to 
type Without = apply<$Foo, [[1, 2, 3]]>;
```

The parameter `N` is only required in situations where the tuple's length can't be statically known, for example in a composition using `Flow`.

</td></tr><tr><td valign='top'><h6><code>$Spread<&#8288;$T></code></td><td>

Turn a `Type<N>` into a `Type<1>` expecting a Tuple of `N` elements.

```typescript
type With = apply<$Spread<$Foo>, [[1, 2, 3]]>;

// is equivalent to 
type Without = apply<$Foo, [1, 2, 3]>;
```

</td></tr><tr><td valign='top'><h6><code>$Values<&#8288;$T></code></td><td>

A looser version of `$Spread` which turns a `Type<N>` into a `Type<1>` expecting a `Mappable`. Can be useful when working with mappable-returning types.

The length and ordering of the arguments are not type checked. Supernumerary arguments are ignored.

If you supply an *object type* to `$Values<$T>`, the ordering of arguments is **not guarantied**. Depending on context you may want to pair it with `$Constrain` to disallow objects, otherwise make sure `$T` is commutative.

</td></tr><tr><td valign='top'><h6><code>$Param<&#8288;I, $T></code></td><td>

Turn a `Type<1>` into a variadic `Type` discarding every argument except the one at index `I`.

```typescript
type With = apply<$Param<1, $Foo>, [1, 2, 3]>;

// is equivalent to 
type Without = apply<$Foo, [2]>;
```

</td></tr><tr><td valign='top' width='210'><h6><code>$Constrain<&#8288;$T, Cs></code></td><td>

Narrow the constraints of the free type `$T` using the tuple `Cs` and update the return type accordingly:

```typescript
type $SplitDash = $Constrain<$Split<'-'>, [`${string}-${string}`]>
```

If `Cs` and `$T['constraints']` are intersected with [`Intersect`](#$intersect)

The return type advertised in the signature is updated by applying `$T` with the new type constraints, which is usually not a problem, but in the case of `$SplitDash` it is going to give us `[string, string]`, which is wrong because `${string}` could be containing `-` and therefore we should have `[string, string, ...string[]]`

</td></tr><tr><td valign='top' width='210'><h6><code>$As<&#8288;$T, R></code></td><td>

Take a free type `$T` and an `R` related to* `$T['type]` and return a new `Type` returning the intersection of `R` with the original return type.

`R` becomes the return type advertised in the signature, even when it is wider than the original.

Useful in situations where you created a free type programmatically and was thus not able to fine tune the advertised return type

Following through with the previous example:
```typescript
// maybe consider writing a brand new free type though
type $SplitDash = $As<
    $Constrain<$Split<'-'>, [`${string}-${string}`]>,
    [string, string, ...string[]]
>
```

<sub>\* that is to say one must be a subtype or a supertype of the other</sub>

</td></tr><tr><td valign='top' width='210'><h6><code>$Assert<&#8288;T></code></td><td>

Not really an adapter as it does not convert a free type, but can be used as an alternative to `$Constrain` or `$As` to make a poorly typed composition type check. The advertised return type of `$Assert` is always `never`

```typescript
type $Foo = Flow<[$Prop<'value'>, $Assert<number>, $Next]>
// ({ value : unknown } -> unknown), (unknown -> never), (number -> number)
```
> The advertised return type of `$Foo` in the example above is unafected by the fact that the one of  `$Assert` is `never`.

</td></tr>
</table>

### Higher order types&nbsp;[↸](#documentation)

<table>
<tr><th width='210'>type</th><th width='600'>description</th></tr>

</td></tr><tr><td valign='top'><h6><code>MapOver<&#8288;T, $T></code></td><td>

Create a new mappable of the same structure as `T`, populated with the results of applying the free type `$T` on each element of `T`. `T` must be of type `$T['constraints][0]`.

```typescript
type Foo = MapOver<[1, 2], $Next> // [2, 3]
type Bar = MapOver<(1 | 2)[], $Next> // (2 | 3)[]
type Baz = MapOver<{ a: 1, b: 2 }, $Next> // { a: 2, b: 3 }
```

`$T` can be of `Type<1>` or `Type<2>`, in which case the second argument is the key/index of the current element.

</td></tr><tr><td valign='top'><h6><code>$MapOver<<&#8288;$T, L?></code></td><td>

A free version of `Map`. The optional argument `L` constrains it to work with tuples of that length (or arrays if `L` is exactly `number`).

</td></tr><tr><td valign='top'><h6><code>Lift<&#8288;$T, Ts></code></td><td>

Similar to `MapOver`, but generalised for any arity.

Take a `$T` of type `Type<N>` and a tuple `Ts` of length `N` in which each element is a `Mappable`, and return a `Mappable` populated with the result of applying `$T` with the grandchildren of `Ts` grouped by key.

```typescript
type FirstNames = ['Alan', 'Grace'];
type LastNames = ['Turing', 'Hopper'];

type Names = Lift<$Stitch<' '>, [FirstNames, LastNames]>;
//   Names : ["Alan Turing", "Grace Hopper"]
```
```typescript
type FirstNames = { a: 'Alan', b: 'Grace' };
type LastNames = { a: 'Turing', b: 'Hopper' };

type Names = Lift<$Stitch<' '>, [FirstNames, LastNames]>;
//   Names : { a: "Alan Turing", b: "Grace Hopper"}
```


Supernumerary keys in any of the children are dropped.

</td></tr><tr><td valign='top'><h6><code>$Lift<&#8288;$T></code></td><td>

A free versions of `Lift`

</td></tr><tr><td valign='top'><h6><code>Ap<&#8288;$Ts, Ts></code></td><td>

Apply a mappable of free types `$Ts` with mappable of types `Ts`

```typescript
type Foo = Ap<[$Next, $Prev], [2, 2]> // [3, 1]
type Bar = Ap<{a: $Next, b: $Prev}, {a: 2, b: 2}> // {a: 3, b: 1}
```

When the keys mismatch, supernumerary elements in `$Ts` are dropped and supernumerary elements in `Ts` are left unchanged.

</td></tr><tr><td valign='top'><h6><code>Reduce<&#8288;T, $T></code></td><td>

Consume the mappable `T` by recursively applying the binary free type `$T` with elements of `T`. The return value of each iteration becomes the first argument (accumulator) of the next iteration.

```typescript
type Foo = Reduce<['a', 2, true], $Stitch<':'>>; // "a:2:true"
type Bar = Reduce<{ a: 1, b: 2, c: 3, d: 4 }, $Add>; // 10
```
- `$T` must be of type `Type<[A, A], A>`;
- `T` must be of type ` [A, ...A[]] | { [k: string|number|symbol]: A }`.

> When `T` is an object type, `$T` **has to be** associative and commutative, because the ordering of values is not guaranteed. For example, `Reduce<T, $Add>` can safely be used with objects and tuples, but `Reduce<T, $Subtract>` can only be used with tuples.

</td></tr><tr><td valign='top'><h6><code>$Reduce<&#8288;$T></code></td><td>

A free version of `Reduce`.

> Since it accepts both tuples and objects, it can follow [`$Map`](#mapt) in a composition.

> I was not able to enforce that object type inputs must contain at least one element.

</td></tr><tr><td valign='top'><h6><code>Fold<&#8288;T, I, $T></code></td><td>

Identical to `Reduce` but requires an initialiser `I`, allowing `T` to be empty.

- `$T` must be of type `Type<[I, A], I>`\
(of course `I` and `A` can be the same);
- `T` must be of type `A[] | { [k: string|number|symbol]: A }`.

> When `T` is an object type, `$T` **has to be** associative and commutative, because the ordering of values is not guaranteed. For example, `Fold<T, unknown, $Intersect>` can safely be used with objects and tuples, but `Fold<T, [], $Concat>` can only be used with tuples.

</td></tr><tr><td valign='top'><h6><code>Fold<&#8288;$T, I></code></td><td>

A free version of `Fold`.

> Since it accepts both tuples and objects, it can follow [`$Map`](#mapt) in a composition.

</td></tr><tr><td valign='top'><h6><code>Match<&#8288;T, [P, R, K?][], M?></code></td><td>

Match a type `T` to one of the case clauses, composed of a predicate `P`, a response `R` and optionally a tuple of keys `K`.

#### Basic syntax
`P` can be a plain type definition
```typescript
type Number = Match<2, [
    [number, 'I am a number'],
    [string, 'I am a string'],
]>; // "I am a number"
```
#### Falling through
The placeholder `otherwise` can be used to prevent any value from falling through:

```typescript
type Nothing = Match<true, [
    [number, 'I am a number'],
    [string, 'I am a string'],
    [otherwise, 'nothing matched']
]>; // "nothing matched"
```

If `T` fall through, the return value would be a `unique symbol` and you would get an error:

```typescript
type NotFound = Match<true, [
//                    ----
// Type 'true' does not satisfy the constraint
// '"T fell through without matching any case"
    [number, 'I am a number'],
    [string, 'I am a string'],
]>; // unique symbol
```

Sadly, when `T` is generic and you don't have an `otherwise` case, this error misfires. You can correct that by supplying a plain model `M`, which should repeat the type constraint on `T`:

```typescript
type Switch<T extends number | string> = Match<T, [
    [number, 'I am a number'],
    [string, 'I am a string'],
], number | string>;
```

> You can also set `M` to `never` if you want to disable the check entirely. I prefer to make it opt-out rather than opt-in.

#### Procedural predicates
`P` can be a `Type<1, boolean>` running arbitrary checks on `T`. There will be a match if the return value is `true`

```typescript
type Answer = Match<{}, [
    [$IsEmpty, 'I am empty'],
    [otherwise, 'I am not empty'],
]>; // "I am empty"

interface $IsEmpty extends Type<1> {
    type: keyof this[0] extends never ? true : false
}
```
#### Callbacks
If `R` is a free type, it is applied with `T`.

```typescript
type Answer = Match<2, [
    [number, $Next],
    [otherwise, 'NaN'],
]>; // 3
```

> In such case, `Match` checks that `[P]` extends `R['constraints']`.

> When `P` is `otherwise` and `R` is a free type, `Match` needs to check that `[T]` extends `R['constraints']`, which can require using a model `M`.

#### Destructuring
The input to the callback is automatically destructured as described bellow.
##### Tuples
The elements of a tuple are supplied to `R` as an arguments list:
```typescript
type Answer = Match<['4', '2'],[
    [[number, number],  $Add],
    [[string string],  $Stitch<''>]
]>; // "42"
```
##### Objects
The object values are supplied to `R` as an arguments list:
```typescript
type Three = Match<{ a: 1, b: 2 }, [
    [{ a: number, b: number },  $Add],
    [{ a: string, b: string },  Flow<[$Stitch<''>, $Length]>],
]>; // 3
```
> `Match` tries to apply arguments in the order in which they appear in `P` but you are advised to set a specific ordering or to use a commutative callback.

##### Aribtrary types
Arbitrary types are destructured if `P` is a free type other than `Type<1, boolean>`, in which case their arguments list is supplied to `R`:

```typescript
type Args<T> = Match<T, [
    [free.Map,  free.Tuple],
    [$Foo,  free.Id],
]>;

class Foo<T> { constructor(private value: T) {}}
interface $Foo extends Type<1> { type: Foo<T> }

type MapArgs = Args<MapOver<string, number>> // [string, number]
type FooArgs = Args<Foo<string>> // string
```

#### Filtering and reordering arguments

The tuple `K` specifies which arguments are passed to `R` and in which order.

```typescript
type Three = Match<{a: 'foo', b: 2}, [
    [{a: string, b: number}, $Next, ['b']]
]>; // 3
```

> `Match` checks that the keys exist in `P` and `T`, which can require supplying a model `M`.


#### Preventing destructuring
The helper `Protect` allows you to select which pattern you don't want to destructure:
```typescript
type Protected = Match<{ a: 1 }, [
    [{ a: string }, free.Id],
    [Protect<{ a: number }>, free.Id]
    [{ a: boolean }, free.Id]
]> // { a: 1 }
```

</td></tr><tr><td valign='top'><h6><code>$Match<&#8288;[P, V, K?][], M?></code></td><td>

A free version of `Match`.

> Some checks like exhaustiveness become opt-in by supplying `M`

</td></tr>
</table>

## Operators and other utils&nbsp;[↸](#documentation)

Every n-ary type listed bellow can be partially applied with generics. For convenience, this type of application behaves like `PartialRight` on non-commutative binary types such as `$Exclude` `$Subtract` or `$Concat`.

### Set operations

<table>
<tr><th>type</th><th>description</th></tr>
</td></tr><tr><td width='210'><code>$Intersect</code></td><td width='600'>
A free version of <code>A & B</code> with a slight modification in that the intersection is simplified to <code>A</code> or <code>B</code> if one is a subtype of the other.
</td></tr><tr><td><code>$Unionize</code></td><td>
A free version of <code>A | B</code>
</td></tr><tr><td><code>$Exclude</code></td><td>
A free version of <code>Exclude<&#8288;A, B></code>
</td></tr>
</table>

### Boolean logic

`false | never | any` are considered falsy values

<table>
<tr><th width='210'>type</th><th width='600'>description</th></tr>
</td></tr><tr><td><code>$Extends</code></td><td>
A free version of <code>A extends B</code>, returns <code>boolean</code></td></tr><tr><td><code>$Includes</code></td><td>
A free version of <code>B extends A</code>, returns <code>boolean</code>
code></td></tr><tr><td><code>$RelatesTo</code></td><td>
A free version of <code>A extends B OR B extends A</code>, returns <code>boolean</code>
</td></tr><tr><td><code>$Eq</code></td><td>
A free version of <code>A extends B AND B extends A</code>, returns <code>boolean</code>
</td></tr><tr><td><code>$Not<&#8288;$T></code></td><td>
An adapter inverting a <code>Type<&#8288;1, boolean></code>
</td></tr><tr><td><code>$And</code></td><td>
A free version of <code>A && B</code>
</td></tr><tr><td><code>$Or</code></td><td>
A free version of <code>A || B</code>
</td></tr><tr><td valign='top'><h6><code>$Fork<&#8288;$P, $A, $B, C></code></h6></td><td>

Take a predicate `$P` of type `Type<unknown[], boolean>`, a left branch `$A` and a right branch `$B` and return a new `Type` which dispatches to `$A` or `$B` depending on the result of applying `$P` with the same arguments.

By default the constraints on the new `Type` are the union of the contraints of `$P`, `$A` and `$B` but you can override them with `C`.
</td></tr><tr><td valign='top'><h6><code>$Choose<&#8288;$P></code></h6></td><td>

Take a predicate `$P` of type `Type<2, boolean>` and return a new `Type<2>` with the same constraints which returns its first or second argument depending on the result of applying those arguments to itself.

</td></tr>
</table>

### Tuples
<table>
<tr><th width='210'>type</th><th width='600'>description</th></tr>
</td></tr><tr><td><code>$Head</code></td><td>
A free version of <code>T[0]</code>
</td></tr><tr><td><code>$Tail</code></td><td>
A free version of <code>[unknown, ...infer T]</code>
</td></tr><tr><td><code>$Last</code></td><td>
A free version of <code>T[T['length'] - 1]</code>
</td></tr><tr><td><code>$Init</code></td><td>
A free version of <code>[...infer T, unknown]</code>
</td></tr><tr><td><code>$Concat</code></td><td>
A free version of <code>[...A, ...B]</code>, <code>[...A, B]</code>, <code>[A, ...B]</code>, <code>[A, B]</code>
</td></tr>
</table>

### Strings

By `Showable` I mean `string | number | bigint | boolean | null | undefined`

<table>
<tr><th width='210'>type</th><th width='600'>description</th></tr>
</td></tr><tr><td valign='top'><code>Show<&#8288;T, Depth?></code></td><td>

Recursively convert an arbitrary type to a `string`. The `Depth` limit is `10` by default.

Depends on [`TypesMap`](#typesmap). The key in the map is used as the string representation.
</td></tr><tr><td valign='top'><code>$Show<&#8288;Depth?></code></td><td>
A free version of <code>Show</code>
</td></tr><tr><td valign='top'><code>$Length</code></td><td>
Get the length of a <code>string</code>
</td></tr><tr><td valign='top'><code>$ParseInt</code></td><td>

convert a <code>\`${number}\`</code> to a <code>number</code>.

Limited to the range <code>[0, 64]</code> for compatibility.

Since TS 4.8 you can implement an unbounded version with:
```typescript
T extends `${infer N extends number}` ? N : number
```

</td></tr><tr><td valign='top'><code>$Stitch</code></td><td>
A free version of <code>${B}${A}${C}</code> where <code>A</code>, <code>B</code> and <code>C</code> are <code>Showable</code>
</td></tr><tr><td valign='top'><code>$Join<&#8288;S></code></td><td>
Intersperse a tuple of <code>Showable</code> with the supplied separator and merge the result into one string. If the tuple is empty, <code>$Join</code> returns <code>""</code>
</td></tr><tr><td valign='top'><code>$Split</code></td><td>
Split the string <code>B</code> into a tuple of substrings with the separator <code>A</code>
</td></tr><tr><td valign='top'><code>$StrReplace</code></td><td>
Recursively replace <code>A</code> with <code>B</code> in <code>C</code>
</td></tr>
</table>

#### Mappables
<table>
<tr><th width='210'>type</th><th width='600'>description</th></tr>
</td></tr><tr><td valign='top'><h6><code>$Prop<&#8288;K?, R?></code></td><td>

Index a `Mappable`

```typescript
type Foo = apply<$Prop<'a'>, [{ a: 1, b: 2 }]>; // 1
type Foo = apply<$Prop, ['a', { a: 1, b: 2 }]>; // 1
```
Partially applying `$Prop` with generics enables dependent constraints:
```typescript
// $GetA : { [k: string | number | symbol]: unknown } -> unknown
type $GetA = partial<$Prop, ['a']>;

// $GetA : { a: unknown } -> unknown
type $GetA = $Prop<'a'>;

// $GetA : { a: number } -> number
type $GetA = $Prop<'a', number>;
```
Because `R` is optional, it can only be set with Generics

</td></tr><tr><td valign='top'><h6><code>$SetProp<&#8288;V?, K?></code></td><td>

Set the property matching the key `K` to the value `V` in the input object type.

```typescript
type Foo = apply<$SetProp<42>, ['a', {a: 1}]>; // { a: 42 }
type Foo = apply<$SetProp<42, 'a'>, [{a: 1}]>; // { a: 42 }
type Foo = apply<$SetProp, [42, 'a', {a: 1}]>; // { a: 42 }
```
If `K` does not exist, the input is returned unaltered.

`$SetProp` does not accept tuples

</td></tr><tr><td valign='top'><h6><code>$Index<&#8288;I, R?></code></td><td>

A stricter version of `$Prop` which only accepts arrays/tuples

</td></tr><tr><td valign='top'><h6><code>$SetIndex<&#8288;V?, I?></code></td><td>

Similar to `$SetProp` with tuples:

```typescript
type Foo = apply<$SetIndex, [42, 0, [1]]>; // [42]
type Foo = apply<$SetIndex<42>, [0, [1]]>; // [42]
type Foo = apply<$SetIndex<42, 0>, [[1]]>; // [42]
```
</td></tr>
</table>

### Arithmetic

<table>
<tr><th width='210'>type</th><th width='600'>description</th></tr>
</td></tr><tr><td><code>$Next</code></td><td>
A free version of <code>T + 1</code>, with <code>T</code> in the range <code>[0, 63]</code>.
</td></tr><tr><td><code>$Prev</code></td><td>
A free version of <code>T - 1</code>, with <code>T</code> in the range <code>[1, 64]</code>.
</td></tr><tr><td><code>$Abs</code></td><td>
A free version of <code>|T|</code> with <code>T</code> in the range <code>[-64, Infinity[</code>.
</td></tr><tr><td><code>$Add</code>*</td><td>
A free version of <code>A + B</code>
</td></tr><tr><td><code>$Multiply</code>*</td><td>
A free version of <code>A * B</code>
</td></tr><tr><td><code>$Subtract</code>*</td><td>
A free version of <code>A - B</code>
</td></tr><tr><td><code>$Divide</code>*</td><td>
A free version of <code>A / B</code> (Euclidean)
</td></tr><tr><td><code>$Lt</code>*</td><td>
A free version of<code>A < B</code>
</td></tr><tr><td><code>$Lte</code>*</td><td>
A free version of<code>A <= B</code>
</td></tr><tr><td><code>$Gt</code>*</td><td>
A free version of<code>A > B</code>
</td></tr><tr><td><code>$Gte</code>*</td><td>
A free version of<code>A >= B</code>
</td></tr><tr><td><code>$Max</code>*</td><td>
A free version of <code>Max<&#8288;A, B></code>
</td></tr><tr><td><code>$Min</code>*</td><td>
A free version of <code>Min<&#8288;A, B></code>
</td></tr>
</table>

\* the inputs and output of these types must be in the range `[0, 64]`
