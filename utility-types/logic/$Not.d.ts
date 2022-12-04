import { apply, Type } from "free-types-core";
import { Not } from "../../essential/utils";
export interface $Not<$T extends Type<1>> extends Type<1> {
    type: Not<apply<$T, [this[0]]>>;
}
