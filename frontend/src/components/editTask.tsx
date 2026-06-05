import { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";

interface AddTaskProps {
  onTaskEdited: () => void;
}

interface Category {
  id: number;
  title: string;
}

function EditTask({ onTaskEdited }: AddTaskProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState<number | "">("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const response = await fetch("http://localhost:3000/categories");
    const data = await response.json();
    setCategories(data);
  }

  async function handleEditTask() {
    if (newTitle.trim() === "") return;

    await fetch("http://localhost:3000/tasks", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
        priority: newPriority,
        status: "pending",
        due_date: newDueDate,
        category_id: Number(newCategory),
      }),
    });

    setNewTitle("");
    setNewDescription("");
    setNewCategory("");
    setNewPriority("Medium");
    setNewDueDate("");

    onTaskEdited();
    setShow(false);
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Edit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add new task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="addTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditTask}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditTask;
