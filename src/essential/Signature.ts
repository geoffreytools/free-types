import { Type, _Type } from 'free-types-core';


export type Signature<$T extends _Type | _Type[]> =
    $T extends _Type[] ? unknown & {
        [K in keyof $T]: _VerboseSignature<Extract<$T[K], _Type>>
    }
    : $T extends Type ? _Signature<$T>
    : never;

type _Signature<$T extends _Type> = {
    input: $T['constraints'],
    output: $T['type']
}

interface _VerboseSignature<$T extends _Type> extends _Signature<$T> {
    type: $T
}