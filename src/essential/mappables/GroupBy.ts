import { apply, Next, Type, Checked, A } from "free-types-core";
import { StructFromTuple } from "../utils";

export { GroupBy, $GroupBy };

type $Predicate = Type<1, PropertyKey>;

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

type Entry = readonly [PropertyKey, unknown];
type Aggregate = readonly [PropertyKey, readonly unknown[]]

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