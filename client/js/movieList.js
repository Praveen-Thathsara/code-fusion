import { BASE_MOVIE_URL } from "./URL.js";
let i = 1;
let curPage = 1;
const token = localStorage.getItem("token");
window.addEventListener("DOMContentLoaded", () => {
  setMovieList(1, 4);
  document.getElementById("previousPage").addEventListener("click", () => {
    if (curPage > 1) {
      curPage--;
      setMovieList(curPage, 4);
    }
  });
  document.getElementById("nextPage").addEventListener("click", () => {
    curPage++;
    setMovieList(curPage, 4);
  });
  document.getElementById("pageOne").addEventListener("click", () => {
    curPage = 1;
    i = 1;
    setMovieList(1, 4);
  });
  document.getElementById("pageTwo").addEventListener("click", () => {
    curPage = 2;
    i = 5;
    setMovieList(2, 4);
  });
  document.getElementById("pageThree").addEventListener("click", () => {
    curPage = 3;
    i = 9;
    setMovieList(3, 4);
  });
});

const setMovieList = async (page, limit) => {
  let movies = [];
  let index = 1;
  try {
    const response = await fetch(
      `${BASE_MOVIE_URL}/pagination/?pageSize=${limit}&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    movies = await response.json();
    let movieList = document.getElementById("movieList");
    movieList.innerHTML = "";

    movies.data.forEach((movie, idx) => {
      let releaseDate = new Date(movie.releaseAt);
      let movieRow = document.createElement("tr");
      movieRow.innerHTML = `
            <td><div style="width:100px">${index}</div></td>
            <td><div style="width:200px">${movie.title}</div></td>
            <td>${movie.year}</td>
            <td><div style="width:100px">${movie.dailyRentalRate}</div></td>
            <td>${movie.genres}</td>
            <td>${movie.imdbRating}</td>
            <td>${movie.userRating}</td>
            <td><div style="width:400px">${movie.plot}</div></td>
            <td>${movie.runtime}</td>
            <td>${movie.directedBy}</td>
            <td><div style="width:300px">${movie.starring}</div></td>
            <td><div style="width:200px">${releaseDate.toLocaleString()}</div></td>
            <td>
              <button id="editBtn${index}" class="btn btn-secondary">Edit</button>
            </td>
            <td>
              <button id="deleteBtn${index}" class="btn btn-danger">Delete</button>
            </td>
            `;
      movieRow.className = "movie-row";
      movieList.appendChild(movieRow);

      document
        .getElementById(`editBtn${index}`)
        .addEventListener("click", () => {
          openEditForm(movie);
        });

      document
        .getElementById(`deleteBtn${index}`)
        .addEventListener("click", () => {
          deleteMovie(movie.id);
        });

      index++;
    });
  } catch (error) {
    console.error(error);
  }
};

const deleteMovie = async (id) => {
  try {
    const isConfirmed = confirm("Are you sure you want to delete this movie?");
    if (!isConfirmed) {
      return;
    }

    console.log("Attempting to delete movie with ID:", id);

    const response = await fetch(`${BASE_MOVIE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (response.ok) {
      alert("Movie deleted successfully");
      console.log("Deletion successful:", await response.json());
    } else {
      const errorMessage = await response.text();
      console.error(
        `Error deleting movie (status ${response.status}):`,
        errorMessage
      );
      alert("Failed to delete movie. Check console for more details.");
    }
  } catch (error) {
    console.error("Error during movie deletion:", error);
    alert("An error occurred. Check console for more details.");
  }
};

const openEditForm = (movie) => {
  const modal = new bootstrap.Modal(document.getElementById("editMovieModal"));
  modal.show();
  document.getElementById("editMovieTitle").value = movie.title;
  document.getElementById("editMovieYear").value = movie.year;
  document.getElementById("editPlot").value = movie.plot;
  //document.getElementById("editGenres").value = movie.genres;
  document.getElementById("editRuntime").value = movie.runtime;
  document.getElementById("editDirectedBy").value = movie.directedBy;
  document.getElementById("editStarring").value = movie.starring;
  document.getElementById("editRentalRate").value = movie.dailyRentalRate;
  document.getElementById("editReleasedDate").value = movie.releaseAt;
  document.getElementById("editImdbRating").value = movie.imdbRating;
  //document.getElementById("editUserRating").value = movie.userRating;
  document.getElementById("editDiscountRate").value = movie.discountRate;
  document.getElementById("editPosterURL").value = movie.posterUrl;
  document.getElementById("editBannerURL").value = movie.bannerUrl;

  document.getElementById("saveEditBtn").onclick = () => updateMovie(movie.id);
};

const updateMovie = async (id) => {
  const updatedMovie = {
    title: document.getElementById("editMovieTitle").value,
    year: document.getElementById("editMovieYear").value,
    plot: document.getElementById("editPlot").value,
    //genres: document.getElementById("editGenres").value.split(','),
    runtime: document.getElementById("editRuntime").value,
    directedBy: document.getElementById("editDirectedBy").value,
    starring: document.getElementById("editStarring").value,
    dailyRentalRate: document.getElementById("editRentalRate").value,
    releaseAt: document.getElementById("editReleasedDate").value,
    discountRate: document.getElementById("editDiscountRate").value,
    posterUrl: document.getElementById("editPosterURL").value,
    bannerUrl: document.getElementById("editBannerURL").value,
    imdbRating: document.getElementById("editImdbRating").value,
    //userRating: document.getElementById("editUserRating").value,
  };

  try {
    console.log("Updating movie with ID:", id);
    console.log(`${BASE_MOVIE_URL}/${id}`);

    const response = await fetch(`${BASE_MOVIE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(updatedMovie),
    });

    console.log("console===========>", response);
    // Enhanced Error Handling for various scenarios
    if (!response.ok) {
      let errorMessage = `Failed to update movie. Status: ${response} - `;

      // Handling common HTTP status codes with more granular feedback
      switch (response.status) {
        case 400:
          errorMessage +=
            "Bad Request. The data you entered might be incorrect.";
          break;
        case 401:
          errorMessage += "Unauthorized. Please log in again.";
          break;
        case 403:
          errorMessage +=
            "Forbidden. You don’t have the necessary permissions.";
          break;
        case 404:
          errorMessage += "Movie not found. It might have been deleted.";
          break;
        case 500:
          errorMessage +=
            "Internal Server Error. Something went wrong on the server.";
          break;
        default:
          errorMessage += "An unexpected error occurred.";
          break;
      }

      // Log full error response to console for further investigation
      const responseText = await response.text();
      console.error(`Error updating movie: ${responseText}`);

      // Show detailed error message to the user
      alert(`${errorMessage}\nServer response: ${responseText}`);
    } else {
      // If the response is successful
      //alert("Movie updated successfully!");
      setMovieList(curPage, 4); // Reload the current movie list
      $("#editMovieModal").modal("hide"); // Hide the modal
    }
  } catch (error) {
    // Handle unexpected network or code errors
    console.error("Error during movie update:", error);

    // Handling network-related issues separately
    if (error.name === "TypeError") {
      alert("Network error. Please check your internet connection.");
    } else if (error.name === "SyntaxError") {
      alert("Unexpected response from the server. Please try again later.");
    } else if (error.name === "AbortError") {
      alert("Request was aborted. Please try again.");
    } else {
      alert(`An unexpected error occurred: ${error.message}`);
    }

    // Optional: Retry mechanism (only retry for network errors)
    const shouldRetry = confirm(
      "An error occurred while updating the movie. Would you like to retry?"
    );
    if (shouldRetry) {
      updateMovie(id); // Retry the update if user agrees
    }
  }
};
