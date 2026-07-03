import "./App.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import AddCategory from "./components/addCategory";

interface Category {
  id: number;
  title: string;
  user_id: number;
  created_at: number;
  color: string;
}
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

function Category() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchTasks();
  }, []);

  async function fetchCategories() {
    const response = await fetch("http://localhost:3000/categories");
    const data = await response.json();
    setCategories(data);
  }

  async function fetchTasks() {
    const response = await fetch("http://localhost:3000/tasks");
    const data = await response.json();
    setTasks(data);
  }

  return (
    <>
      <div className="container">
        <h1>Categories</h1>
        <div className="pageContainer">
          <AddCategory onCategoryAdded={fetchCategories} />
          <Container>
            <Row xs={2} md={3} className="g-4">
              {categories.map((category) => (
                <Col key={category.id}>
                  <Card className="task-cards">
                    <Card.Body>
                      <Card.Title>{category.title}</Card.Title>
                      <Card.Text>
                        {
                          tasks.filter(
                            (task) => task.category_id === category.id,
                          ).length
                        }
                        {""} tasks
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
        <div className="d-flex justify-content-end">
          <Link to="/tasks" className="linkToTask">
            Go to Tasks <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
        <br />
        <p className="emojis">
          🧁🛒⛳️🎾⚽️🏄🎣🩳🎻🚢🎡✈️💻🧳🪚🏖💉🍻👙🎮💼🩰🎨🪂⛹️‍♀️☕️
        </p>
      </div>
    </>
  );
}

export default Category;
