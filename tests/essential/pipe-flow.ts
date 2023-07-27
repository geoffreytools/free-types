import { test } from 'ts-spec';
import { Type, A, apply, partial, Checked, $Next, $Add } from '../..';
import { Flow } from '../../essential/composition/Flow';
import { Pipe } from '../../essential/composition/Pipe';


interface $Exclaim extends Type<[number | string]> {
    type: `${A<this>}!`
}

interface $Push1 extends Type<[unknown[]]> {
    type: [...Checked<A, this>, 1]
}

test('Pipe' as const, t => [
    t.equal<Pipe<[1, 2], $Add, $Next>, 4>(),
    t.equal<Pipe<[1], $Next, $Exclaim>, "2!">(),
])

type ErrorAfter10 = Pipe<
    // @ts-expect-error: reject compositions of more than 10 free types
    [1],
    $Next,
    $Next,
    $Next,
    $Next,
    $Next,
    $Next,
    $Next,
    $Next,
    $Next,
    $Next,
    $Next,
    $Next,
    $Next
>

// does not produce errors with Generics
type Next<T extends number> = Pipe<[T], $Next>;

// @ts-expect-error checks generic arguments
type Error<T extends number> = Pipe<[T], $Exclaim, $Next>;

{
    // @ts-expect-error: pipe checks Unary composition
    type wrongUnaryComposition = Pipe<[1], $Exclaim, $Next>
    // @ts-expect-error: pipe checks Binary composition
    type wrongBinaryComposition = Pipe<[1], $Add, $Push1>

    // @ts-expect-error: pipe checks arguments
    type wrongArguments = Pipe<['foo', 2], $Add, $Next>
}

test('Flow' as const, t =>
    t.equal<apply<Flow<[$Add, $Next]>, [1, 2]>, 4>()
)

{
    // @ts-expect-error: Flow checks Unary composition
    type wrongUnaryComposition = Flow<[$Exclaim, $Next]>
    // @ts-expect-error: Flow checks Binary composition
    type wrongBinaryComposition = Flow<[$Add, $Next, $Push1]>

    // @ts-expect-error: Flow checks arguments
    type wrongArguments = apply<Flow<[$Add, $Next]>, ['a', 'b']>
}

type Foo<$T extends Type> = apply<$T, [1, 2]>;

test('Flow can compose with a variadic type' as const, t =>
    t.equal<Foo<Flow<[$Add, $Next]>>, 4>()
)

type Bar<$T extends Type<2>> = apply<$T, [1, 2]>;

test('Flow can compose with a type of a specific arity' as const, t =>
    t.equal<Bar<Flow<[$Add, $Next]>>, 4>()
)

test('partial application of composition' as const, t => {
    type $PartialComp = partial<Flow<[$Add, $Next]>, [2]>
    return t.equal<apply<$PartialComp, [1]>, 4>()
})
