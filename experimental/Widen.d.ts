import { Type, apply, Unwrapped, unwrap } from 'free-types-core';
import { Compute } from '../essential/utils';
import { TypesMap } from 'free-types-core/dist/TypesMap';
export { Widen };
declare type Widen<T, Fs extends Type[] | TypesMap = TypesMap, Ignore = `_${string}`> = T extends number | string | boolean | bigint ? WidenPrimitive<T> : T extends unknown[] | {
    [k: string | number | symbol]: unknown;
} ? {
    [K in keyof T]: K extends Ignore ? T[K] : Widen<T[K], Fs, Ignore>;
} : WidenClass<T, Fs, Ignore>;
declare type WidenClass<T, Fs extends Type[] | TypesMap, Ignore, U extends Unwrapped = unwrap<T, Fs>> = [U] extends [never] ? T : applyIfNotTooWide<U['type'], Widen<U['args'], Fs, Ignore>>;
declare type applyIfNotTooWide<$T extends Type, Args extends unknown[]> = apply<$T, Args extends $T['constraints'] ? Args : $T['constraints']>;
declare type WidenPrimitive<T, Tag = Compute<GetTag<T, _WidenPrimitive<T>>>> = Tag extends object ? _WidenPrimitive<GetRadical<T, Tag>> & Tag : _WidenPrimitive<T>;
declare type _WidenPrimitive<T> = T extends number ? number : T extends string ? string : T extends boolean ? boolean : T extends bigint ? bigint : T;
declare type GetTag<T, U> = {
    [K in keyof T as K extends keyof U ? never : K]: T[K];
};
declare type GetRadical<T, Tag> = T extends infer R & Tag ? R : never;
