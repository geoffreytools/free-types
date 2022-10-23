import { apply, Slice, ToTuple, Type } from "free-types-core"

export interface $Rest<$T extends Type<[unknown[]]>, N extends number = never>
    extends Type<RestConstraints<$T['constraints'][0], N>> {
        type: this['arguments'] extends this['constraints']
            ? apply<$T, [ToTuple<this['arguments']>]>
            : $T['type']
    }

type RestConstraints<C extends unknown[], N extends number> =
    [N] extends [never] ? C : Slice<C, 0, N>
