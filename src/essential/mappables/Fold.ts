import { Type, apply, A, At } from 'free-types-core/';
import { Next } from 'free-types-core/utils';
import { Mappable } from './common';
import { Object2Tuple } from './Object2Tuple';

export type Fold<
    T extends Mappable<$T['constraints'][1]>,
    Init extends $T['constraints'][0] & $T['type'],
    $T extends Type<2>,
    Acc extends unknown = Init,
    I extends number = 0
> = T extends unknown[] ? (
        I extends T['length'] ? Acc
        : Fold<T, Init, $T, apply<$T, [Acc, T[I]]>, Next<I>>
    )
    : Fold<Object2Tuple<T>, Init, $T>;

export interface $Fold<$T extends Type<2>, Init extends $T['constraints'][0]>
    extends Type<1> {
        type: At<A, this> extends this['constraints'][0]
            ? Fold<At<A, this>, Init, $T>
            : $T['type']
        constraints: [Mappable<$T['constraints'][1]>]
    }
