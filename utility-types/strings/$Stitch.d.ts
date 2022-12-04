import { Type, A, B, C } from "free-types-core";
import { $Optional } from "../../essential/adapters/$Optional";
import { Showable } from "./common";
export { $Stitch };
declare type $Stitch<S extends Showable = never, A extends Showable = never> = $Optional<$Stitch3, [S, A]>;
interface $Stitch3 extends Type<[Showable, Showable, Showable]> {
    type: this['arguments'] extends this['constraints'] ? `${B<this>}${A<this>}${C<this>}` : string;
}
