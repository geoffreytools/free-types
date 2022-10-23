import { Type, apply } from "free-types-core";

export { Choose, $Choose }

interface $Choose<$P extends Type<2, boolean>>
    extends Type<$P['constraints']> {
        type: this['arguments'] extends $P['constraints']
            ? Choose<$P, this[0], this[1]>
            : $P['constraints'][number]
    }

type Choose<$P extends Type, A, B> =
    apply<$P, [A, B]> extends false ? B : A