import { Const, partial } from "free-types-core";
import { $Fork } from "../logic";
import { $Reduce } from "../../essential/mappables/Reduce";
import { $IsEmpty } from "../../essential/mappables/IsEmpty";
import { $As } from "../../essential/adapters/$As";
import { $Stitch } from "./$Stitch";
import { Showable } from "./common";
export declare type $Join<S extends Showable> = $As<$Fork<$IsEmpty, Const<''>, $Reduce<partial<$Stitch, [S]>>, [
    Showable[]
]>, string>;
