# CurriculumComposer

## Overview

This tool is designed to assist teachers in authoring curriculum for a subject. It employs a tree data structure and utilizes the depth-first search (DFS) tree traversal algorithm to create and manage the curriculum structure. Here are the key features:

## Features

- **Tree Data Structure**: The curriculum is organized as a tree, allowing for a hierarchical representation of topics and subtopics.

- **DFS Tree Traversal**: The tool uses a depth-first search (DFS) tree traversal algorithm to navigate and manipulate the curriculum structure efficiently.

- **Move Action**: You can easily rearrange nodes in the curriculum by using the following methods:
    - Drag and Drop: Nodes can be moved by dragging and dropping them to a new location within the tree structure.
    - Up and Down Arrow: Nodes can be moved up or down within the same level of the hierarchy.

- **Indent and Outdent**: To assign parent-child relationships between nodes, you can use the following actions:
    - Indent: This action assigns the selected node as a child of the node above it, creating a hierarchical relationship.
    - Outdent: This action moves the selected node out of its current parent, making it a sibling of the previous parent.

- **Load/Save Functionality**: The tool provides two essential functions to manage curriculum data:
    - Save: Save the curriculum structure created by the user to a JSON file. This allows you to preserve and export your curriculum for future use or sharing.
    - Load: Load a previously saved JSON file to recreate the curriculum structure in the tool's user interface. This functionality is similar to the save/load feature found in many games.
