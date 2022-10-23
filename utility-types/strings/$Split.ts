import { Type, A, B } from "free-types-core"
import { $Optional } from "../../essential/adapters/$Optional"

export { Split, $Split }

type $Split<
    S extends string = never,
    I extends string = never
> = $Optional<$Split2, [S, I]>

interface $Split2 extends Type<[string, string]> {
    type: unknown extends this[0] ? string[]
        : unknown extends this[1] ? string[]
        : Split<A<this>, B<this>>
}

type Split<S extends string, T extends string, R extends string[] = []> =
    T extends '' ? R extends [''] | [] ? ['', ...R] : R
    : T extends `${infer R1}${S}${infer R2}` ? (
        R2 extends ''
        ? S extends '' ? [...R, R1] : [...R, R1, '']
        : Split<S, R2, [...R, R1]>
    ) : [...R, T]
