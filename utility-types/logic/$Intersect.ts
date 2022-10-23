import { Type } from "free-types-core";
import { $Optional } from "../../essential/adapters/$Optional";

export { Intersect, $Intersect };

type $Intersect<T = never> = $Optional<$Intersect2, [T]>;

interface $Intersect2 extends Type<2> {
    type: Intersect<this[0], this[1]>
}

type Intersect<T, U> =
    [T] extends [U] ? T :
    [U] extends [T] ? U :
    T & U;