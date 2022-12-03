import { Type, Checked, A, B} from 'free-types-core';
import { $Optional } from '../essential/adapters/$Optional';

export { $ReturnType, $Parameters, $Parameter };

type Fn = (...args: any[]) => unknown

interface $ReturnType extends Type<[Fn]> {
    type: ReturnType<Checked<A, this>>
}

interface $Parameters extends Type<[Fn]> {
    type: this[0] extends Fn ? Parameters<this[0]> : unknown[]
}

type $Parameter<Index extends number = never> =
    $Optional<$ParameterAt, [Index]>

interface $ParameterAt extends Type<[Index: number, Fn: Fn]> {
    type: this[B] extends Fn ? Parameters<this[B]>[A<this>] : unknown
}