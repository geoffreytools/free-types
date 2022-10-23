import { A, Type } from "free-types-core";
import { ArrayKeys, Natural } from "free-types-core/utils";

export { ParseNat, $ParseNat };

interface $ParseNat extends Type<[string]> { type: ParseNat<this[A]> }

type ParseNat<T> =
    T extends keyof Omit<Natural, ArrayKeys> ? Natural[T] : number