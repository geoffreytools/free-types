import { Type, apply } from "free-types-core";
import { test } from 'ts-spec';
import { GroupBy, $GroupBy } from "../../../essential/mappables/GroupBy";

type OddNumbers = 1 | 3 | 5 | 7 | 9
type EvenNumbers = 0 | 2 | 4 | 6 | 8
type Numbers = EvenNumbers | OddNumbers

type NumericList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

interface $Parity extends Type<[Numbers], string> {
    type: this[0] extends EvenNumbers ? 'even' : 'odd'
}

type ParityGroups = {
    even: [0, 2, 4, 6, 8],
    odd: [1, 3, 5, 7, 9]
};

test('2 groups', t => [
    t.equal<GroupBy<NumericList, $Parity>, ParityGroups>(),
    t.equal<apply<$GroupBy<$Parity>, [NumericList]>, ParityGroups>()
])

interface $Sizes extends Type<[Numbers], string> {
    type: this[0] extends 0 ? 'null'
        : this[0] extends 1|2|3 ? 'small'
        : this[0] extends 4|5|6 ? 'medium'
        : 'big'
}

type SizesGroups = {
    null: [0],
    small: [1, 2, 3],
    medium: [4, 5, 6],
    big: [7, 8, 9]
};

test('arbitrary number of groups', t => [
    t.equal<GroupBy<NumericList, $Sizes>, SizesGroups>(),
    t.equal<apply<$GroupBy<$Sizes>, [NumericList]>, SizesGroups>()
])