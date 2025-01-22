import { BASE_GENRE_URL, BASE_MOVIE_URL } from "./URL.js";

window.addEventListener("DOMContentLoaded", () => {
  setGenreList();
  setSubmit();
});

var setGenreList = async () => {
  let genres;
  try {
    const response = await fetch(BASE_GENRE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    genres = await response.json();

    if (genres.data && Array.isArray(genres.data)) {
      let genreList = document.getElementById("genreCheckBoxes");

      genres.data.forEach((genre) => {
        let genreRow = document.createElement("div");
        genreRow.className = "form-check";
        genreRow.innerHTML = `
                <input class="form-check-input" type="checkbox" value="${genre.name}" id="flexCheck${genre.id}">
                <label class="form-check-label" for="flexCheck${genre.id}">
                  ${genre.name}
                </label>
                `;
        genreList.appendChild(genreRow);
      });
    } else {
      console.error("Invalid genre data format:", genres);
    }
  } catch (error) {
    console.error("Error fetching genres:", error);
  }
};

var setSubmit = async () => {
  document.getElementById("movieForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    let genres = [];
    let genreCheckBoxes = document.querySelectorAll(".form-check-input");
    genreCheckBoxes.forEach((genreCheckBox) => {
      if (genreCheckBox.checked) {
        genres.push(genreCheckBox.value);
      }
    });

    const movie = {
      title: document.getElementById("title")?.value || null,
      year: parseInt(document.getElementById("year")?.value) || null,
      dailyRentalRate:
        parseFloat(document.getElementById("dailyRentalRate")?.value) || null,
      discountRate:
        parseFloat(document.getElementById("discountRate")?.value) || null,
      genres: genres.length > 0 ? genres : null,
      imdbRating:
        parseFloat(document.getElementById("imdbRating")?.value) || null,
      posterUrl: document.getElementById("posterUrl")?.value || null,
      bannerUrl: document.getElementById("bannerUrl")?.value || null,
      plot: document.getElementById("plot")?.value.trim() || null,
      runtime: document.getElementById("runtime")?.value || null,
      directedBy: document.getElementById("directedBy")?.value || null,
      starring: document.getElementById("starring")?.value || null,
      releaseAt: document.getElementById("releaseAt")?.value || null,
    };

    try {
      const response = await fetch(BASE_MOVIE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(movie),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Server responded with error: ${response.status} - ${errorText}`
        );
        return;
      }

      const data = await response.json();
      console.log("Movie added successfully:", data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  });
};
