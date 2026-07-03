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
  const [newStatus, setNewStatus] = useState("to do");
  const [newPriority, setNewPriority] = useState("High");
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
        status: newStatus,
        due_date: newDueDate,
        category_id: Number(newCategory),
      }),
    });

    setNewTitle("");
    setNewDescription("");
    setNewCategory("");
    setNewStatus("to do");
    setNewPriority("Medium");
    setNewDueDate("");

    onTaskAdded();
    setShow(false);
  }

  return (
    <>
      <div className="d-grid gap-2">
        <Button variant="primary" size="lg" onClick={handleShow}>
          + Add new task
        </Button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add new task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="addTitle">Title</Form.Label>
              <Form.Control
                id="addTitle"
                aria-label="Title"
                type="text"
                placeholder="Enter task title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="addDescription">Description</Form.Label>
              <Form.Control
                id="addDescription"
                aria-label="Description"
                as="textarea"
                placeholder="Enter task description..."
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              {" "}
              <Form.Label htmlFor="taskCategory">Category</Form.Label>{" "}
              <Form.Select
                id="taskCategory"
                aria-label="Category"
                title="Category"
                value={newCategory}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewCategory(val === "" ? "" : Number(val));
                }}
              >
                <option value="">Select a category...</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              {" "}
              <Form.Label htmlFor="taskPriority">Priority</Form.Label>{" "}
              <Form.Select
                id="taskPriority"
                aria-label="Priority"
                title="Priority"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="addDueDate">Due date</Form.Label>
              <Form.Control
                id="addDueDate"
                aria-label="DueDate"
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
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
