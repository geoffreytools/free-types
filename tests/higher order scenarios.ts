import { test } from 'ts-spec';
import { Type, apply, A, B, Pipe } from 'free-types-core';
import { Mappable } from 'mappables/common';
import { MapOver, $MapOver } from 'mappables/MapOver';
import { $Filter } from 'mappables/Filter';
import { $Fold } from 'mappables/Fold';
import { $Reduce } from 'mappables/Reduce';
import { $Values } from 'adapters/$Values';
import { $Spread } from 'adapters/$Spread';
import { $Flip } from 'adapters/$Flip';
import * as Tuple from 'essential/Tuple';
import { $Add, $Next } from 'utility-types/arithmetic';

interface $StrNumPair extends Type<[string, number]> {
    type: [A<this>, B<this>]
}

interface $Exclaim extends Type<[string], string> {
    type: `${A<this>}!`
}

/**
 * Container-specialised variants over a generic input: the container is known to the caller,
 * so the result must preserve it and resolve to it.
 */

test('Tuple.$MapOver preserves the array over a generic input' as const, t =>
    <T extends number[]>() =>
        t.equal<apply<Tuple.$MapOver<$Next>, [T]>, number[]>())

test('Tuple.$Filter preserves the array over a generic input' as const, t =>
    <T extends number[]>() =>
        t.equal<apply<Tuple.$Filter<number>, [T]>, number[]>())

test('Tuple.$Fold collapses a generic array to a value' as const, t =>
    <T extends number[]>() =>
        t.equal<apply<Tuple.$Fold<$Add, 0>, [T]>, number>())

test('Tuple.$Reduce collapses a generic non-empty array to a value' as const, t =>
    <T extends [number, ...number[]]>() =>
        t.equal<apply<Tuple.$Reduce<$Add>, [T]>, number>())

/**
 * Polymorphic variants as composition glue: the container is unknown, the
 * result is only required to be usable at the wide `Mappable` bound so the
 * next stage of a pipeline can consume it.
*/

test('polymorphic combinators are usable as glue over a generic input' as const, t => [
    <T extends number[]>() =>
        t.extends<apply<$MapOver<$Next>, [T]>, Mappable<number>>(),
    <T extends number[]>() =>
        t.extends<apply<$Filter<number>, [T]>, Mappable<number>>(),
    <T extends number[]>() =>
        t.extends<apply<$Fold<$Add, 0>, [T]>, number>(),
])

test('polymorphic glue threads through a single-stage Pipe' as const, t =>
    <T extends number[]>() =>
        t.extends<Pipe<[T], $MapOver<$Next>>, Mappable<number>>())

test('nested apply composes over a generic input' as const, t =>
    <T extends number[]>() =>
        t.extends<
            apply<$MapOver<$Next>, [apply<$Filter<10, number>, [T]>]>,
            Mappable<number>
        >())

test('adapters accept generic inputs' as const, t => [
    <T extends [number, number]>() =>
        t.equal<apply<$Spread<$Add>, [T]>, number>(),
    <T extends Mappable<string | number>>() =>
        t.extends<apply<$Values<$StrNumPair>, [T]>, [string, number]>(),
    <S extends string, N extends number>() =>
        t.equal<apply<$Flip<$StrNumPair>, [N, S]>, [S, N]>(),
])

test('generic arguments flow through core apply' as const, t =>
    <T extends string>() =>
        t.equal<apply<$Exclaim, [T]>, `${T}!`>())
