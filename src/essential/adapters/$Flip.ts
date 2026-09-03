import { A, _apply, B, _Type, CreateType } from 'core'

export interface $Flip<$T extends _Type<[unknown, unknown]>> extends CreateType<{ type: unknown }, {
    constraints: [$T['constraints'][B], $T['constraints'][A]]
    names: {}
}> {
    type: _apply<$T, [this[B], this[A]]>
}