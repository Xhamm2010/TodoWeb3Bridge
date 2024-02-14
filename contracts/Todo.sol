// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoContract {

    address todoOwner;

    struct TodoTask {
        uint256 id;
        string title;
        string description;
        bool isDone;
    }

    TodoTask[] public todos;

    event TodoCreated(uint256 todoId, string title, string description, bool isDone);
    event TodoUpdated(uint256 todoId, string title, string description);
    event TodoDeleted(uint256 todoId);

    modifier onlyOwner() {
        require(msg.sender == todoOwner, "Not the owner");
        _;
    }

    modifier todoExists(uint256 index) {
        require(index < todos.length, "Todo does not exist");
        _;
    }

    constructor() {
        todoOwner = msg.sender;
    }

    function createTodo(string memory _title, string memory _description) external onlyOwner {
        uint256 todoId = todos.length;
        TodoTask memory newTodo = TodoTask({
            id: todoId,
            title: _title,
            description: _description,
            isDone: false
        });
        todos.push(newTodo);
        emit TodoCreated(todoId, _title, _description, false);
    }  

    function getTodo(uint256 index) external view todoExists(index) returns (uint256, string memory, string memory, bool)  {
        TodoTask storage todoTask = todos[index];
        return (
            todoTask.id,
            todoTask.title,
            todoTask.description,
            todoTask.isDone
        );
    }

    function getAllTodos() external view onlyOwner returns (TodoTask[] memory) {
        return todos;
    }

    function getTodoLength() external view returns (uint256) {
        return todos.length;
    }

    function updateTodo(uint256 index, string memory _title, string memory _description) external onlyOwner {
        TodoTask storage todoTask = todos[index];
        todoTask.title = _title;
        todoTask.description = _description;
        emit TodoUpdated(index, _title, _description);
    }

    function updateTodoStatus(uint256 index) external todoExists(index) onlyOwner {
        TodoTask storage todoTask = todos[index];
        todoTask.isDone = !todoTask.isDone;
    }

    function deleteTodo(uint256 index) external onlyOwner todoExists(index) {
        todos[index] = todos[todos.length - 1];
        todos.pop();
        emit TodoDeleted(index);
    }
}

