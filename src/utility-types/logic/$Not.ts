import { apply, Type } from 'core';
import { Not } from 'utils';

export interface $Not<$T extends Type<1>> extends Type<1> { 
    type: Not<apply<$T, [this[0]]>>
}