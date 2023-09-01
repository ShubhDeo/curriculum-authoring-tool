import {v4} from "uuid";

export const insertChild = (root, setUserData, userData,getParent) => {
  //A new node with level = 1 will be created.
  let newNode = {
    id: v4(),
    title: "",
    child: []
  }
  root.child.push(newNode);
  getParent.current[newNode.id] = root; //child_id -> parent obj
  setUserData([...userData, newNode]);
};


function deleteAllChildNodes(root, userData, getParent) {
  if(!root) {
    delete (getParent.current[root.id]);
  }
  root.child.forEach((c) => {
    userData = deleteAllChildNodes(c, userData, getParent);
  });
  userData = userData.filter((c) => c !== root);
  return userData;
}

export const deleteNode = (root, userData, setUserData,getParent) => {
  let parent = getParent.current[root.id];
  //console.log(parent, getParent.current[root.id])
  let temp = [...userData];

  parent.child = parent.child.filter((c) => c !== root);
  temp = deleteAllChildNodes(root, temp, getParent);
  temp = temp.filter((u) => u !== root);
  setUserData(temp);
};

export const handleTextChange = (e, root, userData, setUserData) => {
  //change the text in root.
  let temp = [...userData]; //deep copy
  root.title = e.target.value;
  setUserData(temp);
};

export const handleIndent = (root, userData, setUserData, getParent) => {
  let parent = getParent.current[root.id];
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
    getParent.current[root.id] = parent.child[recentParentIdx];
    //console.log(temp);
    setUserData(temp);
  } else {
    alert("Cannot Indent row.");
  }
};

export const handleOutdent = (root, userData, setUserData,getParent) => {
  let parent = getParent.current[root.id];
  if (parent === userData[0]) {
    alert("Cannot Outdent row.");
  } else {
    let grandParent = getParent.current[parent.id];
    let temp = [...userData];
    parent.child = parent.child.filter((c) => c !== root);
    getParent.current[root.id] = grandParent;
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


export const handleDragEnd = (results, userData, setUserData, getParent,getNodeIdx) => {
    let srcIdx = results.source.index;
    let desIdx = results.destination.index;

    if(srcIdx!==desIdx) {
        if(srcIdx>desIdx) {desIdx--;} //bottom to top
        let des = getNodeIdx[desIdx];
        let src = getNodeIdx[srcIdx];
        
        let srcNode = src.root;
        let desNode = des.root;
        //console.log(des, src);
        if(des.level === src.level) {
          //transfer all child from desNode to srcNode.
          //and place srcNode just after desNode.
          let temp = [...userData];
          let desParent = getParent.current[desNode.id];
          let srcParent = getParent.current[srcNode.id];

          srcParent.child = srcParent.child.filter(c => c!==srcNode);

          desNode.child.forEach(c => {
            getParent.current[c.id] = srcNode;
            srcNode.child.push(c);
          })
          
          desNode.child = [];
          
          let idx=-1;

          desParent.child.forEach((c, i) => {
            if(c === desNode) {
              idx=i;
            }
          })
          desParent.child.splice(idx+1,0,srcNode);
          getParent.current[srcNode.id] = desParent;
          setUserData(temp);
        }else if(des.level+1 === src.level) {
          //assign desNode as parent of the srcNode.
          let temp = [...userData];
          let srcParent = getParent.current[srcNode.id];
          srcParent.child = srcParent.child.filter(c => c!==srcNode);
          desNode.child.splice(0,0,srcNode);
          getParent.current[srcNode.id] = desNode;
          setUserData(temp);
        }else {
          alert("Invalid drag.");
        }
    }
}


function createURIDownload(MIME, data, filename) {
  const a = document.createElement('a');
  a.setAttribute('href', 'data:' + MIME + '; encoding:utf-8,' + encodeURIComponent(data));
  a.setAttribute('download', filename);

  a.style.display = 'none';
  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);
}


export const saveData = (rootNode) => {
  createURIDownload('text/plain', JSON.stringify(rootNode, null, 4), "file.txt");
}

function setAllNodes(root, st, tempArray,parentObj,parent) {
  //check if each obj has id,title and child array.
  if(!root || typeof root !== 'object' || root['id']===undefined 
  || root['title']===undefined || root['child']===undefined || !(Array.isArray(root.child)) || st.has(root['id'])) {
    return false;
  }
  //console.log(root['id'], st.has(root['id']));
  st.add(root['id']);
  parentObj[root['id']]=parent;
  tempArray.push(root);
  for(let i=0;i<root.child.length;i++) {
    if(!setAllNodes(root.child[i], st, tempArray,parentObj,root)) {
      return false;
    }
  }
  return true;
}

export const handleLoad = async (file, setLoad, setUserData, setRootNode,getParent) => {
  try {
    setLoad(true);
    let text = await file.text();
    text = JSON.parse(text);
    //console.log(text);

    //id should be unique for each node.
    //each child be should be an object.
    //each obj should have id,title and child
    const st = new Set(); // for unique id.
    let temp = []; //act as dummy for userData.
    let parent = {}
    if(typeof text === 'object' && text !== null && setAllNodes(text,st,temp, parent, null)) {
      setUserData(temp);
      setRootNode(text);
      getParent.current = parent;
      //setUserData
      //setRootNode
    }else {
      alert("Please check file, each id should be unique, each object should have id, title and child field. child field must be an array of objects.")
    }
    setLoad(false);
  } catch (error) {
    alert(error.message);
    setLoad(false);
  }
}