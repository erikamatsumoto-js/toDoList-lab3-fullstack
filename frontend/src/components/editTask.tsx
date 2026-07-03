import { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";

interface EditTaskProps {
  taskId: number;
  onTaskEdited: () => void;
}

interface Category {
  id: number;
  title: string;
  user_id: number;
  created_at: number;
  color: string;
}

function EditTask({ taskId, onTaskEdited }: EditTaskProps) {
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState<number | "">("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDueDate, setNewDueDate] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = async () => {
    setShow(true);
    await fetchCurrentTask();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCurrentTask() {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`);
      if (response.ok) {
        const task = await response.json();

        setCurrentTitle(task.title || "");
        setCurrentDescription(task.description || "");

        setNewTitle("");
        setNewDescription("");

        setNewCategory(
          task.category_id !== null ? Number(task.category_id) : "",
        );
        setNewPriority(task.priority || "Medium");
        setNewDueDate(task.due_date || "");
      }
    } catch (error) {
      console.error("Failed to fetch current task:", error);
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch("http://localhost:3000/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }

  async function handleEditTask() {
    const titleToSend = newTitle.trim() !== "" ? newTitle : currentTitle;
    if (!titleToSend.trim()) return;

    const descriptionToSend =
      newDescription.trim() !== "" ? newDescription : currentDescription;

    await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: titleToSend,
        description: descriptionToSend,
        priority: newPriority,
        status: "pending",
        due_date: newDueDate,
        category_id: newCategory === "" ? null : Number(newCategory),
      }),
    });

    onTaskEdited();
    setShow(false);
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        <i className="bi bi-pencil"></i>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group className="mb-3" controlId="editTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder={currentTitle}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder={currentDescription}
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select
                title="Category"
                value={newCategory} // category innan ändring
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

            <Form.Group className="mb-3" controlId="editPriority">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                title="Priority"
                value={newPriority} // priority innan ändring
                onChange={(e) => setNewPriority(e.target.value)}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="editDueDate">
              <Form.Label>Due date</Form.Label>
              <Form.Control
                type="date"
                value={newDueDate} // datum innan ändring
                onChange={(e) => setNewDueDate(e.target.value)}
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
