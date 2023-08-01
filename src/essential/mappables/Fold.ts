import { Type, A, At } from 'free-types-core/dist/';
import { Mappable } from './common';
import { Object2Tuple } from './Object2Tuple';
import { _Fold as FoldTuple } from '../Tuple/Fold'

export type Fold<
    T extends Mappable<$T['constraints'][1]>,
    Init extends $T['constraints'][0] & $T['type'],
    $T extends Type<2>
> = T extends readonly unknown[] ?
        FoldTuple<T, Init, $T>
        : Fold<Object2Tuple<T>, Init, $T>;

export interface $Fold<$T extends Type<2>, Init extends $T['constraints'][0]>
    extends Type<1> {
        type: At<A, this> extends this['constraints'][0]
            ? Fold<At<A, this>, Init, $T>
            : $T['type']
        constraints: [Mappable<$T['constraints'][1]>]
    }