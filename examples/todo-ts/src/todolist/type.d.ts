import { Slice } from "reslice";
import { reducer } from "./ducks";

export type TodoSlice = Slice<typeof reducer>;
