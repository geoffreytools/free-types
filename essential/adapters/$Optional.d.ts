import { apply, partial, partialRight, PartialRight, Type } from "free-types-core";
import { Next } from "free-types-core/dist/utils";
import { PartialSparse, _partial } from "../_partial";
export declare type $OptionalFlip<$T extends Type<2>, Args extends unknown[] & PartialRight<$T['constraints']>> = Args extends [never] ? $T : partialRight<$T, Args>;
export declare type $Optional<$T extends Type, Args extends Partial<$T['constraints']>> = Args extends unknown[] ? partial<$T, TrimArgs<Args>> : never;
export declare type _$Optional<$T extends Type, Args extends PartialSparse<$T['constraints']>> = Args extends unknown[] ? _partial<$T, TrimArgs<Args>> : never;
export declare type $Alter<$T extends Type, Args extends Partial<$T['constraints']>> = Args extends unknown[] ? Branch<$T, TrimArgs<Args>>['type'] : never;
interface Branch<$T extends Type, Args extends unknown[]> {
    type: Args['length'] extends 0 ? $T : this[Args['length'] extends $T['constraints']['length'] ? 'apply' : 'partial'];
    apply: apply<$T, Args>;
    partial: partial<$T, Args>;
}
declare type TrimArgs<T extends unknown[], I extends number = 0, R extends unknown[] = []> = unknown[] extends T ? unknown[] : I extends T['length'] ? R : [T[I]] extends [never] ? R : TrimArgs<T, Next<I>, [T[I]] extends [never] ? R : [...R, T[I]]>;
export {};
