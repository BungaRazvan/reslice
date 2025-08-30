import { connect } from "reslice";
import TodoList from "./todolist";
import { TodoSlice } from "./type";

function mapStateToProps(slice: TodoSlice, props) {
  return {
    todos: slice.getFiltered(props),
  };
}

export default connect(mapStateToProps, null)(TodoList);
