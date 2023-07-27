import { Type, apply, Last } from 'free-types-core';
import { TrimArgs } from "../utils";
import { _Pipe } from "./common";

type Error = 'You can compose up to 10 free types with Pipe'

/** Pipe a tuple of arguments through a composition of free types
 * ```
 * type Foo = Pipe<[1, 2], $Add, $Next, $Exclaim> // "4!"
 * ```
 */
export type Pipe<
    Args extends [STOP] extends [never] ? A['constraints'] : Error,
    A extends Type<number> = never,
    B extends _<B, 'should be', Type<[RA], B['type']>> = never,
    C extends _<C, 'should be', Type<[RB], C['type']>> = never,
    D extends _<D, 'should be', Type<[RC], D['type']>> = never,
    E extends _<E, 'should be', Type<[RD], E['type']>> = never,
    F extends _<F, 'should be', Type<[RE], F['type']>> = never,
    G extends _<G, 'should be', Type<[RF], G['type']>> = never,
    H extends _<H, 'should be', Type<[RG], H['type']>> = never,
    I extends _<I, 'should be', Type<[RH], I['type']>> = never,
    J extends _<J, 'should be', Type<[RI]>> = never,
    STOP = never,
    /**@ts-ignore: Error handling on Args */
    RA = apply<A, Args>,
    RB = apply<B, [RA]>,
    RC = apply<C, [RB]>,
    RD = apply<D, [RC]>,
    RE = apply<E, [RD]>,
    RF = apply<F, [RE]>,
    RG = apply<G, [RF]>,
    RH = apply<H, [RG]>,
    RI = apply<I, [RH]>,
    RJ = apply<J, [RI]>
> = Result<[RA, RB, RC, RD, RE, RF, RG, RH, RI, RJ]>;

type Result<Results extends unknown[]> = Last<TrimArgs<Results>>;

type _<$T extends Type, _, $U extends Type> =
    $U['constraints'] extends $T['constraints'] ? Type
    : Type<$U['constraints'], $T['type']>
