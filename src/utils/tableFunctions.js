import { Node } from "./Node";
import {v4} from "uuid";

export const insertChild = (root, setUserData, userData) => {
  //A new node with level = 1 will be created.
  let newNode = new Node("", v4());
  root.child.push(newNode);
  setUserData([...userData, newNode]);
};

function findParent(root, targetNode) {
  if (!root) {
    return null;
  }
  let ans = null;
  for (let i = 0; i < root.child.length; i++) {
    if (root.child[i] === targetNode) {
      return root;
    }
  }
  for (let i = 0; i < root.child.length; i++) {
    ans = ans || findParent(root.child[i], targetNode);
  }
  return ans;
}

function deleteAllChildNodes(root, userData) {
  root.child.forEach((c) => {
    userData = deleteAllChildNodes(c, userData);
  });
  userData = userData.filter((c) => c !== root);
  return userData;
}

export const deleteNode = (root, userData, setUserData) => {
  let parent = findParent(userData[0], root);
  let temp = [...userData];

  parent.child = parent.child.filter((c) => c !== root);
  temp = deleteAllChildNodes(root, temp);
  temp = temp.filter((u) => u !== root);
  setUserData(temp);
};

export const handleTextChange = (e, root, userData, setUserData) => {
  //change the text in root.
  let temp = [...userData]; //deep copy
  root.title = e.target.value;
  setUserData(temp);
};

export const handleIndent = (root, userData, setUserData) => {
  let parent = findParent(userData[0], root);
  //find the latest parent for root with parent.level = level;
  let recentParentIdx = -1;
  parent.child.forEach((c, i) => {
    if (c === root && i > 0) {
      recentParentIdx = i - 1;
    }
  });
  if (recentParentIdx !== -1) {
    //remove root from parent.child array.
    let temp = [...userData];
    parent.child = parent.child.filter((c) => c !== root);
    parent.child[recentParentIdx].child.push(root);
    //console.log(temp);
    setUserData(temp);
  } else {
    alert("Cannot Indent row.");
  }
};

export const handleOutdent = (root, userData, setUserData) => {
  let parent = findParent(userData[0], root);
  if (parent === userData[0]) {
    alert("Cannot Outdent row.");
  } else {
    let grandParent = findParent(userData[0], parent);
    let temp = [...userData];
    parent.child = parent.child.filter((c) => c !== root);
    let idx = -1;
    for (let i = 0; i < grandParent.child.length; i++) {
      if (grandParent.child[i] === parent) {
        idx = i;
      }
    }
    //inserted after prev parent
    grandParent.child.splice(idx + 1, 0, root);
    setUserData(temp);
  }
};


function fetchNodeWithGivenIndex(root, curr_idx, target_idx, level) {
  if(!root) {return 0;}
  curr_idx.idx++;
  if(curr_idx.idx-1 === target_idx) {
    return {root, level};
  }
  let ans=null;
  for(let i=0;i<root.child.length;i++) {
    ans=ans||fetchNodeWithGivenIndex(root.child[i], curr_idx,target_idx,level+1);
  }
  return ans;
}

export const handleDragEnd = (results, userData, setUserData) => {
    let srcIdx = results.source.index;
    let desIdx = results.destination.index;

    if(srcIdx!==desIdx) {
        if(srcIdx>desIdx) {desIdx--;}
        let des = fetchNodeWithGivenIndex(userData[0],{idx:0},desIdx,0);
        let src = fetchNodeWithGivenIndex(userData[0],{idx:0},srcIdx,0);
        let srcNode = src.root;
        let desNode = des.root;
        //console.log(des, src);
        if(des.level === src.level) {
          //transfer all child from desNode to srcNode.
          //and place srcNode just after desNode.
          let temp = [...userData];
          let desParent = findParent(userData[0], desNode);
          let srcParent = findParent(userData[0], srcNode);
          srcParent.child = srcParent.child.filter(c => c!==srcNode);
          desNode.child.forEach(c => {
            srcNode.child.push(c);
          })
          console.log(srcNode);
          desNode.child = [];
          console.log(desNode);
          let idx=-1;
          desParent.child.forEach((c, i) => {
            if(c === desNode) {
              idx=i;
            }
          })
          desParent.child.splice(idx+1,0,srcNode);
          setUserData(temp);
        }else if(des.level+1 === src.level) {
          //assign desNode as parent of the srcNode.
          let temp = [...userData];
          let srcParent = findParent(userData[0], srcNode);
          srcParent.child = srcParent.child.filter(c => c!==srcNode);
          desNode.child.splice(0,0,srcNode);
          setUserData(temp);
        }else {
          alert("Invalid drag.");
        }
    }
}

