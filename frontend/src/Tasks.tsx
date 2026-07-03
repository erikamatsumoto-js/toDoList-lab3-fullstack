import "./App.css";
import { useEffect, useState } from "react";
import { Card, Col, Row, Container, Form, Button } from "react-bootstrap";
import AddTask from "./components/addTask";

import EditTask from "./components/editTask";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  due_date: number;
  category_id: number;
  user_id: number;
  created_at: number;
}

interface Category {
  id: number;
  title: string;
  user_id: number;
  created_at: number;
  color: string;
}

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "All">(
    "All",
  );

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  async function fetchTasks() {
    const response = await fetch("http://localhost:3000/tasks");
    const data = await response.json();
    setTasks(data);
  }

  async function fetchCategories() {
    const response = await fetch("http://localhost:3000/categories");
    const data = await response.json();
    setCategories(data);
  }

  async function handleDeleteTask(id: number) {
    await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "DELETE",
    });

    fetchTasks();
  }

  const filteredTasks =
    selectedCategory === "All"
      ? tasks
      : tasks.filter((task) => task.category_id === selectedCategory);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High":
        return "🔴";
      case "Medium":
        return "🟠";
      case "Low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  return (
    <>
      <Container>
        <h1>Tasks</h1>
        <div className="pageContainer">
          <Row className="g-3">
            <AddTask onTaskAdded={fetchTasks} />

            <label className="priority-task-select">
              Category:
              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value === "All" ? "All" : Number(e.target.value),
                  )
                }
              >
                <option value="All">All</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </label>

            {filteredTasks.map((task) => (
              <Col xs={12} key={task.id}>
                <Card className="task-cards w-100">
                  <Card.Body>
                    <div className="d-flex align-items-center gap-3">
                      <Form.Check className="checkBox" />
                      <Card.Title className="mb-0">
                        {" "}
                        {getPriorityIcon(task.priority)}
                      </Card.Title>
                      <Card.Title className="mb-0">{task.title}</Card.Title>

                      <div className="d-flex gap-2 ms-auto">
                        <Card.Text>
                          <i className="bi bi-calendar"></i> {task.due_date}
                        </Card.Text>

                        <EditTask taskId={task.id} onTaskEdited={fetchTasks} />
                        <Button onClick={() => handleDeleteTask(task.id)}>
                          <i className="bi bi-trash3"></i>
                        </Button>
                      </div>
                    </div>

                    <div className="mt-2">
                      <Card.Text className="mb-0 text-muted">
                        {task.description}
                      </Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </>
  );
}

export default Tasks;
