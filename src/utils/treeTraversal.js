import { deleteNode, handleTextChange } from "./tableFunctions";
import { AiOutlineDelete } from "react-icons/ai";
import { BsIndent, BsUnindent, BsArrowsMove } from "react-icons/bs";

export function treeTraversal(root, userData, setUserData) {
  if (!root) {
    return;
  }
  //console.log(userData);

  return (
    <>
      {root.level > 0 && (
        <tr>
          <td>
            <BsArrowsMove className="mx-1" />
            <BsIndent className="mx-1" />
            <BsUnindent className="mx-1" />
            <AiOutlineDelete
              className="mx-1"
              onClick={() => {
                deleteNode(root, userData, setUserData);
              }}
            />
          </td>
          <td>
            <input
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
      {root.child.map((child) => treeTraversal(child))}
    </>
  );
}
