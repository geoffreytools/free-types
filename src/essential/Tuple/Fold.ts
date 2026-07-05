import { Type, apply } from 'free-types-core/dist/';
import { Next } from 'free-types-core/dist/utils';
import { Input } from './common';

export interface $Fold<$T extends Type<2>, Init extends $T['constraints'][0]>
    extends Type<1> {
        type: this[0] extends infer T
            ? T extends Input<$T['constraints'][1]> ? Fold<T, Init, $T> : $T['type']
            : never
        constraints: [Input<$T['constraints'][1]>]
    }

export type Fold<
    T extends Input<$T['constraints'][1]>,
    Init extends $T['constraints'][0] & $T['type'],
    $T extends Type<2>,
> = number extends T['length'] ? $T['type']
    : _Fold<T, Init, $T> extends infer R extends $T['type']
        ? R : never

export type _Fold<
    T extends readonly unknown[],
    Init,
    $T extends Type<2>,
    Acc = Init,
    I extends number = 0
> = I extends T['length'] ? Acc
    : _Fold<T, Init, $T, apply<$T, [Acc, T[I]]>, Next<I>>
