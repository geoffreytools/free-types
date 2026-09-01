import { apply, _apply, Next, Type, Checked, A, free, Expect } from 'core';
import { LastUnionMember, StructFromTuple } from 'utils';

export { GroupBy, $GroupBy, GroupUnionBy, $GroupUnionBy };

type $Predicate<T = any> = Type<[UnionMember: T], PropertyKey>
type $ExpectPredicate = Expect<$Predicate>

type Entry = readonly [PropertyKey, unknown];

type Aggregate = readonly [PropertyKey, readonly unknown[]]

interface $GroupBy<$P extends $ExpectPredicate> extends Type<[readonly unknown[]]> {
    type: GroupBy<Checked<A, this>, $P>
}

type GroupBy<
    T extends readonly unknown[],
    $T extends $ExpectPredicate,
    I extends number = 0,
    R extends Aggregate[] = []
> = I extends T['length'] ? StructFromTuple<R>
    : GroupBy<T, $T, Next<I>, Extract<Merge<T[I], $T, R>, Aggregate[]>>;

type Merge<
    T,
    $T extends $ExpectPredicate,
    R extends Aggregate[],
    Key extends PropertyKey = apply<$T, [T]>,
    Selected extends Aggregate = PickEntry<R, Key>
> = [Selected] extends [never] ? [...R, [Key, [T]]]
    : [...OmitEntry<R, Key>, [Key, [...Selected[1], T]]];

type PickEntry<
    T extends Entry[],
    Key extends PropertyKey,
    I extends number = 0,
> = I extends T['length'] ? never
    : T[I][0] extends Key ? T[I]
    : PickEntry<T, Key, Next<I>>;

type OmitEntry<
    T extends Entry[],
    Key extends PropertyKey,
    I extends number = 0,
    R extends unknown[] = []
> = I extends T['length'] ? R
    : OmitEntry<T, Key, Next<I>,
        T[I][0] extends Key ? R : [...R, T[I]]>;

/**
 * ```
 * interface $GroupUnionBy<$P, $T?> => [U] => Struct
 * ```
 * Partition the union `U` into sub-unions and store the result in a Struct. The name and composition of the groups is decided by calling the predicate `$P` on each member of `U`.
 * 
 * Optionally take a transfrom `$T` to map over the sub-unions as they are inserted. `$T` exposes the length of the sub-union as a second optional parameter.
 * 
 * ```
 * type $Predicate = Type<[member: unknown], PropertyKey>
 * type $Transform = Type<[union: unknown, length?: number]>
 * ```
 */
interface $GroupUnionBy<
    $P extends $ExpectPredicate,
    $T extends $ExpectTransform = free.Id
> extends Type<1> {
    type: unknown extends this[0] ? {} : GroupUnionBy<this[0], $P, $T>
}

type $Transform<T = any> = Type<[union: T, length: number]>;
type $ExpectTransform = Expect<$Transform>

/**
 * ```
 * type GroupUnionBy<U, $P, $T?> = Struct
 * ```
 * Partition the union `U` into sub-unions and store the result in a Struct. The name and composition of the groups is decided by calling the predicate `$P` on each member of `U`.
 * 
 * Optionally take a transfrom `$T` to map over the sub-unions as they are inserted. `$T` exposes the length of the sub-union as a second optional parameter.
 * 
 * ```
 * type $Predicate = Type<[member: unknown], PropertyKey>
 * type $Transform = Type<[union: unknown, length?: number]>
 * ```
 */
type GroupUnionBy<U, $P extends $ExpectPredicate, $T extends $ExpectTransform = free.Id> =
    _GroupUnionBy<U, $P, $T>

type _GroupUnionBy<U, $P extends $ExpectPredicate, $T extends $ExpectTransform> =
    [U] extends [never] ? {}
    : StructFromGroupsWith<{ [M in U as _apply<$P, [M]>]: M }, $T>

type StructFromGroupsWith<Groups, $T extends $ExpectTransform> = unknown & {
    [K in keyof Groups]: _apply<$T, [Groups[K], UnionLength<Groups[K]>]>
}

type UnionLength<U, L extends number = 0> =
    [U] extends [never] ? L : UnionLength<Exclude<U, LastUnionMember<U>>, Next<L>>;
