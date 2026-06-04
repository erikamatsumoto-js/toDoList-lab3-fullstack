import { useEffect, useState } from "react";
import { Card, Col, Container, Form } from "react-bootstrap";
import AddTask from "./components/addTask";
import SideBar from "./components/sideBar";

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

  async function handleUpdateTask(id: number) {
    await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "completed",
      }),
    });

    fetchTasks();
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

  return (
    <>
      <SideBar />
      <h1>Tasks</h1>

      <AddTask onTaskAdded={fetchTasks} />

      <Container>
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
          <Col key={task.id}>
            <Card className="task-cards">
              <Card.Body>
                <Form.Check type="checkbox" label="" />
                <Card.Title>{task.priority}</Card.Title>
                <Card.Title>{task.title}</Card.Title>
                <Card.Text>{task.description}</Card.Text>
                <Card.Text>Due:{task.due_date}</Card.Text>

                <div className="d-flex gap-1">
                  <button onClick={() => handleUpdateTask(task.id)}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteTask(task.id)}>
                    Delete
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Container>
    </>
  );
}

export default Tasks;
