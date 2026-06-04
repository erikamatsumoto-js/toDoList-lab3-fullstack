import React, { useState } from "react";

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
          <option value="lightblue" style={{ color: "rgb(201, 233, 253)" }}>
            ■ lightblue
          </option>
          <option value="lightgreen" style={{ color: "rgb(225,253,201)" }}>
            ■ lightgreen
          </option>
          <option value="lightpurple" style={{ color: "rgb(240, 201, 253)" }}>
            ■ lightpurple
          </option>
        </select>
      </label>

      <button onClick={handleAddCategory}>+ Add new Category</button>
    </div>
  );
}

export default AddCategory;
