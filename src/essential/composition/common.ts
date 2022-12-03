import { apply, Type } from "free-types-core";
import { Next } from "free-types-core/utils";

export type Composition = [Type, ...Type<1>[]];

export type _Pipe<
    Args extends unknown[],
    $Ts extends Type[],
    I extends number = 0,
    R = apply<$Ts[I], Args>,
    N extends number = Next<I>
> = N extends $Ts['length'] ? R
    : R extends $Ts[N]['constraints'][0] ? _Pipe<[R], $Ts, N>
    : never