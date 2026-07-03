import "./App.css";
import { useEffect, useState } from "react";
import { Form, Card, Col, Row, Container, Button } from "react-bootstrap";
import AddTask from "./components/addTask";
import GrinEmoji from "./assets/GrinEmoji.gif";
import DailyJoke from "./components/joke";

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

  async function handleDeleteTask(id: number) {
    await fetch(`http://localhost:3000/today/${id}`, {
      method: "DELETE",
    });

    fetchToday();
  }
  const checkboxChecked = async (id: number, status: "todo" | "done") => {
    await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    fetchToday();
  };

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
        <h1>Today</h1>

        <div className="pageContainer">
          <section className="dailyJokeCard align-items-center">
            <img src={GrinEmoji} alt="Grin emoji" className="grinemoji" />
            <DailyJoke />
          </section>

          <Row className="g-3">
            <AddTask onTaskAdded={fetchToday} />

            {tasks.length > 0 ? (
              tasks.map((task) => (
                <Col xs={12} key={task.id}>
                  <Card className="task-cards w-100">
                    <Card.Body>
                      <div className="d-flex flex-column flex-md-row align-items-md-center gap-2 gap-md-3">
                        <Form.Check
                          className="checkBox"
                          checked={task.status === "done"}
                          onChange={() =>
                            checkboxChecked(
                              task.id,
                              task.status === "done" ? "todo" : "done",
                            )
                          }
                        />

                        <Card.Title className="mb-0">
                          {getPriorityIcon(task.priority)}
                        </Card.Title>

                        <Card.Title className="mb-0 text-break">
                          {task.title}
                        </Card.Title>

                        <div className="d-flex flex-wrap gap-2 ms-md-auto">
                          <Card.Text>
                            <i className="bi bi-calendar"></i> {task.due_date}
                          </Card.Text>

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
              ))
            ) : (
              <p className="text-muted mt-3">No tasks due today.</p>
            )}
          </Row>
        </div>
      </Container>
    </>
  );
}

export default Today;
