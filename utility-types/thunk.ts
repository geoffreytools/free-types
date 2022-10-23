import { Type, apply } from 'free-types-core';
import { Prev, Next } from 'free-types-core/utils';

export { thunk, Thunk, eval, getTypes, getArgs }

/** Wrap the application of a free type (or Composition of free types) without evaluating the result nor checking the arguments. */
type thunk<
    T extends Composition | Type,
    Args extends Type['constraints'] | Thunk = []
> = Args extends Thunk
    ? Grow<T, Args>
    : Args extends Type['constraints']
    ? FromType<T, Args> 
    : never;

type Grow<T, Args extends Thunk> = {
    _THUNK_: [
        [...getTypes<Args>, ...(T extends Composition ? T : [T])],
        getArgs<Args>
    ]
}

type FromType<
    T extends Composition | Type,
    Args extends unknown[],
> = {
    _THUNK_: [T extends Composition ? T : [T], Args]
}

/** To be used as a constraint to match any thunk (0 arguments) or a specific kind of thunk */
type Thunk<
    T extends Composition = Composition,
    Args extends unknown[] = unknown[]
> = {
    _THUNK_: [T, Args]
}

/** Get the free type / Composition part of a Thunk. */
type getTypes<T extends Thunk> = T['_THUNK_'][0];

/** Get the arguments part of a Thunk. */
type getArgs<T extends Thunk> = T['_THUNK_'][1];

/** To be used to constrain a composition of free types. The first free type can be of any arity, but the remaining ones must be unary. */
type Composition<N extends number | unknown[] = unknown[]> = 
    [Type<N>, ...Type<1>[]]; 

/** Evaluate a Thunk while checking its arguments against its type constraints. If the Thunk is a Composition, only the first one is checked. */
type eval<
    T extends Thunk<Composition, getTypes<T>[0]['constraints']>,
    C extends number = 0,
    L extends number = Prev<getTypes<T>['length']>,
    Fs extends Composition = getTypes<T>,
    Args extends unknown[] = getArgs<T>
> =
    C extends L ? apply<Fs[C], Args>
    : eval<Thunk<Fs, [apply<Fs[C], Args>]>, Next<C>, L>