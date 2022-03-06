import React, { useEffect, useState, useCallback } from "react";
import { Tabs, Layout, Row, Col, Input, message } from "antd";
import "./TodoList.css";
import TodoTab from "./TodoTab";
import TodoForm from "./TodoForm";
import {
  createTodo,
  deleteTodo,
  loadTodos,
  updateTodo,
} from "../services/todoService";
const { tabPane } = Tabs;
const { Content } = Layout;

const TodoList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [todos, setTodos] = useState([]);
  const [activeTodos, setActiveTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);

  const handleFormSubmit = (todo) => {
    console.log("Todo to create", todo);
    createTodo(todo).then(onRefresh());
    message.success("Todo added");
  };

  const handleRemoveTodo = (todo) => {
    deleteTodo(todo.id).then(onRefresh());
    message.warn("Todo removed");
  };

  const handleToggleTodoStatus = (todo) => {
    todo.completed = !todo.completed;
    updateTodo(todo).then(onRefresh());
    message.info("Todo status updated");
  };

  const refresh = () => {
    loadTodos()
      .then((json) => {
        setTodos(json);
        setActiveTodos(json.filter((todo) => todo.completed === false));
        setCompletedTodos(json.filter((todo) => todo.completed === true));
      })
      .then(console.log("fetch completed"));
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    let data = await loadTodos;
    setTodos(data);
    setActiveTodos(data.fliter((todo) => todo.completed === false));
    setCompletedTodos(data.filter((todo) => todo.completed === true));
    setRefreshing(false);
    console.log("Refresh state", refreshing);
  }, [refreshing]);

  useEffect(() => {
    refresh();
  }, [onRefresh]);
};

export default TodoList;
