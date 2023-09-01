import { useState, useEffect, useRef } from "react";
import {
  insertChild,
  handleDragEnd,
  saveData,
  handleLoad
} from "../utils/tableFunctions";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import {StrictModeDroppable} from '../utils/DroppableStrict'
import {v4} from "uuid"
import {Tree} from './Tree'
import "../styles.css"

const TableComponent = () => {
  const [userData, setUserData] = useState([]);
  const [rootNode, setRootNode] = useState(null);
  const [load, setLoad] = useState(false);
  const getParent = useRef({}); //child_id -> parent obj
  const getNodeIdx = useRef({}); //flat idx -> {node, level}

  useEffect(() => {
    const root = {
      id: v4(),
      title: "/root",
      child: []
    }
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
          className="btn btn-primary m-2 icon"
          disabled={load}
          onClick={() => {
            insertChild(rootNode, setUserData, userData, getParent);
          }}
        >
          Add Standard
        </button>
        <button
          type="button"
          className="btn btn-primary m-2 icon"
          disabled={load}
          onClick={() => {
            saveData(rootNode);
          }}
        >
          Save
        </button>
        <label type="button" className="btn btn-primary m-2 icon">
            <input 
                type="file" 
                accept=".txt" 
                style={{display: "none"}} 
                onChange={(e) => {
                  handleLoad(e.target.files[0], setLoad, setUserData, setRootNode,getParent)
                }} 
            />
            Load
        </label>
      </div>
    </div>
  );
};

export default TableComponent;
