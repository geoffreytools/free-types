import { _apply, unwrap, _Type, Generic } from 'core';
import { Compute } from 'utils';

import { TypesMap } from 'core/TypesMap';

export { Widen };

type Widen<T, Fs extends _Type[] | TypesMap = TypesMap, Ignore = `_${string}`> =
    T extends number | string | boolean | bigint ? WidenPrimitive<T>
  : T extends unknown[] | { [k: PropertyKey]: unknown }
    ? {[K in keyof T]: K extends Ignore ? T[K] : Widen<T[K], Fs, Ignore>}
    : unwrap<T, Fs> extends {
        type: infer $T extends _Type,
        args: infer Args extends unknown[]
    } ? applyIfNotTooWide<$T, Widen<Args, Fs, Ignore>> : T;

type applyIfNotTooWide<$T extends _Type, Args extends unknown[]> =
    Args extends $T['constraints'] ? _apply<$T, Args> : Generic<$T>;

type WidenPrimitive<T, Tag = Compute<GetTag<T, _WidenPrimitive<T>>>> = 
    Tag extends object
    ? _WidenPrimitive<GetRadical<T, Tag>> & Tag
    : _WidenPrimitive<T>

type _WidenPrimitive<T> =
    T extends number ? number
    : T extends string ? string
    : T extends boolean ? boolean
    : T extends bigint ? bigint
    : T;

type GetTag<T, U> = {[K in keyof T as K extends keyof U ? never : K]: T[K]}
type GetRadical<T, Tag> = T extends infer R & Tag ? R : never