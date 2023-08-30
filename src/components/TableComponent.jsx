import { useState, useEffect } from "react";
import { Node } from "../utils/Node";
import {
  insertChild,
  deleteNode,
  handleTextChange,
  handleIndent,
  handleOutdent,
  handleDragEnd
} from "../utils/tableFunctions";
import { AiOutlineDelete } from "react-icons/ai";
import {
  BsIndent,
  BsUnindent,
  BsArrowsMove
} from "react-icons/bs";
import { fontStyle } from "../utils/colorCoding";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import {StrictModeDroppable} from '../utils/DroppableStrict'
import {v4} from "uuid"

const TableComponent = () => {
  const [userData, setUserData] = useState([]);
  const [rootNode, setRootNode] = useState(null);

  useEffect(() => {
    const root = new Node("", v4());
    setRootNode(root);
    setUserData([...userData, root]);
  }, []);

  function treeTraversal(root, isRoot, level, obj) {
    if (!root) {
      return;
    }
    let padding = level * 20;
    if(!isRoot) {
        obj.idx++;
    }
    
    return (
      <>
        {!isRoot && (
           <Draggable draggableId={root.id.toString()} index={obj.idx} key={root.id.toString()}>
              {(provider) => (
                <tr
                  ref={provider.innerRef}
                  {...provider.draggableProps}
                >
                  <td {...provider.dragHandleProps}>
                    <BsArrowsMove 
                      className="mx-1" 
                    />
                  </td>
                  <td>
                    <BsIndent
                        className="mx-1"
                        onClick={() => handleIndent(root, userData, setUserData)}
                      />
                      <BsUnindent
                        className="mx-1"
                        onClick={() => handleOutdent(root, userData, setUserData)}
                      />
                      
                      <AiOutlineDelete
                        className="mx-1"
                        onClick={() => {
                          deleteNode(root, userData, setUserData);
                        }}
                      />
                  </td>
                  <td>
                    <input
                      style={{
                        paddingLeft: padding,
                        color: fontStyle[level].c,
                        fontWeight: fontStyle[level].w,
                        outline: "none",
                        border: "none",
                        boxShadow: "none"
                      }}
                      value={root.title}
                      onChange={(e) => {
                        handleTextChange(e, root, userData, setUserData);
                      }}
                      type="text"
                      className="form-control"
                    />
                  </td>
                </tr>
              )}
           </Draggable>
        )}
        {root.child.map((child) => treeTraversal(child, false, level + 1, obj))}
      </>
    );
  }

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
                {treeTraversal(rootNode, true, 0, {idx: 0})}
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
