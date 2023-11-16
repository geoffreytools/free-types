import {  Type, Tail } from 'free-types-core/dist/';
import { IndexOf } from 'free-types-core/dist/From';
import { ArrayKeys, Int, Next } from 'free-types-core/dist/utils';
import { Mappable } from '../essential/mappables/common';

export { FromDeep };

/** Create a new `Type` based upon an iterable `T`. Take tuple of `Paths` to determine which fields to turn into a parameter and in what order they will have to be applied. */

type FromDeep<
    T extends Mappable<any>,
    Paths extends GetArgs<DeepKeyof<T>>[],
> = $FromDeep<T, Extract<NormalizeArgsDeep<Paths>, unknown[][]>>

interface $FromDeep<T, Paths extends unknown[][]> extends Type {
    type: unknown[] extends this['arguments'] ? T : _FromDeep<T, Paths, this['arguments']>
    constraints: { [I in keyof Paths]: GetFromPath<T, Paths[I]> }
}

type GetFromPath<T, Path extends unknown[], I extends number = 0> = 
    I extends Path['length'] ? T
    : GetFromPath<Path[I] extends keyof T ? T[Path[I]] : never, Path, Next<I>>

type _FromDeep<
    T, 
    Paths extends unknown[][],
    Args extends unknown[], 
> = unknown & {
    [K in keyof T]:
        K extends ArrayKeys ? T[K]
        : T[K] extends Mappable
        ? _FromDeep<T[K], UpdatePaths<Paths, K>, Args>
        : Paths['length'] extends 0
        ? T[K] 
        : Value<Args, Paths, K, T[K]>
}

type Value<
    Args extends unknown[],
    Paths extends unknown[][],
    K,
    V,
    I extends number = IndexOf<K, { [I in keyof Paths]: Paths[I][0] }>
> = [I] extends [never] ? V : Args[I]

type UpdatePaths<Paths extends unknown[][], K extends unknown> = {
    [I in keyof Paths]: Paths[I][0] extends K ? Tail<Paths[I]> : never
}

type DeepKeyof<T> = T extends object
    ? { [K in keyof T]: [K, ...DeepKeyof<T[K]>] }[
        keyof T & (T extends unknown[] ? number : unknown)
    ]
    : [];

type GetArgs<T> =
    T extends unknown[] ? (
        T['length'] extends 1
        ? ([NormIndex<T[0]>] | NormIndex<T[0]>)
        : NormIndex<T>
    ) : T

type NormalizeArgsDeep<T extends unknown[]> = {
    [K in keyof T]:
        T[K] extends unknown[] ? NormalizeArgs<T[K]>
        : T[K] extends number ? [`${T[K]}`]
        : [T[K]]
}

type NormalizeArgs<T extends unknown[]> = {
    [K in keyof T]:
        T[K] extends unknown[] ? NormalizeArgs<T[K]>
        : T[K] extends number ? `${T[K]}`
        : T[K]
}

type NormIndex<T> =
    T extends unknown[] ? { [K in keyof T]: NormIndex<T[K]> }
    : T extends `${number}` ? Int<T> : T