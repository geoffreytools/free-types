import { Checked, Type, A, B, C } from "free-types-core";
import { $Optional } from "../../essential/adapters/$Optional";
import { Showable } from "./common";
export { StrReplace, $StrReplace };
declare type $StrReplace<Needle extends Showable = never, With extends Showable = never> = $Optional<$StrReplace3, [Needle, With]>;
interface $StrReplace3 extends Type<[Showable, Showable, string]> {
    type: StrReplace<Checked<A, this>, Checked<B, this>, C<this>>;
}
declare type StrReplace<Needle extends Showable, With extends Showable, Source extends string> = Needle extends '' ? Source : Source extends `${infer Before}${Needle}${infer After}` ? StrReplace<Needle, With, `${Before}${With}${After}`> : Source;
