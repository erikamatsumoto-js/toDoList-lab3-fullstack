import { useEffect, useState } from "react";

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
  }

  return (
    <div className="addTask">
      <label>
        Title
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
      </label>

      <label>
        Description
        <input
          type="text"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
      </label>

      <label>
        Category
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(Number(e.target.value))}
        >
          <option value="">Select category</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </label>

      <label>
        Priority
        <select
          onChange={(e) => setNewPriority(e.target.value)}
          value={newPriority}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </label>

      <label>
        Due Date
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
        />
      </label>

      <button onClick={handleAddTask}>+ Add new task</button>
    </div>
  );
}

export default AddTask;
