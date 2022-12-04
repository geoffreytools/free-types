import { Type, A } from "free-types-core";
import { Next } from "free-types-core/dist/utils";
export { Next, $Next };
interface $Next extends Type<[number]> {
    type: Next<A<this>>;
}
