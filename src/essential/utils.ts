import { Natural, Prev, Next } from 'free-types-core/dist/utils'

export { IsAny, ArrayKeys, Next, Extends, Eq, Tuple } from 'free-types-core/dist/utils';

// Numbers

export { IsNatural, Add }

type IsNatural<T> = T extends _IsNatural ? true : false;
type _IsNatural = Natural[number];

type Add<A extends number, B extends number> =
    number extends A ? number : number extends B ? number
    : _Add<A, B>

type _Add<A extends number, B extends number, _A = Next<A>, _B = Prev<B>> =
    B extends 0 ? A : [_A] extends [never] ? never : [_B] extends never ? never
    : _Add<_A & number, _B & number> 

// display

export { Compute };

type Compute<T> = { [K in keyof T]: T[K] } & unknown

// Logic

export { Assert, And, Or, Not };

type Assert<T, U> = T extends U ? T : never;
type And<A, B> = A extends false ? false : B extends false ? false : B;
type Or<A, B> = A extends false ? B extends false ? false : B : A;
type Not<T> = [T] extends [false] ? true : false

// Union

export { IsUnion, LastUnionMember, Union2Tuple, UnionToIntersection };

type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends
        ((k: infer I) => void) ? I : never

type LastUnionMember<T> =
    UnionToIntersection<T extends any ? () => T : never> extends
        () => (infer R) ? R : never
    
type Union2Tuple<U, Last = LastUnionMember<U>> =
    [U] extends [never] ? []
    : [...Union2Tuple<Exclude<U, Last>>, Last];

type IsUnion<T> = [T] extends [LastUnionMember<T>] ? false : true

// Variadic types

export { TrimArgs }

type TrimArgs<
    T extends unknown[],
    I extends number = 0,
    R extends unknown[] = []
> = unknown[] extends T ? unknown[]
    : I extends T['length'] ? R
    : [T[I]] extends [never] ? R
    : TrimArgs<T, Next<I>, [T[I]] extends [never] ? R : [...R, T[I]]>

// Structs

export { StructFromUnion, StructFromTuple, PickEntryFromUnion }

type Entry = readonly [PropertyKey, unknown];

type StructFromUnion<T extends Entry = [string, unknown]> = unknown & {
    [K in T[0]]: PickEntryFromUnion<T, K>[1];
}

type PickEntryFromUnion<T extends Entry, Key extends PropertyKey> =
    T extends any ? T[0] extends Key ? T : never : never;

type A = StructFromUnion<["foo", 0] | ["bar", 1]>

type StructFromTuple<T extends readonly (readonly [PropertyKey, unknown])[]> = {
    [K in keyof T & `${number}` as T[K][0]]: T[K][1]
}
