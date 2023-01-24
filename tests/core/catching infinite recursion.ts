import { Type, apply, At } from '../..';

type Zeros<N, R extends unknown[] = []> =
    N extends R['length'] ? R : Zeros<N, [0, ...R]>;

//@ts-expect-error: caught here and not when $Zeros is used
interface $Zeros extends Type<1> {
    type: Zeros<At<0, this>>;
}

type TwoZeros = apply<$Zeros, [2]>