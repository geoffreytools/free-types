import { _apply, Slice, Type, AppliedArguments } from 'core'

type _Type<C = any> = { constraints: C, type: unknown, appliedArguments: unknown };

export type $Rest<$T extends _Type<[unknown[]]>, N extends number = never> =
    [N] extends [never] ? $RestAuto<$T> : $RestN<$T, N>;

interface $RestAuto<$T extends _Type<[unknown[]]>> extends Type<$T['constraints'][0]> {
    type: Rest<$T, this>
}

interface $RestN<
    $T extends _Type<[unknown[]]>,
    N extends number
> extends Type<Slice<$T['constraints'][0], 0, N>> {
    type: Rest<$T, this>
}

type Rest<$T extends _Type, This extends _Type<any>> =
    AppliedArguments<This> extends This['constraints']
    ? _apply<$T, [AppliedArguments<This> extends unknown[] & infer Args ? Args : never]>
    : $T['type']