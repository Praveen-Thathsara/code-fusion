import { BASE_GENRE_URL } from "./URL.js";

window.addEventListener("DOMContentLoaded", () => {
  setGenreList();

  const saveAddGenreBtn = document.getElementById("saveAddGenreBtn");
  if (saveAddGenreBtn) {
    saveAddGenreBtn.addEventListener("click", () => {
      let genreName = document.getElementById("genreNameInput").value;
      addGenre(genreName);
    });
  } else {
    console.error("Save Add Genre button not found!");
  }
});

const setGenreList = async () => {
  let genres = [];
  try {
    const response = await fetch(BASE_GENRE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    genres = await response.json();
    const genreList = document.getElementById("genreList");
    genreList.innerHTML = "";

    genres.data.forEach((genre) => {
      let genreRow = document.createElement("tr");
      genreRow.innerHTML = `
                <td>${genre.id}</td>
                <td>${genre.name}</td>
                <td>
                    <button class="btn btn-danger delete-genre-btn" data-id="${genre.id}">Delete</button>
                </td>
            `;
      genreList.appendChild(genreRow);
    });

    const deleteGenreBtns = document.querySelectorAll(".delete-genre-btn");
    deleteGenreBtns.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const genreId = btn.getAttribute("data-id");
        await deleteGenre(genreId);
      });
    });
  } catch (error) {
    console.error(error);
  }
};

const addGenre = async (genreName) => {
  try {
    const response = await fetch(BASE_GENRE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ name: genreName }),
    });
    if (response.ok) {
      setGenreList();
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteGenre = async (id) => {
  try {
    const isConfirmed = confirm("Are you sure you want to delete this genre?");
    if (!isConfirmed) return;

    const response = await fetch(`${BASE_GENRE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (response.ok) {
      alert("Genre deleted successfully");
      setGenreList();
    } else {
      const errorMessage = await response.text();
      console.error(
        `Error deleting genre (status ${response.status}):`,
        errorMessage
      );
      alert("Failed to delete genre. Check console for more details.");
    }
  } catch (error) {
    console.error("Error during genre deletion:", error);
    alert("An error occurred. Check console for more details.");
  }
};
