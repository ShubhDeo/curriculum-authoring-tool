import { useState, useEffect, useRef } from "react";
import { Node } from "../utils/Node";
import {
  insertChild,
  handleDragEnd
} from "../utils/tableFunctions";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import {StrictModeDroppable} from '../utils/DroppableStrict'
import {v4} from "uuid"
import {Tree} from './Tree'

const TableComponent = () => {
  const [userData, setUserData] = useState([]);
  const [rootNode, setRootNode] = useState(null);
  const getParent = useRef({}); //child_id -> parent obj
  const getNodeIdx = useRef({}); //flat idx -> node

  useEffect(() => {
    const root = new Node("", v4());
    setRootNode(root);
    getParent.current[root.id] = null;
    setUserData([...userData, root]);
  }, []);


  return (
    <div className="mt-4">
      <DragDropContext onDragEnd={(results) => {handleDragEnd(results,userData, setUserData,getParent,getNodeIdx)}}>
        <table className="table bordered">
          <thead>
            <tr>
              <th scope="col">Drag</th>
              <th scope="col">Actions</th>
              <th scope="col">Standard</th>
            </tr>
          </thead>
          <StrictModeDroppable droppableId="tbody">
            {(provided) => (
              <tbody ref={provided.innerRef} {...provided.droppableProps}>
                {Tree(rootNode, true, 0, {idx: 0},userData, setUserData, getParent, getNodeIdx)}
                {provided.placeholder}
              </tbody>
            )}
          </StrictModeDroppable>
        </table>
      </DragDropContext>
      <div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            insertChild(rootNode, setUserData, userData, getParent);
          }}
        >
          Add Standard
        </button>
      </div>
    </div>
  );
};

export default TableComponent;
