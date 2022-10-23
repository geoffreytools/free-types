import { Type, Checked, A } from '../core';
import { Compute } from './utils';
import { MapOver } from './mappables/MapOver';

export type Signature<$T extends Type | Type[]> =
    $T extends Type[] ? MapOver<$T, $VerboseSignature>
    : $T extends Type ? _Signature<$T>
    : never;

type _Signature<$T extends Type> = {
    input: $T['constraints'],
    output: $T['type']
}

interface _VerboseSignature<$T extends Type> extends _Signature<$T> {
    type: $T
}

interface $VerboseSignature extends Type<[Type]> {
    type: Compute<_VerboseSignature<Checked<A, this>>>
}