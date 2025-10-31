import { Slice } from "reslice";
import { reducer } from "./ducks";

export type TodosSlice = Slice<typeof reducer>;
