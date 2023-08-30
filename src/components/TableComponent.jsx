import { useState, useEffect } from "react";
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

  useEffect(() => {
    const root = new Node("", v4());
    setRootNode(root);
    setUserData([...userData, root]);
  }, []);


  return (
    <div className="mt-4">
      <DragDropContext onDragEnd={(results) => {handleDragEnd(results,userData, setUserData)}}>
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
                {Tree(rootNode, true, 0, {idx: 0},userData, setUserData)}
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
            insertChild(rootNode, setUserData, userData);
          }}
        >
          Add Standard
        </button>
      </div>
    </div>
  );
};

export default TableComponent;
