import { _apply, _Type, Type, AppliedArguments } from 'core'
import { Intersect } from 'utility-types/logic/$Intersect'

export interface $Constrain<$T extends _Type, Cs extends unknown[]>
    extends Type<Intersect<$T['constraints'], Cs>> {
        type: _apply<$T,
            AppliedArguments<this> extends $T['constraints']
            ? AppliedArguments<this> : this['constraints']
        >
    }