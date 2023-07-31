import { apply, Next, Type, Checked, A, free } from "free-types-core";
import { LastUnionMember, PickEntryFromUnion, StructFromTuple } from "../utils";

export { GroupBy, $GroupBy, GroupUnionBy, $GroupUnionBy };

type $Predicate = Type<[UnionMember: unknown], PropertyKey>

type Entry = readonly [PropertyKey, unknown];

type Aggregate = readonly [PropertyKey, readonly unknown[]]

interface $GroupBy<$P extends $Predicate> extends Type<[readonly unknown[]]> {
    type: GroupBy<Checked<A, this>, $P>
}

type GroupBy<
    T extends readonly unknown[],
    $T extends $Predicate,
    I extends number = 0,
    R extends Aggregate[] = []
> = I extends T['length'] ? StructFromTuple<R>
    : GroupBy<T, $T, Next<I>, Merge<T[I], $T, R>>;

type Merge<
    T,
    $T extends $Predicate,
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
    $P extends $Predicate,
    $T extends $Transform = free.Id
> extends Type<1> {
    type: unknown extends this[0] ? {} : GroupUnionBy<this[0], $P, $T>
}

type $Transform = Type<[union: unknown, length?: number]>;

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
type GroupUnionBy<U, $P extends $Predicate, $T extends $Transform = free.Id> =
    _GroupUnionBy<U, $P, $T>

type _GroupUnionBy<
    U,
    $P extends $Predicate,
    $T extends $Transform = free.Id,
    R extends Aggregate = never,
    L = LastUnionMember<U>,
> = [U] extends [never]
    ? StructFromUnionWith<R, $T>
    : _GroupUnionBy<Exclude<U, L>, $P, $T, MergeUnion<L, $P, R>>;


type MergeUnion<
    T,
    $P extends $Predicate,
    R extends Aggregate,
    Key extends PropertyKey = apply<$P, [T]>,
    Selected extends Aggregate = PickEntryFromUnion<R, Key>
> = [Selected] extends [never] ? R | [Key, [T]]
    : Exclude<R, Selected> | [Key, [...Selected[1], T]];


type StructFromUnionWith<
    T extends Aggregate,
    $T extends $Transform,
> = unknown & {
    [K in T[0]]:
        PickEntryFromUnion<T, K>[1] extends infer E extends unknown[]
        ? apply<$T, [E[number], E['length']]>
        : never;
}