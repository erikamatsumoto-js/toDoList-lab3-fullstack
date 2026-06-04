import { useState } from "react";

interface AddCategoryProps {
  onCategoryAdded: () => void;
}

function AddCategory({ onCategoryAdded }: AddCategoryProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setnewColor] = useState("");

  async function handleAddCategory() {
    if (newTitle.trim() === "") return;

    await fetch("http://localhost:3000/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTitle,
        color: newColor,
      }),
    });

    setNewTitle("");
    setnewColor("");

    onCategoryAdded();
  }

  return (
    <div className="addCategory">
      <label>
        Title
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
      </label>

      <label>
        Category
        <select value={newColor} onChange={(e) => setnewColor(e.target.value)}>
          <option value="lightblue">■ lightblue</option>
          <option value="lightgreen">■ lightgreen</option>
          <option value="lightpurple">■ lightpurple</option>
        </select>
      </label>

      <button onClick={handleAddCategory}>+ Add new Category</button>
    </div>
  );
}

export default AddCategory;
