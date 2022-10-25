# free-types

[free-types](../README.md) | [Documentation](./Documentation.md) | **[Guide](./Guide.md)** | [Algebraic data types](./ADTs.md)

# Guide

[Definition](#definition)
| [Application](#application)
| [Evaluation](#evaluation)
| [Return type](#return-type)
| [Arity](#arity)
| [Constraints](#type-constraints)
| [Contracts](#contracts)
| [Dynamic free types](#dynamic-free-types)
| [Boilerplate and API](#boilerplate-and-api)


## Definition&nbsp;[↸](#guide)
`Type` is some refinement of the following type
```typescript
{ type: unknown, arguments: unknown[] }
```
Extending it with an interface enables overriding the `type` field and referencing the arguments list:

```typescript
interface $Foo extends Type { type: Foo<this['arguments'][0]> }

// For convenience, the first 10 arguments can also be referenced like so:
interface $Foo extends Type { type: Foo<this[0]> }
```
## Application&nbsp;[↸](#guide)

`apply` is the preferred way of applying arguments.

```typescript
type FooBar = apply<$Foo, ['bar']> // Foo<'bar'>
```

You can think of application as the following 2-step process:
```typescript
type Step1 = $Foo & { arguments: ['bar'] };
// { type: Foo<this['arguments'][0]>, arguments: unknown[] & ['bar'] }
```
Since `unknown` is the neutral element of intersection, `unknown[]` is replaced by `['bar']` *relatively* transparently.

```typescript
type Step2 = Step1['type'] // Foo<'bar'>
```
The final evaluation is deferred until the `type` field is accessed, and that's our second step.

### The arguments list is a little broken:
Because it is an intersection type, the arguments list has lost its capacity to spread:

```typescript
type KnownIssue = [...[1, 2] & [unknown, unknown]] // (1|2)[]
```
Utils such as [`ToTuple`](./Documentation.md/#totuplet) or [`Slice`](./Documentation.md/#slicet-from-to) which recursively construct a new tuple can be used to work around this issue:

```typescript
interface $Foo extends Type { type: ['foo', ...ToTuple<this['arguments']>] }
// now arguments can spread                    --------------------------
```

## Evaluation&nbsp;[↸](#guide)

Contrary to classic types using generics, a free type has no way to know whether an argument is set or not. This can lead to surprising behaviours.

Take the following type:
```typescript
// I am purposely omitting the type constraint on `N`
type Tuple<T, N, R extends unknown[] = []> =
    N extends R['length'] ? R : Tuple<T, N, [T, ...R]>;

type Foo3 = Tuple<'foo', 3> // ["foo", "foo", "foo"]
```

It would be trivial to wrap it in a classic type:

```typescript
type TupleWrap<T, N> = Tuple<T, N>
```

Typescript would expand it like so:
```typescript
type TupleWrap<T, N> = N extends 0 ? [] : Tuple<T, N, [T]>
```

We would observe a different behaviour if we wrapped it in a free type:

```typescript
// Type instantiation is excessively deep and possibly infinite
interface $Tuple extends Type {
//        ------
    type: Tuple<this[0], this[1]>
}
```
This happens because `this[1]` always has a set value: `unknown`, so the compiler can expand the type.

In this very example the trouble is that `unknown` never extends `R['length']` in our implementation of `Tuple`, so we recur indefinitely.

> As I am proofreading this months later it appears that in my current setup the error is only picked up by the compiler when I try to apply the type (which is weird):
> ```typescript
> type Fail = apply<$Tuple, ['foo', 5]>
> //         ~~~~~~~~~~~~~~~~~~~~~~~~~~
> // Type instantiation is excessively deep and possibly infinite.
> ```
> I don't know if my mental model is still accurate but the problem still exists and my recommendations still apply.

There is no solution to this problem, but there are workarounds:

1) We can tune the type, for example by inverting the predicate:

    ```typescript
    type Tuple<T, N, R extends unknown[] = []> =
        R['length'] extends N ? R : Tuple2<T, N, [T, ...R]>;
    ```

    `R['length'] extends unknown` is true and we return early.

2) We can use a inline conditional:

    ```typescript
    interface $Tuple extends Type {
        type: Tuple<this[0], this[1] extends number ? this[1] : never>
    }
    ```
    `never extends R['length']` is true and we return early.

2) Or a surrounding conditional:

    ```typescript
    interface $Tuple extends Type {
        type: this[1] extends number ? Tuple<this[0], this[1]> : never
    }
    ```

When a free type has type constraints (we will cover them later), it is reasonable to assume that if the value of an argument does not match its type constraint, it means it is unset.

If there are no type constraints, it sometimes makes sense to suppose that if the value of an argument is exactly `unknown`, then it is unset, because passing exactly `unknown` makes no sense for this type even though any other value would do.

In other situations there is nothing we can do.

## Return type&nbsp;[↸](#guide)

The result of the evaluation of the `type` field at the definition site defines the return type of a free type.

If you want your free type to be composable, you need to care about that return type, because other types may perform checks against it to decide whether or not to accept it and you want these checks to be accurate.

If you look back at our different implementations of `$Tuple`, the resulting return types are pretty bad: `[]` is too narrow and `never` disables type checking.

Here is one way to address this issue:

```typescript
type Tuple<T, N, R extends unknown[] = []> =
    unknown extends N ? T[]
    : N extends R['length'] ? R
    : Tuple<T, N, [T, ...R]>;

interface $Tuple extends Type {
    type: Tuple<this[0], this[1]>
}
```
Now the return type of `$Tuple` is `unknown[]` as you can tell by inspecting `$Tuple['type']` or by using [`Signature`](./Documentation.md/#signaturet--t).

Focusing on the happy path truly breaks down when designing free types, so try to consider edge cases even when you are confident no user will trigger them, because the compiler will.

## Arity&nbsp;[↸](#guide)

The arity of a free type can be of 3 kinds: specific, variadic and wildcard.

### Specific arity
This is by far the most common kind. Extending `Type<N>` (where `N` is a `number`) is one way to create such free types:

```typescript
interface $Foo extends Type<1> {}
```

You can also make the arity of a free type depend on a generic:
```typescript
interface $Foo<N extends number> extends Type<N> {}
```

Setting the arity upon creation makes a number of helper types available, the simplest of which being [`At`](./Documentation.md/#ati-this-f):

```typescript
interface $FailSilently extends Type<1> { type: Foo<this[1]> }
// silent off-by-1 error            ---             -------

interface $CompileError extends Type<1> { type: Foo<At<1, this>> }
// Type 'this' does not satisfy the constraint 'Type<2>'  ----
```

### Variadic arity
Variadic free types can be created by extending exactly `Type`, `Type<number>` or `Type<T>` where `T` is an array, like `unknown[]`, or an open-ended tuple, like `[unknown, ...unknown[]]`.

Contrary to functions, variadic free types can't be passed as an argument to a type expecting a specific arity:

```typescript
type ExpectUnary<$T extends Type<1>> = apply<$T, ['foo']>;

interface $Foo extends Type { type: ... }

type Woops = ExpectUnary<$Foo>;
//                       -----
// Type '$Foo' does not satisfy the constraint 'Type<1, unknown>'
```

One way to deal with it is to make variadicity contagious:

```typescript
type ExpectVariadic<$T extends Type> = apply<$T, ['foo']>
type Ok = ExpectVariadic<$Foo>;
```
Another is to use the adapter [`$Arity`](./Documentation.md/#arityn-t):

```typescript
type Ok = ExpectUnary<$Arity<1, $Foo>>;
```

### Wildcard arity

Free types with wildcard arity can only be produced with [`Const`](./Documentation.md/#constt).
```typescript
type $ConstFoo = Const<'foo'>; // Type<❋, "foo">
```
Contrary to `Type<0>`, `Const` types don't expect `0` arguments: they simply ignore any arguments list passed to them:
```typescript
type Foo = apply<$ConstFoo>; // "foo"
type Foo = apply<$ConstFoo, [1]>; // "foo"
type Foo = apply<$ConstFoo, ['a', 'b']>; // "foo"
```
Consequently they don't concern themselves with type constraints on the input, making them easy to plug in to any higher order type:

```typescript
type Ok = ExpectUnary<$ConstFoo>;
```

## Type constraints&nbsp;[↸](#guide)

[Wiring constraints](#wiring-constraints)
| [Defusing errors](#defusing-type-constraint-errors)

Some types have constraints which need to be dealt with:
```typescript
interface $Foo extends Type<1> {
    type: `foo ${this[0]}!`
    //           -------
    // Type 'this[0]' does not satisfy the constraint 'string | number | bigint | boolean...'
    //   Type 'unknown' is not assignable to type 'string | number | bigint | boolean...'
}
```

The problem is twofold:
1) Defusing type constraint errors at the `type` definition site;
1) Carrying over type constraints so that callers are forced to apply the correct arguments.

### Defusing type constraint errors

Let's first enumerate the different ways we can deal with type constraints and discuss their tradeoffs regarding free types.

Reviving our `$Tuple` example:

```typescript
type Tuple<T, N extends number, R extends unknown[] = []> =
    R['length'] extends N ? R : Tuple<T, N, [T, ...R]>;

interface $Tuple extends Type<2> {
    type: Tuple<this[0], this[1]>
//                       ~~~~~~~
// Type 'this[1]' does not satisfy the constraint 'number'.
}
```

#### Intersection
```typescript
type: Tuple<this[0], this[1] & number>
```
Intersection has some quirks, such as the one we mentioned about tuples, but is perfectly suitable for most types.

The TS language server also does not always simplify intersections (notoriously with function types), so you might simply not like the way some of your types appear in tooltips.

Finally, the situations in which intersecting the input can help prevent infinite recursion are certainly very rare.

#### Inline conditional
```typescript
type: Tuple<this[0], this[1] extends number ? this[1] : never>
```
This pattern does not have the disadvantages of intersection and can make it a little easier to work with recursion because it is pretty easy to handle a `never` case explicitly in `Tuple` and return early:

```typescript
type Tuple<T, N extends number, R extends unknown[] = []> =
    [N] extends [never] ? T[] // <-- this is all we need to add
    : N extends R['length'] ? R : Tuple<T, N, [T, ...R]>;
```
It also allows us to care a little more about the implicit return type.

#### Surrounding conditional
```typescript
interface $Tuple extends Type<2> {
    type: this[1] extends number
        ? Tuple<this[0], this[1]>
        : this[0][]
}
```
This approach helps separating concerns, as it does not require modifying `Tuple` directly, but it has the downside of rapidly becoming noisy when more than one constraint need to be dealt with.

#### Strategy
Despite the disadvantages of intersection, I would prefer it as a first-line treatment because it produces simpler implicit return types. I found that the compiler seemed to "give up" resolving conditionals past a certain point of complexity.

Then I would choose inline conditionals if the implicit return type works out alright, or a surrounding conditional otherwise.

### Helpers
The following helpers take care of indexing and defusing type constraints in one step. On top of reducing boilerplate, this prevents mistakenly asserting a type constraint for the wrong parameter.

#### `Lossy<i, this>`
`Lossy` behave like `At` but additionally performs an intersection with the relevant type constraint:

```typescript
interface $Foo extends Type<[string]> {
    type: `Foo_${Lossy<0, this>}`
}

// is equivalent to:
interface $Foo extends Type<[string]> {
    type: `Foo_${this[0] & string}`
}
```

#### `Checked<i, this, F?>`
`Checked` will instead perform an inline conditional on the arguments:

```typescript
interface $Foo extends Type<[unknown[]]> {
    type: [1, ...Checked<0, this>]
}

// is equivalent to:
interface $Foo extends Type<[unknown[]]> {
    type: [1, ...(this[0] extends unknown[] ? this[0] : unknown[])]
}
```

#### `(A|B|C|D|E)<this?>`

Alphabetical helpers are shorthands for `Lossy`. They are the go to solution for indexing `this` with arities up to 5 as they don't take more real estate than `this[i]` but offer much more functionality:

```typescript
interface $Foo extends Type<[string]> {
    type: `Foo_${A<this>}`
}
```

When no argument is provided, they are aliases for `0`, `1`, `2`, `3`, `4`, allowing you to remain consistent when using `At`, `Checked` or a surrounding conditional:

```typescript
interface $Foo extends Type<[unknown, unknown[]]> {
    type: [A<this>, ...Checked<B, this>]
}
```

### Wiring constraints

#### Constraints on the input

On top of specifying the arity, `Type`'s first argument can be used to express specific type constraints.

It will generally be a tuple listing every constraint, although arrays and open-ended tuples are also valid. The length of the tuple defines the arity of your free type:
```typescript
interface $Foo extends Type<[number, string, unknown]> {}
```
The following syntax is equivalent

```typescript
interface $Foo extends Type {
    constraints: [number, string, unknown]
}
```

Trying to apply `$Foo` with the wrong arguments now yields an error:
```typescript
type Foo = apply<$Foo, [1, 2, 3]>
//                     ---------
// Type '[1, 2, 3]' does not satisfy the constraint '[number, string, unknown]'
```

#### Constraint on the return type

`Type` takes yet another parameter: a return type.

It enforces that your `type` field matches the supplied return type.

```typescript
type Obj = { [k: string | number | symbol]: unknown };

interface $StringKeys extends Type<[Obj], string> {
    //    ~~~~~~~~~~~                     ------
    // '$StringKeys' incorrectly extends interface Type<[Obj], string>
    // 'string | number | symbol' is not assignable to type 'string'
    type: keyof Checked<A, this>
}


// With proper handling
interface $StringKeys extends Type<[Obj], string> {
    type: keyof Checked<A, this> & string
} //                             --------
```

Our constraint also informs the call site about the return type:

```typescript
type PrefixedKeys<T extends Obj, $T extends Type<[Obj]>> =
    `prefix-${apply<$T, [T]>}`
    //        --------------
    // not assignable to type 'string | number | ...'
```
```typescript
type PrefixedKeys<T extends Obj, $T extends Type<[Obj], string>> =
    `prefix-${apply<$T, [T]>}` // OK
```
#### Implicit return type
As mentioned in the section dedicated to evaluation, free types have a return type anyway, which is the result of the first evaluation of the `type` field.

As a consequence it is not a requirement for `$StringKeys` to extend `Type<[Obj], string>` for it to be accepted by `PrefixedKeys`, because its return type is implicitly `string`:

```typescript
interface $StringKeys extends Type<[Obj]> {
    type: keyof Checked<A, this> & string // not type checked
}

type PrefixedKeys<T extends Obj, $T extends Type<[Obj], string>> =
    `prefix-${apply<$T, [T]>}` // still OK
```

It is also the occasion to repeat my warning about `never` turing off type checking:

```typescript
interface $StringKeys extends Type<[Obj], string> {
    type: At<A, this> extends this['constraints'][A]
        ? keyof At<A, this> & string
        : never // should be 'string' but evades type checking
}
type Woops = $StringKeys['type'] // never
```

#### Passing on constraints to higher order types

The `constraints` field can also be used to make type constraints bubble up to the user:

```typescript
type MapOver<T extends $T['constraints'][0][], $T extends Type<1>> = {
    [K in keyof T]: K extends keyof [] ? T[K] : apply<$T, [T[K]]>
}

type Woops = MapOver<['a', 'b', 'c'], $Next>
//               ---------------
// Type '["a", "b", "c"]' does not satisfy the constraint 'number[]'
```

A problem with our design is that this edge case compiles without warning:

```typescript
type Foo<$T extends Type<1>> = MapOver<['a', 'b', 'c'], $T>;
type Bar = Foo<$Next>;
```
Free types arguments being accidentally covariant, type safety is kind of "opt-in":

```typescript
type Foo<$T extends Type<[string]>> = MapOver<['a', 'b', 'c'], $T>;
//                  --------------
type Bar = Foo<$Next>;
//             -----
// Type '$Next' does not satisfy the constraint 'Type<[string]>'
```

We could constrain `$T` based on the input, but then the constraint would be too narrow:

```typescript
type MapOver<T extends unknown[], $T extends Type<[T[number]]>> = ...

type Foo = MapOver<[1, 2, 3], $Next>
//                        -----
// Type '$Next' does not satisfy the constraint 'Type<[1 | 2 | 3]>'.
```
Our [`Widen`](./Documentation.md/#wident-ts-i) could be of some help:

```typescript
type MapOver<T extends unknown[], $T extends Type<[Widen<T[number]>]>> =...

type Foo<$T extends Type<1>> = MapOver<['a', 'b', 'c'], $T>;
//                                                  --
// Type '$T' does not satisfy the constraint 'Type<[string]>
```

> I did not use `Widen` in the actual implementation of `Map` but I imagine it can be an option for types which are not as general purpose.

#### Limitations
Interdependent constraints are impossible to express: 

```typescript
interface $Foo extends Type<2> {
    constraints: [string, Record<this[0] & string, number>]
} //                             -------
// It is not going to work because `this[0]` is `unknown` at this stage.
```

Similarly, you can't procedurally check a parameter

```typescript
interface $Foo extends Type<1> {
    constraints: [Check<this[0]>] // Check<unknown>
}
```

This limitation could be lifted with thunks but it feels a bit out of scope for a user library. We would kind of be re-implementing generics.

## Contracts&nbsp;[↸](#guide)

Since `Type` can express constraints both on the parameters and on the return type, it enables programing to an interface and inverting dependencies.

In the example above, we were sharing `Type<[Obj], string>`. We can give it a name and pair it with the type which requires that interface:

```typescript
export type $KeysFilter = Type<[Obj], string>

export type PrefixedKeys<T extends Obj, $T extends $KeysFilter> =
    `prefix-${apply<$T, [T]>}`
```
Now we can reuse this interface to safely add variants:
```typescript
import { $KeysFilter } from './PrefixedKeys';

interface $StringKeys extends $KeysFilter {
    type: keyof Checked<A, this> & string
}

interface $StartingWithA extends $KeysFilter {
    type: keyof this['Filter'] & string
    Filter: {
        [K in keyof A<this> as K extends `a${string}` ? K : never]: never
    }
}
```

## Dynamic free types&nbsp;[↸](#guide)

[Partial application (parameters)](#regular-old-type-parameters)
| [Partial application (partial)](#partial-application)
| [Composition](#composition)
| [Ad hoc constructors](#ad-hoc-constructors)

There are several ways ou can create free types dynamically.

### Partial application

Partial application can be used to pass dependencies. A tacit/point-free style of programming is also useful to reduce the noise caused by the repetition of type constraints on arguments.

#### Generics

You may use regular type parameters to pass dependencies to a free type:

```typescript
interface $Foo<B> extends Type<1> {
    type: Foo<A<this>, B>
}
```

Note that `$Foo` is no longer "free", since this dependency will *have to* be supplied.

However, some types are meant to be applied in 2 steps and can require interdependent constraints (which is a known limitation of free types), in which case this pattern makes more sense:

```typescript
interface $Prop<K extends string | number | symbol, R=unknown>
    extends Type<[Record<K, R>], R>
        { type: A<this>[K] }
```
<sup>Not the actual implementation of [`$Prop`](./Guide.md/#propk-r)</sup>

Partial application spares us the noisy wiring of parameters:
```typescript
type $GetValue = $Prop<'value'>
type $GetNumericValue = $Prop<'value', number>
```
> A specificity of this pattern is that we only have one opportunity to apply dependencies: either `K` or `K` and `R`, at once.

Some higher order utility types such as `Map` take care of the application step, reducing noise to the minimum:

```typescript
type Input = [{value: 1}, {value: 2}, {value: 3}];

type Values = MapOver<Input, $GetValue>; // [1, 2, 3]
```

These higher order types can be free types and accept regular parameters themselves:

```typescript
type $GetValues = $MapOver<$GetValue>;
type $Sum = $Reduce<$Add>;
```

At no point did we need to wire constraints, which is exceptionally terse for Typescript, but if we inspected our types with [`Signature`](./Documentation.md/#signaturet-t) we would confirm that every information was carried over:
```typescript
{ // $GetValues
    input: [Mappable<Record<"value", unknown>>]
    output:  Mappable<unknown>
}

{ // $Sum
    input: [NonEmptyMappable<number>]
    output: number
}
```
#### `partial`

Contrary to regular type parameters, `partial` and `partialRight` allow to supply any number of arguments any number of times until the type is fully applied:
```typescript
interface $Cuboid extends Type<[number, number, number]> {
    type: `H${A<this>} x W${B<this>} x L${C<this>}`
}

type $H1 = partial<$Cuboid, [1]>;
type HWL = apply<$H1, [2, 3]>; // H1 x W2 x L3
```

A partial type is undistinguishable from a regular old free type:

```typescript
type Foo<$T extends Type<[number, number]>> = apply<$T, [2, 3]>
type Bar = Foo<$H1>;
```

It can be useful in its own right to fix some parameters while leaving others open:
```typescript
// $H1['type'] = `H1 x W${number} x L${number}`
type Foo<Cuboid extends $H1['type']> = ... 

type Accepted = Foo<'H1 x W2 x L3'>
type Accepted = Foo<'H1 x W5 x L4'>
type Rejected = Foo<'H2 x W4 x L1'>
//       "H2" ≠ "H1" -- 
```

#### `partial` limitation
When passing down arguments incrementally through multiple levels of depth, satisfying the type checker becomes impossible:
```typescript
type Baz = Foo<$H1>;

type Foo<$T extends Remaining<$Vec3, 2>> =
    Bar<partial<$T, [2]>>
//      -------------=- nonsensical errors

type Bar<$T extends Remaining<$Vec3, 1>> =
    apply<$T, [3]>
```
I don't think this can be fixed on my end, and since the return value is fine, you may silence the error with a directive and wait for the day of grace it fixes itself.

### Composition

#### `Pipe`

The type `Pipe` applies a value to a pipeline of free types.

Reviving our previous example with `$Sum` and `$GetValues`:

```typescript
type Input = [{value: 1}, {value: 2}, {value: 3}];

type Sum = Pipe<[Input], [$MapOver<$Prop<'value'>>, $Reduce<$Add>]>; // 6
```
We avoided nested calls to `apply`:
```typescript
type Intricate = apply<$Reduce<$Add>, [apply<$MapOver<$Prop<'value'>>, [Input]>]> // 6
```

`Pipe` has a little problem though: it won't type check if the input is a generic

```typescript
type NotOK<T extends number> = Pipe<[T], [$Next]>;
//         ^                         ^   -------
//                                    cryptic error
```
I don't know how to deal with this problem yet. In the meantime I suggest you use `PipeUnsafe` in such situations.

```typescript
type OK<T extends number> = PipeUsafe<[T], [$Next]>;
```

If you are not satisfied with this state of affairs, you can use `Flow` instead which does work with generics.
#### `Flow`

`Flow` takes a list of free types and returns their composition:

```typescript
//   $SumValues : Record<"value", number>[] -> number
type $SumValues = Flow<[$MapOver<$Prop<'value', number>>, $Fold<$Add, 0>]> 

type Input = [{value: 1}, {value: 2}, {value: 3}, {value: 4}];
type Result = apply<$SumValues, [Input]> // 10
```
As you can tell, we didn't use the same types as with `Pipe`. This is because `Flow` doesn't know which input is going to flow in and would reject our composition as it was:

```typescript
type Rejected = Flow<[$MapOver<$Prop<'value'>>, $Reduce<$Add>]>
//                   -------------------------------------
// Type '[$MapOver<$Prop<"value", unknown>>, $Reduce<$Add>]' does not satisfy the constraint 'Composition & [Type<[Mappable<Record<"value", unknown>>], NonEmptyMappable<number>>, $Reduce<$Add>]'.
//   Type '[$MapOver<$Prop<"value", unknown>>, $Reduce<$Add>]' is not assignable to type '[Type<[Mappable<Record<"value", unknown>>], NonEmptyMappable<number>>, $Reduce<$Add>]'.
//     Type at position 0 in source is not compatible with type at position 0 in target.
//       Type '$MapOver<$Prop<"value", unknown>>' is not assignable to type 'Type<[Mappable<Record<"value", unknown>>], NonEmptyMappable<number>>'.
//         Type '$MapOver<$Prop<"value", unknown>>' is not assignable to type 'TypeFields<[Mappable<Record<"value", unknown>>], NonEmptyMappable<number>, [Mappable<Record<"value", unknown>>], [unknown]>'.
//           Types of property 'type' are incompatible.
//             Type 'Mappable<unknown>' is not assignable to type 'NonEmptyMappable<number>'.
//               Type 'unknown[]' is not assignable to type 'NonEmptyMappable<number>'.
//                 Type 'unknown[]' is not assignable to type '[number, ...number[]]'.
//                   Source provides no match for required element at position 0 in target
```

For your confort I suggest you inspect the signature of your types with `Signature` when you want to debug a composition:

```typescript
type Signatures = Signature<[$MapOver<$Prop<'value'>>, $Reduce<$Add>]>

[{ // Signatures
    type: $MapOver<$Prop<"value", unknown>>;
    input: [Mappable<Record<"value", unknown>>];
    output: Mappable<unknown>; // <----------- !!
}, {
    type: $Reduce<$Add>;
    input: [NonEmptyMappable<number>];  // <-- !!
    output: number;
}]
```
For `$Map` to return `Mappable<number>`, `$Prop` needs to be annotated with `number`

```typescript
type Signatures = Signature<[$MapOver<$Prop<'value', number>>, $Reduce<$Add>]>

[{ // Signatures
    type: $MapOver<$Prop<"value", number>>;
    input: [Mappable<Record<"value", number>>];
    output: Mappable<number>; // <------------ that's better
}, {
    type: $Reduce<$Add>;
    input: [NonEmptyMappable<number>];  // <-- not there yet
    output: number;
}]
```

Now `$Map` doesn't know the length of the mappable it will receive ahead of time, so it can't guarantee `NonEmptyMappable<number>`. We need to use `$Fold` instead of `$Reduce`.

```typescript
type Signatures = Signature<[$MapOver<$Prop<'value', number>>, $Fold<$Add, 0>]>

[{ // Signatures
    type: $MapOver<$Prop<"value", number>>;
    input: [Mappable<Record<"value", number>>];
    output: Mappable<number>; // <---- Good
}, {
    type: $Fold<$Add, 0>;
    input: [Mappable<number>];  // <-- Good
    output: number;
}]
```

This is the occasion to reassess the way we had defined `$Sum` earlier: it is best to think of reuse when defining free types.

#### `$Before`

`$Before<$T, $P, I?>` transforms one or every argument of `$T` with `$P` before they hit `$T`.

```typescript
type $AbsAdd = $Before<$Add, $Abs>;
type Foo = apply<$AbsAdd, [1, -2]> // same as apply<$Add, [1, 2]>
```
It is valuable for tweaking n-ary types, since a regular composition would require a host of adaptations:

```typescript
type $AbsAdd = Flow<[$Rest<$MapTuple<$Abs, 2>, 2>, $Spread<$Add>]>;
//                   --∧-- ----∧----       ∧   ∧   ---∧---
//     argsList -> tuple       |           arity      |
//            map over the tuple      tuple -> argsList
```

### Ad hoc constructors

You can create free type factories with a special purpose, freeing the user from the need to create an interface. Bellow are 2 examples included in the library.

#### `Const`

Free types bring their own boilerplate, so when all you need is turn a concrete type into a free type, you can use `Const`:

```typescript
type $Foo = Const<'foo'>;
```
`$Foo` is now a constant free type:
```typescript
type Foo = apply<$Foo, [1, 2, 3]>; // "foo"
```

Constant free types are easy to plug in to any higher order type because they ignore their arguments and thus don't concern themselves with type constraints:

```typescript
type Foo = MapOver<[1, 2, 3], Const<'A'>>; // [A, A, A]
```

Only the return types need to match:

```typescript
type Bar<$T extends Type<[number], string>> = ...
type Accepted = Bar<Const<'foo'>>
type Rejected = Bar<Const<boolean>>
// we expected a string --------
```

#### `From`

A limitation of our design is that producing object literals is tedious:

```typescript
interface $Foo extends Type<[number, string]> {
    type: { foo: A<this>, bar: B<this> }
    //             ----          ----
    // 'this' is available only in a non-static
    // member of a class or interface
}
```

We are forced to use a helper type

```typescript
type Foo<A extends number, B extends string> = { foo: A, bar: B }

interface $Foo extends Type<[number, string]> {
    type: Foo<A<this>, B<this>>
}
```
or `Record`:
```typescript
interface $Foo extends Type<[number, string]> {
    type: Record<'foo', A<this>>
        & Record<'bar', B<this>>
}
```



`From` can be used to parameterise an object literal:

```typescript
type $Foo = From<{ a: number, b: string }, ['a', 'b']>;

type Foo = apply<$Foo, [1, 'foo']> // { a: 1, b: "foo" }
```

The template's original values are used for type checking

```typescript
type Rejected = apply<$Foo, [1, 42]>
//                          -------
// Type '[1, 42]' does not satisfy the constraint '[number, string]'
```

More about it in the [documentation](./Documentation.md/#fromt-args).

## Boilerplate and API&nbsp;[↸](#guide)


### It is actually not that bad

In many cases you don't need to wrap a classic type in a free type, you can write it directly or compose it.

If you find yourself needing intermediary variables in a type, you will find that using fields in an interface has some advantages over using extra type parameters with default values:

- fields don't require type constraints
- they can appear in any order
- they are lazy (this one can backfire)


### Conversion to classic type
Wrapping a free type is also a thing:
```typescript
export type SumValues<T extends $SumValues['constraints'][0]> =
    apply<$SumValues, [T]>
```
This enables exposing a familiar API to the user while using the power of free types internally.

### Lightweight partial and full application

The need for `partial` can be tempered by the use of [`$Optional`](./Documentation.md/#optinal-args)

It is also possible to create free types types which can be fully applied in the traditional way:

```typescript
type Direct = SumValues<Input>;
type Indirect = Foo<SumValues>;

type Foo<$T extends Type> = apply<$T, [Input]>;

type SumValues<T extends $SumValues['constraints'][0] = never> =
    $Optional<$SumValues [T], true>
//                            ----
```

Another option for removing boilerplate would be to contribute to the introduction of free type constructors into the language natively :grin:

There are still many challenges to overcome but I hope this preview gave you an idea of what this feature could bring to the language.

I leave you with that, with my thanks if you managed to go this far.
