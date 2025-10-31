import { connect } from "reslice";
import TodoList from "./todolist";
import { TodosSlice } from "./type";

function mapStateToProps(slice: TodosSlice, props) {
  return {
    todos: slice.getFiltered(props),
  };
}

export default connect(mapStateToProps, null)(TodoList);
