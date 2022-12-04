import { Natural, Prev, Next } from 'free-types-core/dist/utils';
export { IsNatural, Add };
export { Compute };
export { Assert };
export { And, Or, Not };
export { IsAny, ArrayKeys, Next, Extends, Eq, Tuple } from 'free-types-core/dist/utils';
export { IsUnion, LastUnionMember, Union2Tuple };
declare type IsNatural<T> = T extends _IsNatural ? true : false;
declare type _IsNatural = Natural[number];
declare type Add<A extends number, B extends number> = number extends A ? number : number extends B ? number : _Add<A, B>;
declare type _Add<A extends number, B extends number, _A = Next<A>, _B = Prev<B>> = B extends 0 ? A : [_A] extends [never] ? never : [_B] extends never ? never : _Add<_A & number, _B & number>;
declare type Compute<T> = {
    [K in keyof T]: T[K];
} & unknown;
declare type Assert<T, U> = T extends U ? T : never;
declare type And<A, B> = A extends false ? false : B extends false ? false : B;
declare type Or<A, B> = A extends false ? B extends false ? false : B : A;
declare type Not<T> = [T] extends [false] ? true : false;
declare type Union2Intersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
declare type LastUnionMember<T> = Union2Intersection<T extends any ? () => T : never> extends () => (infer R) ? R : never;
declare type Union2Tuple<U, Last = LastUnionMember<U>> = [
    U
] extends [never] ? [] : [...Union2Tuple<Exclude<U, Last>>, Last];
declare type IsUnion<T> = [T] extends [LastUnionMember<T>] ? false : true;
