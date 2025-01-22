import { BASE_MOVIE_URL } from "./URL.js";

let curPage = 1;
window.addEventListener("DOMContentLoaded", () => {
  loadSearchResults(curPage);

  document
    .getElementById("searchForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const searchValue = document.getElementById("searchTerm").value;
      if (searchValue) {
        window.location.href = `../client/search.html?search=${searchValue}`;
      }
    });

  document.getElementById("previousPage").addEventListener("click", () => {
    if (curPage > 1) {
      curPage--;
      loadSearchResults(curPage);
    }
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    curPage++;
    loadSearchResults(curPage);
  });
  document.getElementById("pageOne").addEventListener("click", async () => {
    curPage = 1;
    loadSearchResults(1);
  });

  document.getElementById("pageTwo").addEventListener("click", async () => {
    curPage = 2;
    loadSearchResults(2);
  });

  document.getElementById("pageThree").addEventListener("click", async () => {
    curPage = 3;
    loadSearchResults(3);
  });
});

const loadSearchResults = async (page) => {
  const pageSize = 3;
  const searchParams = new URLSearchParams(window.location.search);
  const searchTerm = searchParams.get("search");
  if (searchTerm) {
    const searchResults = await searchMovies(searchTerm, pageSize, page);
    if (searchResults.data.length == 0) {
      alert("No movies found");
    }
    renderSearchResults(searchResults);
  }
};

const searchMovies = async (searchTerm, pageSize, page) => {
  try {
    const response = await fetch(
      `${BASE_MOVIE_URL}/search/movies?keyword=${searchTerm}&pageSize=${pageSize}&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const renderSearchResults = (searchResults) => {
  let searchResultsDiv = document.getElementById("movieResults");
  searchResultsDiv.innerHTML = "";
  searchResults.data.forEach((movie) => {
    let movieCard = document.createElement("div");
    movieCard.className = "col-md-4";
    movieCard.innerHTML = `
        <div class="card card-bg" style="height: 520px;">
        <a href="../client/moviePage.html?id=${movie.id}">
        <img
          src="${movie.posterUrl}"
          class="card-img-top"
          alt="..."
          style="height: 380px;"
        />
        </a>
        <div class="card-body" style="color: whitesmoke;">
            <h5 class="card-title col_red">${movie.title}</h5>
            <div class="card-text d-flex" id="${movie.id}Genres"></div>
            <div class="card-text">${movie.year}</div>
            <div class="card-text">Daily Rental : ${movie.dailyRentalRate.toFixed(
              2
            )}</div>                    
          </div>
      </div>
        `;
    searchResultsDiv.appendChild(movieCard);
  });

  searchResults.data.forEach((movie) => {
    const genreContainer = document.getElementById(`${movie.id}Genres`);

    const genres = movie.genres;

    genres.forEach((genre) => {
      const genreElement = document.createElement("div");
      genreElement.textContent = genre;
      genreElement.classList.add("genre-tags");
      genreContainer.appendChild(genreElement);
    });
  });
};
