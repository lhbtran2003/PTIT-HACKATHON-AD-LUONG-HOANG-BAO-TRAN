import React, { useState, useEffect } from "react";
import "./todolist.css";
import "react-bootstrap";
import {
  Col,
  Row,
  Container,
  InputGroup,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import { PencilSquare, SearchHeart, Trash3Fill } from "react-bootstrap-icons";
import { data as initData } from "./data";

type KindOfDelete = "ALL" | "DONE" | "";

export const TodoList = () => {
  const [data, setData] = useState(initData);
  const [isOpen, setIsOpen] = useState(false);
  const [actionDelete, setActionDelete] = useState<KindOfDelete>("");
  const [inputContent, setInputContent] = useState("");
  const [warning, setWarning] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("todoData");
    if (storedData) {
      setData(JSON.parse(storedData));
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("todoData", JSON.stringify(data));
    }
  }, [data, loaded]);

  const handleDeleteOne = (id: number) => {
      const newData = data.filter((task) => task.id !== id);
      setData(newData);
  };

  const handleDeleteOption = () => {
    if (actionDelete === "ALL") {
      setData([]);
    } else {
      const newData = data.filter((task) => !task.completed);
      setData(newData);
    }
    setIsOpen(false);
    setActionDelete("");
  };

  const handleChangeStatus = (id: number) => {
    const newData = data.map((task) => {
      if (task.id === id) {
        task.completed = !task.completed;
      }
      return task;
    });
    setData(newData);
  };

  const handleInputNewTask = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setInputContent(value);
    if (
      value === "" ||
      data.some((task) => task.name.toLowerCase() === value.toLowerCase())
    ) {
      setWarning("Nội dung không được để trống hoặc trùng");
    } else {
      setWarning("");
      //   setInputContent(value);
    }
    console.log(inputContent);
  };

  const handleSubmit = () => {
    const newTask = {
      id: data.length > 0 ? data[data.length - 1].id + 1 : 0,
      name: inputContent,
      completed: false,
    };
    setData([...data, newTask]);
    setInputContent("");
  };

  return (
    <>
      <Container className="outfit-uniquifier">
        <Row className="justify-content-center">
          <Col md={6}>
            <Row className="fs-2 d-flex justify-content-center border-bottom">
              TodoInput
            </Row>
            <Row className="mt-4 border-bottom">
              <InputGroup className="ps-0 pe-0">
                <InputGroup.Text>
                  <SearchHeart />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by customer name"
                  className="rounded-none h-8 border-none no-focus-outline"
                  name="name"
                  value={inputContent}
                  onChange={handleInputNewTask}
                />
              </InputGroup>
              <Row className="fs-6 text-danger">{warning}</Row>

              <Button
                className="mt-3 mb-4"
                onClick={handleSubmit}
                disabled={warning !== ""}
              >
                Add new task
              </Button>
            </Row>
            <Row className="fs-2 d-flex justify-content-center">TodoList</Row>

            {/* Render content here */}
            {data.map((task, index) => (
              <Row className="border pt-2 pb-2 mb-3" key={index}>
                <Col
                  md={5}
                  className={`d-flex justify-start ${
                    task.completed
                      ? "text-danger text-decoration-line-through"
                      : "text-black"
                  }`}
                >
                  {task.name}
                </Col>
                <Col className="d-flex justify-content-end">
                  <div className="d-flex justify-content-between align-items-center gap-2">
                    <Form.Check
                      type="checkbox"
                      className="mt-0"
                      checked={task.completed}
                      onChange={() => {
                        handleChangeStatus(task.id);
                      }}
                    />
                    <PencilSquare className="" />
                    <Trash3Fill onClick={() => handleDeleteOne(task.id)} />
                  </div>
                </Col>
              </Row>
            ))}
            <Row>
              <Col md={6} className="p-0">
                <Button
                  onClick={() => {
                    setIsOpen(true);
                    setActionDelete("DONE");
                  }}
                >
                  Delete done tasks
                </Button>
              </Col>
              <Col md={6} className="p-0">
                <Button
                  onClick={() => {
                    setIsOpen(true);
                    setActionDelete("ALL");
                  }}
                >
                  Delete all tasks
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Confirmation modal for delete all or delete what have done */}
      <Modal backdrop="static" show={isOpen}>
        <Modal.Header closeButton onClick={() => setIsOpen(false)}>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {actionDelete === "DONE"
            ? "Bạn có muốn xóa những task đã hoàn thành không?"
            : "Bạn có muốn xóa hết task không?"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDeleteOption}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
