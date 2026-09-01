import { _apply, Slice, Type, AppliedArguments } from 'core';

export interface $Arity<N extends number, $T extends Type>
    extends Type<Slice<Required<$T['constraints']>, 0, N>>
        { type: _apply<$T, AppliedArguments<this>> }