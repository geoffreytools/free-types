import { Type, apply } from 'core';

export { $Extends, $Refine, $Reject, $Flip, IsTruthy };

type IsTruthy<T> = [T] extends [never] ? false : true;

interface $Refine<$T extends Type<1>, Refinement> extends Type<$T['constraints']> {
    type: unknown extends this[0] ? Refinement
        : apply<$T, [this[0]]> extends true ? Refinement : never
}

interface $Reject<$T extends Type<1>, Remaining = unknown> extends Type<$T['constraints']> {
    type: unknown extends this[0] ? Remaining
        : apply<$T, [this[0]]> extends false ? Remaining : never
}

interface $Flip<$T extends Type<1>, Remaining = unknown>
    extends Type<$T['constraints']> {
        type: unknown extends this[0] ? Remaining
            : IsTruthy<apply<$T, [this[0]]>> extends false ? Remaining : never

    }

interface $Extends<Refinement = never> extends Type<1> {
    type: unknown extends this[0] ? Refinement
        : [this[0]] extends [Refinement] ? Refinement : never
}