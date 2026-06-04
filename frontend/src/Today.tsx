import { useEffect, useState } from "react";
import { Form, Card, Col, Container } from "react-bootstrap";
import SideBar from "./components/sideBar";
import AddTask from "./components/addTask";

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

function Today() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchToday();
  }, []);

  async function fetchToday() {
    const response = await fetch("http://localhost:3000/today");
    const data = await response.json();
    console.log(data);
    setTasks(data);
  }

  return (
    <>
      <SideBar />
      <h1>Today</h1>
      <AddTask onTaskAdded={fetchToday} />
      <Container>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Col key={task.id}>
              <Card className="task-cards">
                <Card.Body>
                  <Form.Check type="checkbox" label="" />
                  <Card.Title>{task.priority}</Card.Title>
                  <Card.Title>{task.title}</Card.Title>
                  <Card.Text>{task.category_id}</Card.Text>
                  <Card.Text>Due: {task.due_date}</Card.Text>
                  <button>Edit</button>
                  <button>Delete</button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-muted mt-3">No tasks due today.</p>
        )}
      </Container>
    </>
  );
}

export default Today;
