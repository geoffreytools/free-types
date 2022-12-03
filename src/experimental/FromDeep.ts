import {  Type, Tail } from 'free-types-core/';
import { ArrayKeys, Next} from 'free-types-core/utils';
import { Assert } from '../essential/utils';
import { Mappable } from '../essential/mappables/common';
import { IndexOf, NormalizeArgs, SelectValue } from './creation';
import { ParseNat } from '../utility-types/strings/$ParseNat';

export { FromDeep };

/** Create a new `Type` based upon an iterable `T`. Take tuple of `Paths` to determine which fields to turn into a parameter and in what order they will have to be applied. */

type FromDeep<
    T extends Mappable<any>,
    Paths extends GetArgs<DeepKeyof<T>>[],
> = $FromDeep<T, Assert<NormalizeArgsDeep<Paths>, unknown[][]>>

interface $FromDeep<T, Paths extends unknown[][]> extends Type {
    type: _FromDeep<this['arguments'], Paths, T>
    constraints: { [I in keyof Paths]: GetFromPath<T, Paths[I]> }
}

type GetFromPath<T, Path extends unknown[], I extends number = 0> = 
    I extends Path['length'] ? T
    : GetFromPath<Path[I] extends keyof T ? T[Path[I]] : never, Path, Next<I>>

type _FromDeep<
    This extends unknown[],
    Paths extends unknown[][],
    T,
> = {
    [K in keyof T]:
        K extends ArrayKeys ? T[K]
        : T[K] extends Mappable
        ? Recur<This, Paths, K, T[K]>
        : Paths extends [unknown, ...unknown[]][]
        ? Select<This, Paths, K, T[K]>
        : T[K]
}

type Recur<This extends unknown[], Paths extends unknown[][], K, V> =
    ComputeDeep<_FromDeep<UpdateThis<This, Paths>, UpdatePaths<Paths, K>, V>>

type Select<This extends unknown[], Paths extends unknown[][], K, V> =
    SelectValue<V, This, IndexOf<K, {
        [I in keyof Paths]: I extends ArrayKeys ? Paths[I] : Paths[I][0]
    }>>


type UpdatePaths<
    Paths extends unknown[][],
    K extends unknown, 
    I extends number = 0,
    R extends unknown[][] = [],
> = I extends Paths['length'] ? R
    : UpdatePaths<Paths, K, Next<I>, [
        ...R,
        Paths[I] extends [K, ...unknown[]]
        ? Tail<Paths[I]> : never
    ]>

type UpdateThis<
    This extends unknown[],
    Paths extends unknown[][],
    I extends number = 0,
    R extends unknown[] = []
> = I extends This['length'] ? R
    : UpdateThis<
        This, Paths, Next<I>,
        [...R, Paths[I]['length'] extends 1 ? never : This[I]]
    >


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
        K extends ArrayKeys ? T[K]
        : T[K] extends unknown[] ? NormalizeArgs<T[K]>
        : T[K] extends number ? [`${T[K]}`]
        : [T[K]]
}

type NormIndex<T> =
    T extends unknown[] ? { [K in keyof T]: NormIndex<T[K]> }
    : T extends `${number}` ? ParseNat<T> : T

type ComputeDeep<T> = unknown & {
    [K in keyof T]: K extends ArrayKeys ? T[K] : ComputeDeep<T[K]>
}