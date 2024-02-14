import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TodoContract", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployTodo() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const TodoContract = await ethers.getContractFactory("TodoContract");
    const todoContract = await TodoContract.deploy();

    return { todoContract, owner, otherAccount };
  }

  describe("TodoContract", () => {
    it("Should be able to add a todo", async () => {
      const { todoContract } = await loadFixture(deployTodo);

      const todoToBeCreated = {
        title: "Wash Cloth",
        description: "Wash the cloth in the washing machine",
      };

      await todoContract.createTodo(
        todoToBeCreated.title,
        todoToBeCreated.description
      );

      const todoItemCreated = await todoContract.getTodo(0);

      expect(todoItemCreated[1]).to.equal(todoToBeCreated.title);
    });

    it("Should be able to get a todo", async () => {
      const { todoContract } = await loadFixture(deployTodo);

      const todoObject = {
        title: "Wash Cloth",
        description: "Wash the cloth in the washing machine",
      };

      await todoContract.createTodo(todoObject.title, todoObject.description);

      const todoItem = await todoContract.getTodo(0);

      expect(todoItem[1]).to.not.equal("");
    });

    it("Should throw error this todo item does not exist ", async () => {
      const { todoContract } = await loadFixture(deployTodo);

      await expect(todoContract.getTodo(0)).to.be.revertedWith(
        "Todo does not exist"
      );
    });

    it("Should be able to mark a todo as done", async () => {
      const { todoContract } = await loadFixture(deployTodo);

      const todoObject = {
        title: "Wash Cloth",
        description: "Wash the cloth in the washing machine",
      };

      await todoContract.createTodo(todoObject.title, todoObject.description);

      await todoContract.updateTodoStatus(0);

      const todoItem = await todoContract.getTodo(0);

      expect(todoItem[3]).to.equal(true);
    });


    it("Should be able to delete a todo", async () => {
      const { todoContract } = await loadFixture(deployTodo);

      const todoObject = {
        title: "Wash Cloth",
        description: "Wash the cloth in the washing machine",
      };

      await todoContract.createTodo(todoObject.title, todoObject.description);

      await todoContract.deleteTodo(0);

      await expect(todoContract.getTodo(0)).to.be.revertedWith(
        "Todo does not exist"
      );
    });
   
    it("Should be able to delete a todo", async () => {
      const { todoContract } = await loadFixture(deployTodo);

      const todoObject = {
        title: "Wash Cloth",
        description: "Wash the cloth in the washing machine",
      };
      const todoObject2 = {
        title: "Pick Cloth",
        description: "Pick the cloth in the washing machine",
      };

      await todoContract.createTodo(todoObject.title, todoObject.description);
      await todoContract.createTodo(todoObject2.title, todoObject2.description);

      await todoContract.deleteTodo(0);

      const todoItem2 = await todoContract.getTodo(0);

      expect(todoItem2[1]).to.be.equals(todoObject2.title);
    });

    it("Should throw error this todo item does not exist while deleting ", async () => {
      const { todoContract } = await loadFixture(deployTodo);

      await expect(todoContract.deleteTodo(0)).to.be.revertedWith(
        "Todo does not exist"
      );
    });

    it("Should be able to get all todos", async () => {
      const { todoContract } = await loadFixture(deployTodo);

      const todoObject = {
        title: "Wash Cloth",
        description: "Wash the cloth in the washing machine",
      };
      const todoObject2 = {
        title: "Pick Cloth",
        description: "Pick the cloth in the washing machine",
      };

      await todoContract.createTodo(todoObject.title, todoObject.description);
      await todoContract.createTodo(todoObject2.title, todoObject2.description);

      const todoItems = await todoContract.getAllTodos();

      expect(todoItems.length).to.be.equals(2);
    });

    // it("Should be able to get all todos", async () => {
    //   const { todoContract } = await loadFixture(deployTodo);

    //   const todoObject = {
    //     title: "Wash Cloth",
    //     description: "Wash the cloth in the washing machine",
    //   };
    //   const todoObject2 = {
    //     title: "Pick Cloth",
    //     description: "Pick the cloth in the washing machine",
    //   };

    //   await todoContract.createTodo(todoObject.title, todoObject.description);
    //   await todoContract.createTodo(todoObject2.title, todoObject2.description);

    //   const todoItems = await todoContract.getAllTodos);

    //   expect(todoItems[0].title).to.be.equals(todoObject.title);
    //   expect(todoItems[1].title).to.be.equals(todoObject2.title);
    // });

    it("Should be able to get all todos and must equal todoItem length", async () => {
      const { todoContract } = await loadFixture(deployTodo);

      const todoObject = {
        title: "Wash Cloth",
        description: "Wash the  cloth in the washing machine",
      };
      const todoObject1 = {
        title: "Wash Cloth",
        description: "Wash the  cloth in the washing machine",
      };
      const todoObject2 = {
        title: "Wash Cloth",
        description: "Wash the  cloth in the washing machine",
      };

      await todoContract.createTodo(todoObject.title, todoObject.description);
      await todoContract.createTodo(todoObject1.title, todoObject1.description);
      await todoContract.createTodo(todoObject2.title, todoObject2.description);

      const todoItems = await todoContract.getAllTodos();
      const todoLength = await todoContract.getTodoLength();

      expect(todoItems.length).to.be.equals(todoLength);
    });

    // update title
    it("Should be able to update a todo title", async () => {
      const { todoContract } = await loadFixture(deployTodo);

      const todoObject = {
        title: "Wash Cloth",
        description: "Wash the cloth in the washing machine",
      };

      await todoContract.createTodo(todoObject.title, todoObject.description);

      const newTitle = "Pick Cloth";
      const newDescription = "I will Pick Cloth";

      await todoContract.updateTodo(0, newTitle, newDescription);

      const todoItem = await todoContract.getTodo(0);

      expect(todoItem[1]).to.equal(newTitle);
    });


  });
});