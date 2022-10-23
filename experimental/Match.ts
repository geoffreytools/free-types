import { Type, apply, A, inferArgs, Generic } from 'free-types-core';
import {Extends, Next } from 'free-types-core/utils'
import { Union2Tuple} from '../essential/utils'
import { $Before } from '../essential/composition/$Before';
import { $Exclude } from '../utility-types/logic';
import { Fold } from '../essential/mappables/Fold';
import { _Object2Tuple } from '../essential/mappables/Object2Tuple';
import { Mappable } from '../essential/mappables/common';

type Key =  string | number | symbol

export { Match, $Match, otherwise, Protect };

declare const otherwise: unique symbol;
type otherwise = typeof otherwise;

type Reordering = Key[];
type Case = [unknown, unknown, Reordering?];

interface $Match<
    Cases extends Case[] & CheckCases<Model, Cases>,
    Model extends CheckFallThrough<Model, Cases> = never,
    // @ts-ignore: prevent users from messing with it
    //        vvvvvvvvvvvvv
    Otherwise extends never = GetOtherwise<Cases>
> extends Type<1> {
    type: _Match<this[A], Cases>
    constraints: [
        [Otherwise] extends [never] ? unknown
        : Otherwise extends _never ? unknown
        : Otherwise extends Type ? Otherwise['constraints']
        : unknown
    ]
}

type GetOtherwise<Cases extends Case[]> = {
    [K in keyof Cases]: Cases[K] extends Case
        ? Cases[K][0] extends otherwise ? [Cases[K][1]] extends [never] ? _never : Cases[K][1] : never
        : never
}[number]

declare const _never: unique symbol;
type _never = typeof _never;

type Match<
    T extends CheckFallThrough<Model, Cases>,
    Cases extends Case[] & CheckCases<Model, Cases>,
    Model = [GetOtherwise<Cases>] extends [Type] ? T : never
> = _Match<T, Cases>

type _Match<T, Cases extends Case[], I extends number = 0> =
    I extends Cases['length'] ? FellThrough
    : Branch<T, Cases, I>[
        IsAMatch<T, Cases[I][0]> extends true
        ? 'render'
        : 'continue'
    ]
interface Branch<T, Cases extends Case[], I extends number> {
    render: Render<T, Cases[I]>
    continue: _Match<T, Cases, Next<I>>    
}

  
declare const fellThrough: unique symbol;
type FellThrough = typeof fellThrough;

type Render<
    T,
    C extends Case,
    P = C[0],
    R = C[1],
    Args extends Reordering | undefined = C[2],
    Input = NormaliseInput<T, Args, P>
> = R extends Type ? Input extends unknown[] ? apply<R, Input> : never : R


type IsAMatch<T, P> =
    MatchValues<T, P> extends true ? true
    : [P] extends [never] ? false
    : P extends Type ? (
        P extends { type: boolean } ? (
            apply<P, [T]> extends true ? true : false
        ) : T extends Generic<P> ? true : false
    )
    : P extends otherwise
    ? true
    : P extends Protect ? IsAMatch<T, P[protect]>
    : false;

type MatchValues<T, P> =
    Extends<T, never> extends true ? Extends<P, never>
    : [T] extends [P] ? true
    : false

// type checking

type CheckFallThrough<T, Cases extends Case[]> =
    [Fold<Cases, T, $Before<$Exclude, $NormaliseCasesForTest<T>, 1>>] extends [never]
    ? unknown : 'T fell through without matching any case' 

interface $NormaliseCasesForTest<T> extends Type<[Case]> {
    type: NormalisePredicate<A<this>[0], T>
}

type NormalisePredicate<P, T> =
    P extends Protect ? NormalisePredicate<P[protect], T>
    : P extends otherwise
    ? any
    : P extends Type ? (
        P extends { type: boolean }
        ? apply<P, [T]> extends true ? T : never
        : Generic<P>
    )
    : P

type CheckCases<T, Cases extends Case[]> = {
    [K in keyof Cases]: Cases[K] extends Case
        ? CheckCase<T, Cases[K]> : never
}

type CheckCase<
    T,
    C extends Case,
    P = C[0],
    R = C[1],
    Args extends Reordering | undefined = C[2]
> =
    ArgsAreOK<T, P, Args> extends false ? [P, R, 'Keys are not found either in P or T']
    : [R] extends [never] ? Case
    : [R] extends [Type] ? (
        P extends otherwise ? (
            [T] extends [never] ? Case : T extends unknown[]
            ? Reorder<T, Args> extends R['constraints'] ? Case : never
            : [T] extends R['constraints'] ? Case
            : never
        ) : NormaliseInput<P, Args> extends R['constraints']
        ? Case
        : P extends Type & {type: boolean}
        ? [T] extends R['constraints']
            ? Case
            : `T does not match the callback's type constraints`
        : `the pattern P does not match the callback's type constraints`
    ) : Case;

type ArgsAreOK<T, P, Args> =
    Args extends Reordering ? (
        P extends Type ? (
            Args[number] extends GetArgs<T, P>
            ? true : false
        )
        : Args[number] extends keyof P
        ? (
            [T] extends [never] ? true
            : Args[number] extends keyof T ? true
            : false
        )
        : false
    ) : true;

type GetArgs<T, P extends Type, R = inferArgs<T, P>> = R[keyof R]

type NormaliseInput<T, Args extends Reordering | undefined, P = T> =
    P extends Protect ? T extends Protect ? [T[protect]] : [T]
    : P extends Type ? (
        P extends { type: boolean }
        ? [T]
        : Reorder<inferArgs<T, P>, Args>
    ) : T extends unknown[] ? Reorder<T, Args>
    : T extends Mappable ? _Object2Tuple<T, Args extends Reordering ? Args : Union2Tuple<keyof P>>
    : [T]

type Reorder<T, Keys extends Reordering | undefined> =
    [T, Keys] extends [Mappable, Reordering] ? _Reorder<T, Keys> : T;

type _Reorder<T, Keys> = {
    [K in keyof Keys]:
        Keys[K] extends Key ? T extends Record<Keys[K], unknown>
        ? T[Keys[K]]
        : T : T
}

type Protect<T = unknown> = { [protect] : T }
declare const protect: unique symbol;
type protect = typeof protect