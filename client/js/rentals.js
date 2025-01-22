import createStars from "./starRating.js";
import { BASE_FEEDBACK_URL, BASE_RENTAL_URL } from "./URL.js";

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
let numTimes;
let rating = 0;

window.addEventListener("DOMContentLoaded", () => {
  createCodeBlockMoviecard();
});

const createCodeBlockMoviecard = async () => {
  let tagNames = [];
  let rating = 0;
  try {
    const rentals = await getRentals();
    numTimes = rentals.data.length;
    for (let i = 0; i < numTimes; i++) {
      tagNames.push(rentals.data[i].rental.id);
    }

    const container = document.getElementById("cardContainer");

    for (let i = 0; i < numTimes; i++) {
      const newDiv = document.createElement("div");

      newDiv.className = "card mb-3 card-bg";

      const codeBlock = `
  <div class="row h-100 position-relative">
    <div class="col-md-4">
      <img src="img/18.jpg" class="img-fluid rounded-start card-img" alt="movie poster" id="${tagNames[i]}Img">
    </div>
    <div class="col-md-8">
      <div class="card-body" style="color: whitesmoke;">
        <a href="moviePage.html?id=${rentals.data[i].movie.id}" class="title">
          <h5 class="card-title col_red" id="${tagNames[i]}Title" style="margin-bottom:20px;">The Shawshank Redemption</h5>
        </a>
        <p class="card-text" id="${tagNames[i]}Year">1994</p>
        <p class="card-text" id="${tagNames[i]}Runtime">2h 22m</p>
        <p class="card-text d-flex" id="${tagNames[i]}Genres"></p>
        <div id="${tagNames[i]}Stars"></div>
        <p class="card-text">
          <img src="./assets/imdbLogo.png" style="height: 40px;">
          <span id="${tagNames[i]}Imdb"></span>/10
        </p>
        <p class="card-text" id="${tagNames[i]}RentedOn">Rented on: 12/12/2020</p>
        <p class="card-text" id="${tagNames[i]}ExpiredOn">Expires on: 12/12/2021</p>
        <p class="card-text" id="${tagNames[i]}DailyRental">Price: $3.99</p>
        <p class="badge expired-badge" id="${tagNames[i]}ExpiredLabel" style="display: none;">Expired</p>
        <Button class="btn btn-primary" id="${tagNames[i]}Btn" style="background-color: #ff625a; border: 0;" color:#fff">Add Feedback</Button>
      </div>  
    </div>
  </div> `;

      newDiv.innerHTML = codeBlock;

      container.appendChild(newDiv);
      let rentedAt = rentals.data[i].rental.rentedAt;
      let daysRented = rentals.data[i].rental.daysRented;
      let rentedDate = new Date(rentedAt);
      let expiredDate = new Date(rentedAt);
      expiredDate.setDate(rentedDate.getDate() + daysRented);

      document.getElementById(`${tagNames[i]}Img`).src =
        rentals.data[i].movie.posterUrl;
      document.getElementById(`${tagNames[i]}Title`).innerHTML =
        rentals.data[i].movie.title;
      document.getElementById(`${tagNames[i]}Year`).innerHTML =
        rentals.data[i].movie.year;
      document.getElementById(`${tagNames[i]}Runtime`).innerHTML =
        rentals.data[i].movie.runtime;
      document.getElementById(`${tagNames[i]}Imdb`).innerHTML =
        rentals.data[i].movie.imdbRating;
      document.getElementById(
        `${tagNames[i]}RentedOn`
      ).innerHTML = `Rented on: ${rentedDate.toDateString()}`;
      document.getElementById(
        `${tagNames[i]}ExpiredOn`
      ).innerHTML = `Expires on: ${expiredDate.toDateString()}`;
      document.getElementById(
        `${tagNames[i]}DailyRental`
      ).innerHTML = `Price: ${rentals.data[i].rental.rentalFee.toFixed(2)}`;

      const genreContainer = document.getElementById(`${tagNames[i]}Genres`);

      const genres = rentals.data[i].movie.genres;

      genres.forEach((genre) => {
        const genreElement = document.createElement("div");
        genreElement.textContent = genre;
        genreElement.classList.add("genre-tags");
        genreContainer.appendChild(genreElement);
      });

      rating = rentals.data[i].movie.userRating;
      createStars(rating, tagNames[i] + "Stars");

      const currentDate = new Date();
      if (currentDate > expiredDate) {
        document.getElementById(`${tagNames[i]}ExpiredLabel`).style.display =
          "block";
      }

      document
        .getElementById(`${tagNames[i]}Btn`)
        .addEventListener("click", () => {
          addFeedback(rentals.data[i].movie.id);
        });
    }
  } catch (error) {
    console.error(error);
  }
};

const getRentals = async () => {
  let rentals;
  try {
    const response = await fetch(`${BASE_RENTAL_URL}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    rentals = await response.json();

    return rentals;
  } catch (error) {
    console.error(error);
  }
};

async function addFeedback(movieId) {
  const options = {
    backdrop: true,
    keyboard: false,
  };
  const feedbackModal = new bootstrap.Modal("#addFeedbackModal", options);
  feedbackModal.show();

  let stars = document.querySelectorAll(".star");
  stars.forEach(function (star) {
    star.addEventListener("click", setRating);
  });
  document.getElementById("saveFeedback").addEventListener("click", () => {
    let comment = document.getElementById("feedbackComment").value;
    sendFeedback(movieId, comment);
    feedbackModal.hide();
  });
}

async function sendFeedback(movieId, comment) {
  try {
    const ratingData = {
      userId: userId,
      movieId: movieId,
      rating: rating,
      comment: comment,
    };
    const response = await fetch(BASE_FEEDBACK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ratingData),
    });
    await response.json();
  } catch (error) {
    console.error(error);
  }
}

function setRating(ev) {
  ev.preventDefault();
  let span = ev.currentTarget;
  let stars = document.querySelectorAll(".star");
  let match = false;
  let num = 0;
  stars.forEach(function (star) {
    if (match) {
      star.textContent = "☆";
      star.style.color = "white";
    } else {
      star.textContent = "★";
      star.style.color = "gold";
    }

    if (star === span) {
      match = true;
      num = star.id;
    }
  });
  rating = num;
}
