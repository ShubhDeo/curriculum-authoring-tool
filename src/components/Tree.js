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


export function Tree(root, isRoot, level, obj, userData, setUserData, getParent) {
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
                        onClick={() => handleIndent(root, userData, setUserData, getParent)}
                      />
                      <BsUnindent
                        className="mx-1"
                        onClick={() => handleOutdent(root, userData, setUserData, getParent)}
                      />
                      
                      <AiOutlineDelete
                        className="mx-1"
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
        {root.child.map((child) => Tree(child, false, level + 1, obj,userData, setUserData,getParent))}
      </>
    );
  }
