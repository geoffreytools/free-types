import { apply, Type } from "free-types-core"
import { Intersect } from "../../utility-types/logic/$Intersect"
import { RelatesTo } from "../../utility-types/logic/$RelatesTo"

export interface $As<$T extends Type & CheckType<$T, R>, R> extends Type {
    type: this['arguments'] extends this['constraints']
    ? Intersect<apply<$T, this['arguments']>, R>
    : R
    constraints: $T['constraints'] extends unknown[] ? $T['constraints'] : unknown[]
}

type CheckType<$T extends Type, R> =
    RelatesTo<$T['type'], R> extends true
    ? Type<$T['constraints'], $T['type']>
    : { error: "$T['type'] is unrelated to R", $T: $T, R: R }