import { Contra, Type } from '../../dist/core'
import { $Add } from '../../dist/utility-types'

type ContraNarrower<$T extends Type & Contra<$T, Type<[1, 2]>>> = null

// A more general Type can be passed to a HKT
type OK = ContraNarrower<$Add>

type ContraWider<$T extends Type & Contra<$T, Type<2>>> = null

// @ts-expect-error: A more specific Type can't be passed to a HKT
type TooNarrow = ContraWider<$Add>