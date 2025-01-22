import createStars from "./starRating.js";
import {
  BASE_FEEDBACK_URL,
  BASE_MOVIE_URL,
  BASE_RENTAL_URL,
  BASE_USER_URL,
} from "./URL.js";

let movieId = null;

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  movieId = urlParams.get("id");
  try {
    const movieResponse = await fetchMovie(movieId);
    const movie = movieResponse.data;

    showMovieDetails(movie);

    const lastRentalStatus = await fetchLastRentalStatus(movieId);
    updateRentalButtonStatus(lastRentalStatus.isLastRentalActive);

    const feedbackResponse = await fetchFeedback(movieId, "default");
    if (feedbackResponse.status === 404) {
      document.getElementById("feedback-container").textContent =
        feedbackResponse.message;
    } else {
      showFeedback(feedbackResponse.data);
    }

    sortFeedback();
  } catch (error) {
    console.error("Error:", error);
  }
});

async function fetchMovie(movieId) {
  try {
    const response = await fetch(`${BASE_MOVIE_URL}/${movieId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    return response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

function createGenreTags(genres) {
  const genreContainer = document.getElementById("genre-container");

  genres.forEach((genre) => {
    const genreElement = document.createElement("p");
    genreElement.textContent = genre;
    genreElement.classList.add("genre-tags");
    genreContainer.appendChild(genreElement);
  });
}

async function fetchLastRentalStatus(movieId) {
  try {
    let response = await fetch(`${BASE_RENTAL_URL}/status/${movieId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    return response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

function updateRentalButtonStatus(lastRentalStatus) {
  if (lastRentalStatus) {
    document.getElementById("rental-button").disabled = true;
    document.getElementById("rental-button").textContent = "Already Rented";
  }
}

function showMovieDetails(movie) {
  document.getElementById("movie-poster").src = movie.posterUrl;

  document.getElementById("movie-title").textContent = movie.title;

  document.getElementById("movie-year").textContent = movie.year;

  document.getElementById("movie-runtime").textContent = movie.runtime;

  createGenreTags(movie.genres);

  document.getElementById("imdb-rating").textContent = movie.imdbRating;

  createStars(movie.userRating, "star-rating-container");

  document.getElementById("movie-plot").textContent = movie.plot;

  document.getElementById("daily-rental").textContent = movie.dailyRentalRate;

  document.getElementById("directed-by").textContent = movie.directedBy;

  document.getElementById("starring").textContent = movie.starring;
}

async function fetchFeedback(movieId, sortMethod) {
  const baseFeedbackUrl = `${BASE_FEEDBACK_URL}/movie`;

  let requestUrl;
  let [option, order] = sortMethod.split("-");

  if (option && order) {
    requestUrl = `${baseFeedbackUrl}/sort/${movieId}?option=${option}&order=${order}`;
  } else {
    requestUrl = `${baseFeedbackUrl}/topBottom/${movieId}`;
  }

  try {
    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const responseJson = await response.json();

    if (response.status === 404) {
      return { status: 404, message: responseJson.message };
    }

    return responseJson;
  } catch (error) {
    console.error("Error:", error);
  }
}

function showFeedback(feedbacks) {
  const feedbackContainer = document.getElementById("feedback-container");
  feedbackContainer.innerHTML = "";

  feedbacks.forEach((feedback) => {
    const feedbackElement = ` <div class="feedback w-75">
    <div class="d-flex justify-content-start align-items-center mb-2">
      <p class="m-0">
        <span style="color: gray">Reviewed by</span> ${feedback.name} 
      </p>
      <div id="feedback-rating-container-${feedback.userId}" class=" ms-5">hi</div>
      <span style="color: gray" class="ms-5">${feedback.createdAt}</span>
    </div>
    <p class="mb-4">${feedback.comment}</p>
    <hr />
  </div>`;

    feedbackContainer.innerHTML += feedbackElement;
    createStars(
      feedback.rating,
      `feedback-rating-container-${feedback.userId}`
    );
  });
}

const rentalModal = document.getElementById("rentalModal");

rentalModal.addEventListener("show.bs.modal", (event) => {
  let moviePoster = document.getElementById("modal-movie-poster");
  let movieTitle = document.getElementById("modal-movie-title");
  let movieRental = document.getElementById("modal-rental-rate");
  let noOfDaysInput = document.getElementById("no-of-days-renting");
  let totalAmount = document.getElementById("total-amount");

  moviePoster.src = document.getElementById("movie-poster").src;
  movieTitle.textContent = document.getElementById("movie-title").textContent;
  movieRental.textContent = document.getElementById("daily-rental").textContent;

  function updateTotalAmount() {
    totalAmount.textContent = movieRental.textContent * noOfDaysInput.value;
  }

  updateTotalAmount();

  noOfDaysInput.addEventListener("input", () => {
    updateTotalAmount();
  });

  const confirmRentalButton = document.getElementById("confirm-rental");
  confirmRentalButton.addEventListener("click", async () => {
    try {
      const response = await fetch(`${BASE_RENTAL_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          movieId,
          daysRented: noOfDaysInput.value,
        }),
      });

      const responseJson = await response.json();

      if (response.status === 400) {
        alert(responseJson.message);
      } else {
        alert("Rental successful");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
});

function sortFeedback() {
  let sortSelect = document.getElementById("sort-feedback");

  sortSelect.addEventListener("change", async () => {
    const feedbackResponse = await fetchFeedback(movieId, sortSelect.value);
    if (feedbackResponse.status === 404) {
      document.getElementById("feedback-container").textContent =
        feedbackResponse.message;
    }
    showFeedback(feedbackResponse.data);
  });
}

async function fetchAllUsers() {
  try {
    const response = await fetch(`${BASE_USER_URL}/emails`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    return response.json();
  } catch (error) {
    console.log(error);
  }
}

const giftRentalModal = document.getElementById("giftRentalModal");

giftRentalModal.addEventListener("show.bs.modal", (event) => {
  let moviePosterGift = document.getElementById("gift-modal-movie-poster");
  let movieTitle = document.getElementById("gift-modal-movie-title");
  let movieRental = document.getElementById("gift-modal-rental-rate");
  let noOfDaysInput = document.getElementById("gift-no-of-days-renting");
  let totalAmount = document.getElementById("gift-total-amount");

  moviePosterGift.src = document.getElementById("movie-poster").src;
  movieTitle.textContent = document.getElementById("movie-title").textContent;
  movieRental.textContent = document.getElementById("daily-rental").textContent;

  function updateTotalAmount() {
    totalAmount.textContent = movieRental.textContent * noOfDaysInput.value;
  }

  updateTotalAmount();

  noOfDaysInput.addEventListener("input", () => {
    updateTotalAmount();
  });

  const dropdown = document.getElementById("receiver-email");

  let users = fetchAllUsers().then((result) => {
    let emails = result.data;

    emails = emails.filter((email) => email !== localStorage.getItem("email"));
    emails.forEach((email) => {
      let opt = document.createElement("option");
      opt.value = email;
      opt.innerHTML = email;
      dropdown.appendChild(opt);
    });
  });

  const confirmGiftButton = document.getElementById("confirm-gift");
  confirmGiftButton.addEventListener("click", async () => {
    try {
      await fetch(`${BASE_RENTAL_URL}/gift`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          movieId,
          daysRented: noOfDaysInput.value,
          receiverEmail: document.getElementById("receiver-email").value,
        }),
      });

      alert("Rental gifted successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  });
});
