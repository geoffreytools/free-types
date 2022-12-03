import { RecursiveTupleMap } from '../mappables/RecursiveTupleMap';
import { apply, Const, Type } from "free-types-core";
import { Next, Tuple } from "free-types-core/dist/utils";

export type $Before<$T extends Type, $P extends Type<1>, I extends number = never> =
    _$Before<$T, $P, I>[[I] extends [never] ? 'BeforeN' : 'BeforeI']

interface _$Before<$T extends Type, $P extends Type<1>, I extends number> {
    BeforeN: $BeforeN<$T, $P>
    BeforeI: $BeforeI<$T, $P, I>
}

interface $BeforeI<
    $T extends Type<$P['constraints'][0][]>,
    $P extends Type<1>,
    I extends number
> extends Type<
    ReplaceAt<$T['constraints'], I, Const<$P['constraints'][0]>>
> {
    type: apply<$T, ReplaceAt<this['arguments'], I, $P>>
}

type ReplaceAt<
    T extends unknown[],
    N extends number,
    $P extends Type<1>,
    I extends number = 0,
    R extends unknown[] = []
> = 
    number extends T['length'] ? T[number][]
    : I extends T['length'] ? R
    : ReplaceAt<T, N, $P, Next<I>, [...R, I extends N ? apply<$P, [T[I]]> : T[I]]>;

type $BeforeN<$T extends Type<$P['constraints'][0][]>, $P extends Type<1>> =
    _$BeforeN<$T, $P, Tuple<$T['constraints']['length'], $P['constraints'][0]>>

interface _$BeforeN<
    $T extends Type,
    $P extends Type,
    Constraints extends unknown[]
> extends Type<Constraints> {
    type: apply<$T, RecursiveTupleMap<
        this['arguments'] extends Constraints
        ? this['arguments'] : Constraints,
    $P>>
}