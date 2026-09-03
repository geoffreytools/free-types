import { _apply, _Type, AppliedArguments, CreateType } from 'core'
import { RelatesTo } from 'utility-types/logic/$RelatesTo'

export interface $As<$T extends _Type & CheckType<$T, R>, R> extends CreateType<{ type: unknown }, {
    constraints: $T['constraints'] extends unknown[] ? $T['constraints'] : unknown[]
    names: {}
}> {
    type: AppliedArguments<this> extends this['constraints']
    ? _apply<$T, AppliedArguments<this>> extends infer result extends R ? result : R
    : R
}

type CheckType<$T extends _Type, R> =
    RelatesTo<$T['type'], R> extends true
    ? { constraints: $T['constraints'], type: $T['type'] }
    : { error: "$T['type'] is unrelated to R", $T: $T, R: R }