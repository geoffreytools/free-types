import { Type, apply } from 'free-types-core/dist/';
import { Next } from 'free-types-core/dist/utils';
import { Tuple } from './common';

export interface $Fold<$T extends Type<2>, Init extends $T['constraints'][0]>
    extends Type<1> {
        type: this[0] extends this['constraints'][0]
            ? _Fold<this[0], Init, $T>
            : $T['type']
        constraints: [Tuple<$T['constraints'][1]>]
    }

export type Fold<
    T extends Tuple<$T['constraints'][1]>,
    Init extends $T['constraints'][0] & $T['type'],
    $T extends Type<2>,
> = _Fold<T, Init, $T>

export type _Fold<
    T extends readonly unknown[],
    Init,
    $T extends Type<2>,
    Acc = Init,
    I extends number = 0
> = I extends T['length'] ? Acc
    : _Fold<T, Init, $T, apply<$T, [Acc, T[I]]>, Next<I>>
