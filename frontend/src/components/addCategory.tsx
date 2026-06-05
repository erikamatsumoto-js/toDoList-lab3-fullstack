import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

interface AddCategoryProps {
  onCategoryAdded: () => void;
}

function AddCategory({ onCategoryAdded }: AddCategoryProps) {
  const [newTitle, setNewTitle] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function handleAddCategory() {
    if (newTitle.trim() === "") return;

    await fetch("http://localhost:3000/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTitle,
      }),
    });

    setNewTitle("");

    onCategoryAdded();
    setShow(false);
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        + Add new category
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add new category</Modal.Title>
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
          <Button variant="primary" onClick={handleAddCategory}>
            Add new category
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddCategory;
