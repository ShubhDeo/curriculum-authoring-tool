import {
  deleteNode,
  handleTextChange,
  handleIndent,
  handleOutdent,
} from "../utils/tableFunctions";
import { AiOutlineDelete } from "react-icons/ai";
import {
  BsIndent,
  BsUnindent,
  BsArrowsMove
} from "react-icons/bs";
import { fontStyle } from "../utils/colorCoding";
import { Draggable } from "react-beautiful-dnd";
import "../styles.css"


export function Tree(root, isRoot, level, obj, userData, setUserData, getParent, getNodeIdx) {
    let padding = level * 20;
    if(!isRoot) {
        obj.idx++;
    }
    getNodeIdx[obj.idx] = {root, level};
    
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
                        className="mx-1 icon" 
                        onClick={() => handleIndent(root, userData, setUserData, getParent)}
                      />
                      <BsUnindent
                        className="mx-1 icon"
                        onClick={() => handleOutdent(root, userData, setUserData, getParent)}
                      />
                      
                      <AiOutlineDelete
                        className="mx-1 icon"
                        onClick={() => {
                          deleteNode(root, userData, setUserData, getParent);
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
                        handleTextChange(e, root, userData, setUserData,getParent);
                      }}
                      type="text"
                      className="form-control"
                    />
                  </td>
                </tr>
              )}
           </Draggable>
        )}
        {root.child.map((child) => Tree(child, false, level + 1, obj,userData, setUserData,getParent,getNodeIdx))}
      </>
    );
  }
