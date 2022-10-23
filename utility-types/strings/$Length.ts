import { A, Type } from "free-types-core"
import { Next } from "free-types-core/utils"

export { Length, $Length }

interface $Length extends Type<[string]> {
    type: Length<A<this>>
}

type Length<T extends string> =
    string extends T ? number : _Length<T>

type _Length<T, R extends number = 0> =
    T extends '' ? R
    : T extends `${string}${infer U}` ? _Length<U, Next<R>>
    : Next<R>