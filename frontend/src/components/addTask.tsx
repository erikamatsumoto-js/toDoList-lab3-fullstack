import { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";

interface AddTaskProps {
  onTaskAdded: () => void;
}

interface Category {
  id: number;
  title: string;
}

function AddTask({ onTaskAdded }: AddTaskProps) {
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

  async function handleAddTask() {
    if (newTitle.trim() === "") return;

    await fetch("http://localhost:3000/tasks", {
      method: "POST",
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

    onTaskAdded();
    setShow(false);
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        + Add new task
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add new task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="addTaskForm">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="addTaskForm">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter task description..."
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label htmlFor="category">Category</Form.Label>
              <Form.Select
                id="category"
                aria-label="Category"
                value={newCategory}
                onChange={(e) => setNewCategory(Number(e.target.value))}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="priority">
              <Form.Label htmlFor="priority">Priority</Form.Label>
              <Form.Select
                id="priority"
                aria-label="Priority"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="addTaskForm">
              <Form.Label>Due date</Form.Label>
              <Form.Control
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddTask}>
            Add new task
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddTask;
