# free-types

[free-types](../README.md) | [Use Cases](./UseCases.md) | **[Documentation](./Documentation.md)** | [Guide](./Guide.md) | [Algebraic data types](./ADTs.md)

# Documentation
 [Creation](#creation)
| [Variance](#variance)
| [Application](#application)
| [Helpers](#helpers-)
| [Composition](#composition-)
| [Decomposition](#decomposition)
| [Adapters](#adapters)
| [Higher order types](#higher-order-types)
| [Operators](#operators-and-other-utils)

<br>

> :microscope: Experimental types have been tested, but not optimised. Their API may be inconsistent or dated;
>
> :arrow_forward: Links to interactive playgrounds can be found in this documentation;
>
> `Mappable` means the conflation of arrays, tuples and and object literal types.

<br>

## Creation

### `Type<In?, Out?>`

#### Defining a free type [:arrow_forward:](https://www.typescriptlang.org/play?jsx=0&ts=4.9.5#code/JYWwDg9gTgLgBAbzgFQJ5gKYBo4EMxgA2qcAvnAGZQQhwDkVGGAtDOhgM50BQ3wAdjAxQKuAMYY4AEmRwMADyH8AJhxTtE3ONrhtMALl0ALYBwDaABgC63Utz2TZAXjwFiAHhk4zDCBDpWAHzcAPQhOgB6APzcQA)

Extend `Type` with an interface to define a free type. The `type` field is your return value.

```typescript
interface $T extends Type { 
    type: unknown
}
```

Such type can later be [applied](#application-), [adapted](#adapters-), [composed](#composition-) or [inferred](#decomposition-).

#### Defining parameters and their constraints [:arrow_forward:](https://www.typescriptlang.org/play?jsx=0&ts=4.9.5#code/JYWwDg9gTgLgBAbzgFQJ5gKZwL5wGZQQhwDkBGGAtDOhgM4kBQjNmcAgnALxx0xTAAdgHMA3C1pwAQtziCAriABGGKMySssAVUEBjCIL5QAhkIwATWWjbZGGyTv2H+pwRau0APAuWqAfDh2cJpwjgZGru481hie8oIA1oIQAO6CANoAugG2QSEAChB0wDDABsYANh6YnunsADTS2YH2bIXFpeUVAPJgnYKV1bF1jVIA-M22rVjtJWUDPX3zg9FeI3AAdFtSWZPqwZIAcsYgUSheSMgAXHDpAAyN7Jk4OXlHJxa9-SvnNZc390emUaWjGAIAjKNnthXowAPRw3gAC2gMCRxkE5jo+xC7AENCGngATK9phx8agvssqqsauC4AAfOAkwJvNgAMWAFQqAGUwMYoHQsLTYkg7jcfCooI0iTcjEJhC8WgcOVyKgAZDAiNGEpDgm5KCAQCoYDGNE3apE3ADMStyZOOp3MyGMuhKupQNweoRu9JhypCjosLrdMCpXQ91zg3tBvrtQA)

It can be done in 2 ways indifferently:

<table>
<tr><th width='500'>
Information packed in the `Type` constructor
</td><th width='500'>
Information scattered in different fields
</td></tr>
<tr><td>

```typescript
interface $Foo extends Type<{ T: 0, U?: 1}> {   

}
```
</td><td>

```typescript
interface $Foo extends Type {   
    constraints: [unknown, unknown?]
    names: { T: 0, U: 1 }
}
```
</td></tr>
</table>

Parameters are always at least positional, but can optionally be bound to names like in the examples above.

The recommended way to expect a free type as a type constraint in a higher order type is the following:
```typescript
type $Contract = Type<{ T: 0, U?: 1 }>

type HOT<$T extends $Contract> = apply<$T, { T: 42 }>
```

#### Syntax
<table>
<tr>
<th width='230'>Unconstrained
<th width='230'>Constrained
<th width='230'>Optional parameters
<th width='230'>Named parameters</tr>
<td valign='top'>

```typescript
Type

Type<number>

Type<unknown[]>
```

</td><td valign='top'>

```typescript
Type<[A, B]>
```
</td><td valign='top'>

```typescript
Type<[A, B?]>

Type<[A, ...B[]]>
```
</td>
</td><td valign='top'>

```typescript
Type<{ T: [0, A] }>

Type<{
    T: [0, A], U?: [1, B]
}>
```
</td>
</table>

Various shorthand notations are available if you have `unknown` constraints:

<table>
<tr>
<th width='500'>Arity with no constraints
<th width='500'>Names with no constraints
</tr><tr>
<td>

```typescript
Type<2>

// is equivalent to
Type<[any, any]>
```

As a constraint, it accepts any free type of arity 2.

<td>

```typescript
Type<{ T: 0, U?: 1 }>

// is equivalent to
Type<{T: [0, unknown], U?: [1, unknown]}>
```
</tr>
<tr>
<th width='500'>Sparse pseudo-tuple
<th width='500'>Auto-fill length
</tr>

<td>

```typescript
Type<{ 0: number, 2: string }>

// is equivalent to
Type<[number, unknown, string]>
```
</td><td>

```typescript
Type<{ 1: boolean, length: 3 }>

// is equivalent to
Type<[unknown, boolean, unknown]>
```
</td>
</table>


#### Accessing arguments [:arrow_forward:](https://www.typescriptlang.org/play?jsx=0&ts=4.9.5#code/JYWwDg9gTgLgBAbzgFQJ5gKYBo4EMxgA2qcAvnAGZQQhwDkVGGAtDOhgM50BQ3C3cQXGAA7GBigVcAYwxwAJMjgYAHuJEATDinYAeANocYUUQHMAugD5EAoXYD09uMZIBXDmecALYB311cKFM6c30ABnM8bVw4IxMRU1s7QTZMAC5vX39A4NCIpLIC1LklAF48AmJdRRx-CggIEMsCxyEAPQB+blJefjtRcUkZOUVlNQxNbTRMXSRkDPCcOLNI0ms+5MFWlzh3TxgfPwCgkP9kOjhoOAiovFjjMwK7YoyDrOPcs5CCnuf2FDg5XwRFQ1WQtQYDSaLScgk63V6BQGEiksgUSlU6i0OhmhgeCSsNk2WycOz2CUyRxyrhAExgXEiuGizlcRAwTyErQ4YCgGFwGk8wHgvIAjq5gLztBwaHIYAB3PkAa0exOc7Feh2yQRpdIZPyK-zKFRBYIh9UaVhh7S6PT4SLEKOG6LGWKmejx8Qs6w5KXVlPC5n1f0wAKBlVBNTgdShlocsLg8NIQA)

<table>

<tr>
<th>the "arg" field
<th>AppliedArguments
<th>numeric keys
</tr>
<tr>
<td width='330'>

```typescript
interface $T extends Type<[A]> {
    type: this['arg'][0]
}

interface $T extends Type<{ T:0 }> {
    type: this['arg']['T']
}
```

</td><td width='330'>

```typescript


interface $T extends Type {
    type: AppliedArguments<this>
}
```
</td><td width='330'>

```typescript


interface $T extends Type {
    type: this[0]
}
```

</td>
</tr>
<tr><td valign='top'>

It is the recommended way of accessing named arguments and arguments with type constraints.

You get auto-completion, and arguments are substituted with their constraint at the definition site.

</td><td valign='top'>

Lists every argument as a tuple, or `unknown[]` when the free type is not applied. The tuple can be spread or passed to another free type.

`this['arguments']` holds the same arguments intersected with `unknown[]`, which does not spread.


</td><td valign='top'>

This way of accessing arguments offers the most control (see the [guide](./Guide.md)) and is the cheapest to evaluate, whereas `this['arg']` is computed again for every application.

Pair it with [helpers](#helpers-) and/or the `arg` field to manage boilerplate.


</td></tr></table>

#### Variance in higher order types

Free types are invariant on their parameters, so a free type which is more capable than required is rejected:

```typescript
// $T should at least be defined for the input ["foo"]
type ApplyFoo<$T extends Type<['foo']>> = apply<$T, ['foo']>;

// $Array is defined for any unary input
interface $Array extends Type<1> { type: Array<this[0]> }

// but is rejected
type Error = ApplyFoo<$Array>;
//                    ~~~~~~ 
// [unknown] is not assignable to ["foo"]
```

Use [`Expect`](#expecttype) to make the parameters contravariant, as described in [Variance](#variance).

#### Constraining the return type

Use the second parameter to type check your implementation:

```typescript
interface $T extends Type<0, string> { type: number }
//        ~~ Error           ------          ------
```

or to type check the input of a higher order type:
```typescript
type Exclaim<$T extends Type<[string], string>> = `${ apply<$T, ['hello']> }!`
//                            ------

type Boom = Exclaim<$BadType>
//                 ~~~~~~~~~ Record<string, 42> is not assignable to string

interface $BadType extends Type<[string]> {
    type: Record<this['arg'][0], 42>
}
```

<p align=center>⁂</p>

### `TypeDoc<Type>`

Enrich a free type created from scratch with helpful tooltip information.

#### Example [:arrow_forward:](https://www.typescriptlang.org/play?jsx=0&ts=4.9.5#code/JYWwDg9gTgLgBAbzgFQJ5gKYBo4DEA2EA7jmpgCIQDGcAvnAGZQQhwDkTGGAtDOhgGc2AKGEYAHpFhw+mOABIAEhnyE4AXhT9KVADxKVhAJLh8APgDcYydHiyMcAOJQuMYADsA5hryEiugG0DVQgceQBRcSp8AENQAF0zUQ8YDCgGGKoHYONTOAlU9wATAS1MXSQmYAxigC44AIAGHAEYKA9PeLozRGE4fpl+eoADZRCFBBgAC2ABALYYqE82ePmqmqKV2mHhWmT3VPTM7MjouNYCjdKyDEDW9q9E3oHBzBH5SZm5haWVpvjaABCHa0IA)

```typescript
export type $Hello = TypeDoc<$HelloImpl>;

// The implementation being an interface, it has no tooltip info
interface $HelloImpl extends Type<{ friend: [0, string] }> {
    type: `Hello ${this['arg']['friend']}`
}
// tooltip with TypeDoc:
type $Hello = CreateType<{
    type: `Hello ${string}`;
    constraints: [string];
    names: { friend: 0 };
}, $HelloImpl>
```
Type aliases already come with TypeDoc:
```typescript
type $Contract = Type<{ friend: [0, string] }, string>

// tooltip:
type $Contract = CreateType<{
    type: string;
    constraints: [string];
    names: { friend: 0 };
}>
```

As well as most utilities returning a free type:

```typescript
export type $Greeting = Flow<[$Hello, $Exclaim]>

// tooltip
type $Greeting = Composition<{
    type: `${string}!`;
    constraints: [string];
    names: { friend: 0 };
}, [$Hello, $Exclaim]>
```
<p align=center>⁂</p>

### `From<Template, Keys?>`

Lift a shallow object type into a free type:

#### Example [:arrow_forward:](https://www.typescriptlang.org/play?jsx=0&ts=4.9.5#code/JYWwDg9gTgLgBAbzgMShEcC+cBmaMDkeApsQLQwCeYxAzgQFANU1wAqx4ANgIYzFwAvIlwQIALjgA7AK4gARsSgAaOPJ5RJtGFGBSA5lgDcTFgIAkyMQCENQlPgA8Hbn2KqA2kTEFVBdVAEAPwAugB8RkA)

```typescript
type Template = { foo: number, bar: string };

type $FooBar = From<Template, ['foo', 'bar'?]>;

// tooltip
type $FooBar = FromTemplate<{
    type: { foo: number, bar: string }
    constraints: [number, string?];
    names: { bibi: 0; bubu: 1 };
    keys: ["foo", "bar"];
}>
```
#### Syntax

1) `Template`: is the implicit return type of the generated free type, and its values will eventually be used as type constraints.

2) `Keys`: specifies which fields to turn into a parameter, in what order they must be applied and whether or not they are optional.

    Can be omitted if your object has only one element or if it is a tuple.

#### Named parameters
Named parameters are generated automatically from the keys you supply.

You can rename parameters like so:

```typescript
type $FooBar = From<FooBar, [{ foo: 'bibi' }, { bar: 'bubu' }?]>
```

### `FromDeep<Template, Paths>` :microscope:

A variation of `From` which enables reaching deep properties with `Paths` instead of keys:

#### Example

```typescript
type $Foo = FromDeep<
    { a: { b: [number, string], c: boolean } },
    [['a', 'b', 0], 'c']
>;

type Foo = apply<$Foo, [1, true]>
//   Foo : { a: { b: [1, string], c: true } }
```

<p align=center>⁂</p>

### `Const<T>`

Turn a type `T` into a constant `Type<❋, T>`, totally ignoring arity and type constraints on the input.

#### Example

```typescript
type $42 = Const<42>

// tooltip
type $42 = ConstantType<{
    type: 42,
    constraints: any,
    names: any
}>

// can be used as an expression
type Foo = MapOver<[1, 2, 3], Const<42>>; // [42, 42, 42]
```

### `$Const`

A free version of `Const`.

#### Example

```typescript
type Consts = MapOver<[1, 2, 3], $Const>
//   Consts : [Type<❋, 1>, Type<❋, 2>, Type<❋, 3>]
```

### Other creation utils

<table>
<tr><th>type</th><th>description</th></tr>

<tr><td valign='top'><h6><code>$partial<&#8288;$T></code></td><td>

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

<br>

## Variance

#### When you pass a free type to a higher order type, it is:
*invariant* on its parameters and *covariant* on its return type.

#### When you want contravariance
The util [`Expect`](#expecttype) ignores the covariant part of the parameters, making them *contravariant*, as you would expect from parameters.

#### When you need generics
There are no generics for generics, but you have access to the `constraints` field.

#### Example [:arrow_forward:](https://www.typescriptlang.org/play?ssl=13&ssc=36&pln=1&pc=1#code/JYWwDg9gTgLgBAbzgFQJ5gKYBo4FEAemAxjDgIZhgA2qcAvnAGZQQhwDkzGGAtDOhgDO7AFAj+mOABJkUMgDtBjaCAA8yOAF44C1AD4tKAaoDaANzJUArhgBcKHMHkATDPnvyrIAEYYoAXT0xAHpguAB1DDgiMigosm8IK3gMKgwQDHkYQTgIRhQ4EDIYIgALJwBzOBhSqMZgKEF4IghFGDkneDzpZHEBOABZCgB5Mz91ODcYTOccmRN2FraOrOF-EwAGdf8cGUn8aZccgmIYVRk5RWUoED0DbQQROGe4EwBJOCc4AGsMVG7kP57BRqKhzsgcCZkO8dnA3oERHQxJ0-IwyEQolIABKpKgQfaHWY9S5KFSqJpQSoGJASOxwAAGOKoeOkCBqwEEC1iFXY6y2dHp9DEtLgAHE4hgYJUctohmBRuMFqLgGlhDh2MhSgkFMBebsmXigqFXuwDfjlar2OqzSgtd4dbygA)

Here we define a higher order type which maps over a tuple, using a free type as transform.
```typescript
// We don't want to prescribe what the first parameter should be constrained to
type $Transform<T = any> = Type<[value: T, index: number]>
//                -----

// But we care about elements of `T` matching that constraint, whatever it is
type MapOver<T extends $T['constraints'][0][], $T extends Expect<$Transform>> = {
    //                 --------------------
    [I in keyof T]: apply<$T, [T[I], I]>
}

// Here this constraint is `string`
interface $Hello extends Type<[string]> { type: `Hello ${this['arg'][0]}` }
//                             ------

// We are all good: `any` extends `string` and `("Giles" | "Thabani")[]` extends `string[]`
type Greetings = MapOver<['Giles', 'Thabani'], $Hello>
// ['Hello Giles', 'Hello Thabani']
```

The following would also be fine if we didn't want to pass an index as second argument:

```typescript
type MapOver<T extends $T['constraints'][0][], $T extends Type<1>> = {
    [I in keyof T]: apply<$T, [T[I]]>
}
```

Why not passing the index and simply using `Type<2>`? `Expect<$Transform>` is superior because:
1) `Type<2>` being invariant, it would prescribe the arity of the input `$T` to be `2`, so you would still need to use `Expect` if you wanted to accept `$Hello`, which is unary;

2) `$Transform` can be reused as a contract for users to extend. Then, the type information `number` for the index would be picked up by `this['arg][1]` if the user made use of it. `Type<2>` would

<br>

## Application&nbsp;[↸](#documentation)

> **Warning**
> No excess property checking is performed on named arguments

### `apply<Type, Arguments>`

Apply a free type with all its arguments and evaluate the type.

#### Example

```typescript
interface $Map extends Type<{ keys: 0, values: 1 }> {
    type: Map<this['arg'][0], this['arg'][1]>
};

type Foo = apply<$Map, [string, number]>
type Foo = apply<$Map, { keys: string, values: number }>

// output
type Foo = Map<string, number>
```

#### Syntax

`Arguments` can be a tuple of positional arguments or an object of named arguments.

> **Warning**
> At current, for named arguments to be type checked, your `Type` must expect named arguments.
>
> ```typescript
> interface $Foo extends Type<1> { type: this[0] }
> type FalseNegative = apply<$Foo, { foo: 42 }>
> //                               -----------
> // Type<1>'s "names" field is {} so this type checks
> ```
> The solution is a little challenging to implement but I will get there eventually.

<table>
<tr><th>type</th><th>description</th></tr>

</td></tr><tr><td valign='top' width='210'><h6><code>apply<&#8288;$T, Args></code></td><td>


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

<br>

## Helpers [↸](#documentation)

Helpers you may use to reduce boilerplate or assist with type checking.

### `Expect<Type>`
In order to work in higher order scenarios, free types need to encode type constraints covariantly. This is due to a limitation in Typescript inference, there is no way around it.

On top of encoding them covariantly, the library also encodes them contravariantly (Future iterations should let you set variance independently for each parameter). 

`Expect` removes the former covariant information from your `Type` parameters, so that when it is compared with an input, only the *desired* variance is considered.


<table><tr><th>type</th><th>description</th></tr>

</td></tr><tr><td valign='top' width='210'><h6><code>A|B|C|D|E<&#8288;this?></code></td><td>

Similar to [`At`](#ati-this-f), but also defuses type constraints: the argument is returned as it is when it satisfies its constraint, and intersected with its constraint otherwise.

```typescript
interface $Foo extends Type<[string]> {
    type: `${A<this>}`
}
```
Is equivalent to:
```typescript
interface $Foo extends Type<[string]> {
    type: `${this[0] extends string ? this[0] : string & this[0]}`
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

</td></tr><tr><td valign='top'><h6><code>Get<&#8288;K, this></code></td><td>

Read the argument at the index or the name `K` and defuse its type constraint like [`A|B|C|D|E`](#abcdethis), for any arity and for named parameters:

```typescript
interface $Hello extends Type<{ name: [0, string] }> {
    type: `Hello ${Get<'name', this>}`
}
```

Use [`Optional`](#optionali-this-f) to read an optional parameter.

</td></tr><tr><td valign='top'><h6><code>Checked<&#8288;I, this, F?></code></td><td>

Similar to [`At`](#ati-this), but also defuses type constraints with an **inline conditional**:

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

</td></tr><tr><td valign='top'><h6><code>Optional<&#8288;I, this, F?></code></td><td>

Similar to [`Checked`](#checkedi-this-f), but also deals with the possibility that the argument may not be set:

```typescript
interface $Foo extends Type<[string, string?]> {
   type: `${A<this>}${Optional<1, this, ''>}`
}
```
Is equivalent to:
```typescript
interface $Foo extends Type<[string, string?]> {
   type: `${this[0] & string}${this[1] extends undefined ? '' : this[1]}`
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
</td></tr><tr><td valign='top'><h6><code>AppliedArguments<&#8288;this></code></td><td>

The arguments of the applied free type as a tuple, or `unknown[]` when it is not applied. It can be spread or passed to another free type:

```typescript
interface $Prepend extends Type {
    type: ['foo', ...AppliedArguments<this>]
}

type Foo = apply<$Prepend, [1, 2]> // ["foo", 1, 2]
```

`this['arguments']` holds the same arguments intersected with `unknown[]`, which does not spread.

</td></tr><tr><td valign='top'><h6><code>Applied<&#8288;this></code></td><td>

Tell whether the free type is applied: `false` at the definition site, and `true` once arguments are applied.

</td></tr><tr><td valign='top'><h6><code>Valid<&#8288;this></code></td><td>

Tell whether the free type is applied with arguments which satisfy its type constraints.

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

</td></tr><tr><td valign='top' width='210'><h6><code>Pipe<&#8288;Args, ...$T[]></code></td><td>

Pipe the arguments list `Args` through the free types listed in `...$T[]`, from left to right. The composition is limited to 10 free types.

```typescript
type Foo = Pipe<[1, 2], $Add, $Next, $Exclaim> // 4!
```

When the types don't line up, the compiler tells you precisely what went wrong, using the inferred value as a hint:
```typescript
type Foo = Pipe<[1, 2], $Add, $Exclaim, $Next,>
//                                      ~~~~~
// Type '$Next' does not satisfy the constraint 'Type<["3!"], number>'.
//   Types of property 'constraints' are incompatible.
//     Type '[number]' is not assignable to type '["3!"]'.
//       Type 'number' is not assignable to type '"3!"'.
```

When `Args` contains generics, it does its best:
```typescript
type Error<T extends number> = Pipe<[T], $Exclaim, $Next>;
//                                                 ~~~~~
// Type '$Next' does not satisfy the constraint
// '_<$Next, "should be", Type<[`${T & string}!` | `${T & number}!`], number>>'
```

Be careful when using Pipe with a generic: Typescript will eagerly try to expand the type, which can work fine when nesting types for example, but can potentially fail if resolving the generic is required to work out the validity of the composition. Another possibility is that you end up with a huge thunk of nested conditional types waiting to receive a value.

</td></tr><tr><td valign='top'><h6><code>Flow<&#8288;$T[]></code></td><td>

Return the composition from left to right of the free types listed in`$T[]`.

```typescript
type $AddNextExclaim = Flow<[$Add, $Next, $Exclaim]>
type Foo = apply<$AddNextExclaim, [1, 2]> // 4!
```

</td></tr><tr><td valign='top' width='210'><h6><code>$Arg<&#8288;I></code></td><td>

Get the argument at index `I`

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
type Tree = unwrapDeep< Map<1, Map<2, Map<3, 'value'>> >;

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

### Adapters&nbsp;[↸](#documentation)

<table>
<tr><th>type</th><th>description</th></tr>

</td></tr><tr><td valign='top' width='210'><h6><code>$Arity<&#8288;N, $T></code></td><td>

Turn a variadic `Type` into a `Type<N>`.

</td></tr><tr><td valign='top' width='210'><h6><code>$Flip<&#8288;$T></code></td><td>

Turn a `Type<[A, B]>` into a `Type<[B, A]>` and apply arguments accordingly.


</td></tr><tr><td valign='top'><h6><code>$Rest<&#8288;$T, N?></code></td><td>

Turn a `Type<1>` expecting a Tuple of `N` elements into a `Type<N>`.

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

</td></tr><tr><td valign='top'><h6><code>$MapOver<&#8288;$T, L?></code></td><td>

A free version of `MapOver`. The optional argument `L` constrains it to work with tuples of that length (or arrays if `L` is exactly `number`).

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

</td></tr><tr><td valign='top'><h6><code>Reduce<&#8288;T, $T, Check?></code></td><td>

Consume the mappable `T` by recursively applying the binary free type `$T` with elements of `T`. The return value of each iteration becomes the first argument (accumulator) of the next iteration.

```typescript
type Foo = Reduce<['a', 2, true], $Stitch<':'>>; // "a:2:true"
type Bar = Reduce<{ a: 1, b: 2, c: 3, d: 4 }, $Add>; // 10
```
- `$T` must be of type `Type<[A, A], A>`;
- `T` must be of type ` [A, ...A[]] | { [k: string|number|symbol]: A }`.

> When `T` is an object type, `$T` **has to be** associative and commutative, because the ordering of values is not guaranteed. For example, `Reduce<T, $Add>` can safely be used with objects and tuples, but `Reduce<T, $Subtract>` can only be used with tuples.

When `T` is a generic object, TS will fail to check whether it's empty or not and reject even valid inputs. You can satisfy the type checker by passing the constraint as a third parameter, or turn it off by passing `any` or `unknown`:

```typescript
type EdgeCase<T extends { foo: number }> = Reduce<T, $Add, { foo: number }>
//                                                          -------------
```

</td></tr><tr><td valign='top'><h6><code>$Reduce<&#8288;$T></code></td><td>

A free version of `Reduce`.

> Since it accepts both tuples and objects, it can follow [`$MapOver`](#mapovert-l) in a composition.

> I was not able to enforce that object type inputs must contain at least one element.

</td></tr><tr><td valign='top'><h6><code>Fold<&#8288;T, I, $T></code></td><td>

Identical to `Reduce` but requires an initialiser `I`, allowing `T` to be empty.

- `$T` must be of type `Type<[I, A], I>`\
(of course `I` and `A` can be the same);
- `T` must be of type `A[] | { [k: string|number|symbol]: A }`.

> When `T` is an object type, `$T` **has to be** associative and commutative, because the ordering of values is not guaranteed. For example, `Fold<T, unknown, $Intersect>` can safely be used with objects and tuples, but `Fold<T, [], $Concat>` can only be used with tuples.

</td></tr><tr><td valign='top'><h6><code>$Fold<&#8288;$T, I></code></td><td>

A free version of `Fold`.

> Since it accepts both tuples and objects, it can follow [`$MapOver`](#mapt-l) in a composition.

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
    [[string, string],  $Stitch<''>]
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

type MapArgs = Args<Map<string, number>> // [string, number]
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

</td></tr><tr><td valign='top'><h6><code>Filter<&#8288;T, F, Model?></code></td><td>

Filter the mappable `T` by the refinement `F`.

```typescript
Filter<[1, 'a', 2, true], number> // [1, 2]
Filter<{ a: 1, b: 'a', c: 2, d: true }, number> // { a: 1, c: 2 }
```

`F` can also be a predicate returning either the refined type or `never` if you need to run arbitrary logic:
```typescript
Filter<[1, 'a', 2, true], $IsNumber> // [1, 2]
Filter<{ a: 1, b: 'a', c: 2, d: true }, $IsNumber> // { a: 1, c: 2 }

interface $IsNumber extends Type<1> {
    type: this[0] extends number ? number : never
}

```
See `$Filter` for more information about refinements and `Model`.

</td></tr><tr><td valign='top'><h6><code>$Filter<&#8288;F, Model?></code></td><td>

A free version of `Filter`.

Refinements narrow the advertised return type, which is useful when composing transformations:

```typescript
type Narrowed = Flow<
    $Filter<number>,
    $MapOver<$Next>, // we know we have a `number`
>

type Narrowed<T extends (number | string)[]> = Pipe<
    [T],
    $Filter<number>,
    $MapOver<$Next>,
>
```

If the refinement is generic and you have trouble composing `$Filter`, you can annotate it with a `Model`:

```typescript
type Narrowed<T extends number[]> = Pipe<
    [T],
    $Filter<Last<T> | 10, number>,
    //                    ------
    $MapOver<$Next>
>
```

</td></tr><tr><td valign='top'><h6><code>FilterOut<&#8288;T, F, Model?></code></td><td>

The exact opposite of Filter.

```typescript
FilterOut<[1, 'a', 2, true], number> // ['a', true]
FilterOut<{ a: 1, b: 'a', c: 2, d: true }, number> // { b: 'a', d: true }
```
When using a predicate, it is equivalent to calling `Filter` with `$Not<F>`.
```typescript
FilterOut<[1, 'a', 2, true], $IsNumber> // ['a', true]
FilterOut<{ a: 1, b: 'a', c: 2, d: true }, $IsNumber> // { b: 'a', d: true }
```

</td></tr><tr><td valign='top'><h6><code>$FilterOut<&#8288;F, Model?></code></td><td>

A free version of `FilterOut`.

</td></tr><tr><td valign='top'><h6><code>GroupBy<&#8288;T, $F></code></td><td>

Partition the tuple `T` into sub-tuples and store the result in a Struct. The name and composition of the groups is decided by calling the predicate `$P` of type `Type<[member: unknown], PropertyKey>` on each element of `T`.

```typescript
type NumericList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
type Numbers = NumericList[number];

interface $Sizes extends Type<[Numbers], string> {
    type: this[0] extends 0 ? 'null'
        : this[0] extends 1|2|3 ? 'small'
        : this[0] extends 4|5|6 ? 'medium'
        : 'big'
}

type GroupedBySize = GroupBy<NumericList, $Sizes>;
// {
//     null: [0],
//     small: [1, 2, 3],
//     medium: [4, 5, 6],
//     big: [7, 8, 9]
// }
```

</td></tr><tr><td valign='top'><h6><code>$GroupBy<&#8288;$P></code></td><td>

A free version of `GroupBy`

</td></tr><tr><td valign='top'><h6><code>GroupUnionBy<&#8288;U, $P, $T?></code></td><td>


Partition the union `U` into sub-unions and store the result in a Struct. The name and composition of the groups is decided by calling the predicate `$P` of type `Type<[member: unknown], PropertyKey>` on each member of `U`.

```typescript
type Numbers = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface $Sizes extends Type<[Numbers], string> {
    type: this[0] extends 0 ? 'null'
        : this[0] extends 1|2|3 ? 'small'
        : this[0] extends 4|5|6 ? 'medium'
        : 'big'
}

type GroupedBySize = GroupUnionBy<Numbers, $Sizes>;
// {
//     null: 0,
//     small: 1 | 2 | 3,
//     medium: 4 | 5 | 6,
//     big: 7 | 8 | 9
// }
```

Optionally take a transfrom `$T` of type `Type<[union: unknown, length?: number]>` to map over the sub-unions as they are inserted. `$T` exposes the length of the sub-union as a second optional parameter.

```typescript
type GroupedBySize = GroupUnionBy<Numbers, $Sizes, $AddLen>;
// {
//     null: 1,
//     small: 4 | 5 | 6,
//     medium: 7 | 8 | 9,
//     big: 10 | 11 | 12
// }

interface $AddLen extends Type<[number, number]> {
    type: Add<A<this>, B<this>>
}
```

</td></tr><tr><td valign='top'><h6><code>$GroupUnionBy<&#8288;$P, $T></code></td><td>

A free version of `GroupUnionBy`

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
