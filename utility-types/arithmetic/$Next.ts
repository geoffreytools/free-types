import { Type, A } from "free-types-core";
import { Next } from "free-types-core/utils";

export { Next, $Next }

interface $Next extends Type<[number]> { type: Next<A<this>> }

