import createStars from "./starRating.js";
import { BASE_MOVIE_URL } from "./URL.js";

const token = localStorage.getItem("token");
const starTotal = 5;
let numTimes;

window.addEventListener("DOMContentLoaded", () => {
  createCodeBlockTopThreeMovies();
  createCodeBlockLatestMovies();
  createCodeBlockSuggestMovies();
  createCodeBlockUpcomingMovies();
  createCodeBlockBestRevenuedMovies();

  document
    .getElementById("searchForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const searchValue = document.getElementById("searchTerm").value;
      if (searchValue) {
        window.location.href = `../client/search.html?search=${searchValue}`;
      }
    });
});

const createCodeBlockTopThreeMovies = async () => {
  try {
    const response = await fetch(`${BASE_MOVIE_URL}/top-three`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();

    let movies = data.data;
    let rating;

    const container = document.getElementById("carouselInner");

    movies.forEach((movie, i = 0) => {
      const newDiv = document.createElement("div");

      if (i === 0) {
        newDiv.className = "carousel-item active";
      } else {
        newDiv.className = "carousel-item";
      }

      const codeBlock = `
    <img src="${movie.bannerUrl}" class="d-block w-100" alt="...">
    <div class="carousel-caption d-block">
        <h1> ${movie.title}</h1>
        <h6 class="mt-3">
            <span>${movie.imdbRating} (Imdb) Year :${movie.year}</span><span id="${movie.id}TopStars"></span><br>
        </h6>
        <p class="mt-3" style="width:800px">${movie.plot}</p>
        <p class="mb-2"><span class="col_red me-1 fw-bold">Starring:</span> <span>${movie.starring}</span></p>
        <p class="mb-2 d-flex"><span class="col_red me-1 fw-bold">Genres: </span> <span class="d-flex" id="${movie.id}Genres"></span></p>
        <p><span class="col_red me-1 fw-bold">Runtime:</span><span>${movie.runtime}</span></p>
        <p><span class="col_red me-1 fw-bold">Directed By:</span><span>${movie.directedBy}</span></p>
    </div>
                               
    `;

      newDiv.innerHTML = codeBlock;

      container.appendChild(newDiv);

      rating = movie.userRating;

      const genreContainer = document.getElementById(`${movie.id}Genres`);

      const genres = movie.genres;

      genres.forEach((genre) => {
        const genreElement = document.createElement("div");
        genreElement.textContent = genre;
        genreElement.classList.add("genre-tags");
        genreContainer.appendChild(genreElement);
      });
      i++;
    });
  } catch (error) {
    console.error(error);
    const dummyBlock = `
        
    <div class="carousel-caption d-md-block">
        <h1 class="font_60" id="firstMovieTitle"> John Wick - Chapter 4</h1>
        <h6 class="mt-3">
            <span id="firstMovieImdb">4.5</span> (Imdb) Year : <span id="firstMovieYear"></span><br>
            <!-- <a class="bg_red p-2 pe-4 ps-4 ms-3 text-white d-inline-block" href="#">Action</a> -->

        </h6>
        <p class="mt-3" id="firstMoviePlot">Four waves of increasingly deadly alien attacks have left
            most
            of Earth in
            ruin.
            Cassie is on the run, desperately trying to save her younger brother.</p>
        <p class="mb-2"><span class="col_red me-1 fw-bold">Starring:</span> <span
                id="firstMovieStarring">Eget Nulla Semper Porta Dapibus Diam Ipsum</span></p>
        <p class="mb-2"><span class="col_red me-1 fw-bold">Genres:</span> <span
                id="firstMovieGenres">genres</span></p>
        <p><span class="col_red me-1 fw-bold">Runtime:</span><span id="firstMovieRuntime"></span></p>
        <!-- <h6 class="mt-4"><a class="button" href="#"><i class="fa fa-play-circle align-middle me-1"></i>
                Watch Trailer</a></h6> -->
    </div>
                               
    `;

    const container = document.getElementById("carouselInner");
    const newDiv = document.createElement("div");

    newDiv.className = "carousel-item active";

    newDiv.innerHTML = dummyBlock;

    container.appendChild(newDiv);
  }
};

const createCodeBlockLatestMovies = async () => {
  try {
    const response = await fetch(BASE_MOVIE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();
    console.log(data);
    let result = data.data.sort((d1, d2) =>
      d1.releaseAt < d2.releaseAt ? 1 : d1.releaseAt > d2.releaseAt ? -1 : 0
    );

    result = result.filter(
      (movie) => movie.releaseAt <= new Date().toISOString()
    );
    result = result.slice(0, 3);
    let rating;

    const container = document.getElementById("latestMoviesRow");

    result.forEach(async (movie) => {
      const codeBlock = `                
        <div class="trend_2im clearfix position-relative">
            <div class="trend_2im1 clearfix">
                        <a href="../client/moviePage.html?id=${movie.id}"><img src="${movie.bannerUrl}" class="w-100" style="height:250px; object-fit:cover" alt="img25"></a>
            </div>
        </div>
        <div class="trend_2ilast bg_grey mt-3 clearfix">
            <h5 class="col_red">${movie.title}</h5>
            <div class="mt-3 mb-3 d-flex" id="${movie.id}Genres"></div>
            <div id="${movie.id}Stars"></div>
        </div>
`;

      const newDiv = document.createElement("div");

      newDiv.className = "col-md-4 col-6 latestMovieItem";

      newDiv.innerHTML = codeBlock;

      container.appendChild(newDiv);

      rating = movie.userRating;
      createStars(rating, movie.id + "Stars");

      const genreContainer = document.getElementById(`${movie.id}Genres`);

      const genres = await movie.genres;

      genres.forEach((genre) => {
        const genreElement = document.createElement("div");
        genreElement.textContent = genre;
        genreElement.classList.add("genre-tags");
        genreContainer.appendChild(genreElement);
      });
    });
  } catch (error) {
    console.error(error);
    const codeBlock = `
                           
        <div class="trend_2im clearfix position-relative">
            <div class="trend_2im1 clearfix">
                <div class="grid">
                    <figure class="effect-jazz mb-0">
                        <a href="#"><img src="img/4.jpg" class="w-100" alt="img25"></a>
                    </figure>
                </div>
            </div>
        </div>
        <div class="trend_2ilast bg_grey pt-3 clearfix">
            <h5><a class="col_red" href="#">Semper</a></h5>
            <p class="mb-2">A father travels from Oklahoma to France to help his...</p>
            <span class="col_red">
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
            </span>

        </div>
   
`;

    numTimes = 3;

    const container = document.getElementById("latestMoviesRow");

    for (let i = 0; i < numTimes; i++) {
      const newDiv = document.createElement("div");

      newDiv.className = "col-md-4 col-6 latestMovieItem";

      newDiv.innerHTML = codeBlock;

      container.appendChild(newDiv);
    }
  }
};

const createCodeBlockSuggestMovies = async () => {
  try {
    const response = await fetch(`${BASE_MOVIE_URL}/suggestions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();
    let movies = data.data;
    movies = movies.slice(0, 3);
    let starPercentage, rating, starPercentageRounded;

    const container = document.getElementById("suggestedMoviesRow");

    movies.forEach(async (movie) => {
      const newDiv = document.createElement("div");

      newDiv.className = "col-md-4";
      const codeBlock = `
            <div class="trend_2im clearfix position-relative">
                <div class="trend_2im1 clearfix">
                    <div class="grid">
                        <figure class="effect-jazz mb-0">
                            <a href="../client/moviePage.html?id=${movie.id}"><img src="${movie.bannerUrl}" class="w-100" style="height:250px; object-fit:cover" alt="img25"></a>
                        </figure>
                    </div>
                </div>
            </div>
            <div class="trend_2ilast bg_grey p-3 clearfix">
                <h5><a class="col_red" href="#">${movie.title}</a></h5>
                <div class="mt-3 mb-3 d-flex" id="${movie.id}SGenres"></div>
            <div id="${movie.id}SugestionStars"></div>
            </div>
                               
    `;

      newDiv.innerHTML = codeBlock;

      container.appendChild(newDiv);

      rating = movie.userRating;
      createStars(rating, movie.id + "SugestionStars");

      const genreContainer = document.getElementById(`${movie.id}SGenres`);

      const genres = await movie.genres;

      genres.forEach((genre) => {
        const genreElement = document.createElement("div");
        genreElement.textContent = genre;
        genreElement.classList.add("genre-tags");
        genreContainer.appendChild(genreElement);
      });
    });
  } catch (error) {
    console.error(error);
    const dummyBlock = `
        <div class="trend_2im clearfix position-relative">
            <div class="trend_2im1 clearfix">
                <div class="grid">
                    <figure class="effect-jazz mb-0">
                        <a href="#"><img src="img/17.jpg" class="w-100" alt="img25"></a>
                    </figure>
                </div>
            </div>
            <div class="trend_2im2 clearfix text-center position-absolute w-100 top-0">
                <span class="fs-1"><a class="col_red" href="#"><i
                            class="fa fa-youtube-play"></i></a></span>
            </div>
        </div>
        <div class="trend_2ilast bg_grey p-3 clearfix">
            <h5><a class="col_red" href="#">Semper</a></h5>
            <p class="mb-2">A father travels from Oklahoma to France to help his...</p>
        </div>
    
    `;

    const container = document.getElementById("suggestedMoviesRow");

    for (let i = 0; i < 3; i++) {
      const newDiv = document.createElement("div");

      newDiv.className = "col-md-4";

      newDiv.innerHTML = dummyBlock;

      container.appendChild(newDiv);
    }
  }
};

const createCodeBlockUpcomingMovies = async () => {
  try {
    const response = await fetch(`${BASE_MOVIE_URL}/upcoming`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const movies = await response.json();

    const container = document.getElementById("upcomingMoviesRow");

    movies.data.forEach((movie) => {
      const newDiv = document.createElement("div");
      newDiv.className = "col-md-8 mb-3";

      const codeBlock = `
        <div class="row g-0 movie-row">
          <div class="col-md-4 col-12 movie-poster">
            <a href="moviePage.html?id=${movie.id}">
              <img src="${movie.posterUrl}" alt="${movie.title}" class="img-fluid" />
            </a>
          </div>
          <div class="col-md-8 col-12">
            <div class="movie-details" style="margin-left: 20px;">
              <h5 class="col_red movie-title">${movie.title}</h5>
              <h6 class="d-flex" id="${movie.id}genres"></h6>
              <h6 style="color:white; margin-top:20px">
                <p>Imdb ${movie.imdbRating}</p>
                <p>Year: ${movie.year}</p>
                <p>Runtime: ${movie.runtime}</p>
                <p>Director: ${movie.directedBy}</p>
                <p>Starring: ${movie.starring}</p>
              </h6>
            </div>
          </div>
        </div>
      `;

      newDiv.innerHTML = codeBlock;
      container.appendChild(newDiv);

      const genreContainer = document.getElementById(`${movie.id}genres`);
      movie.genres.forEach((genre) => {
        const genreElement = document.createElement("div");
        genreElement.textContent = genre;
        genreElement.classList.add("genre-tags");
        genreContainer.appendChild(genreElement);
      });
    });
  } catch (error) {
    console.error(error);
    const dummyBlock = `
        <div class="row g-0">
        <div class="col-md-4 col-4">
          <a href="#"
            ><img
              src="img/18.jpg"
              alt="img25"
              style="height: 350px; width: 250px"
          /></a>
        </div>
        <div class="col-md-8">
          <div style="margin-left: 20px;">
            <h5 class="col_red ml-4">Semp Porta</h5>
            <h6>Action, Thriller</h6>
            <h6>
              <p>Imdb 8.2</p>
              <p>Year : 2022</p>
              <p>Runtime: 1h 49m</p>
              <p>Director: John Doe</p>
              <p>Stars: John Doe, Jane Doe</p>
              <p>Stars</p>
            </h6>
          </div>
        </div>
      </div>  
    
    `;

    const container = document.getElementById("upcomingMoviesRow");

    for (let i = 0; i < 3; i++) {
      const newDiv = document.createElement("div");

      newDiv.className = "col-md-8";

      newDiv.innerHTML = dummyBlock;

      container.appendChild(newDiv);
    }
  }
};

const createCodeBlockBestRevenuedMovies = async () => {
  try {
    const response = await fetch(`${BASE_MOVIE_URL}/bestRevenued`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();
    console.log("API Response:", data);
    let movies = data.bestRevenuedMovies;
    movies = movies.slice(0, 3);
    let rating;

    const container = document.getElementById("bestRevenuedMoviesRow");

    movies.forEach(async (movie) => {
      const newDiv = document.createElement("div");

      newDiv.className = "col-md-4";
      const codeBlock = `
            <div class="trend_2im clearfix position-relative">
                <div class="trend_2im1 clearfix">
                    <div class="grid">
                        <figure class="effect-jazz mb-0">
                            <a href="../client/moviePage.html?id=${movie.id}"><img src="${movie.bannerUrl}" class="w-100" style="height:250px; object-fit:cover" alt="img25"></a>
                        </figure>
                    </div>
                </div>
            </div>
            <div class="trend_2ilast bg_grey p-3 clearfix">
                <h5><a class="col_red" href="#">${movie.title}</a></h5>
                <div class="mt-3 mb-3 d-flex" id="${movie.id}SGenres"></div>
            <div id="${movie.id}SugestionStars"></div>
            </div>
                               
    `;

      newDiv.innerHTML = codeBlock;

      container.appendChild(newDiv);

      rating = movie.userRating;
      createStars(rating, movie.id + "SugestionStars");

      const genreContainer = document.getElementById(`${movie.id}SGenres`);

      const genres = await movie.genres;

      genres.forEach((genre) => {
        const genreElement = document.createElement("div");
        genreElement.textContent = genre;
        genreElement.classList.add("genre-tags");
        genreContainer.appendChild(genreElement);
      });
    });
  } catch (error) {
    console.error(error);
    const dummyBlock = `
        <div class="trend_2im clearfix position-relative">
            <div class="trend_2im1 clearfix">
                <div class="grid">
                    <figure class="effect-jazz mb-0">
                        <a href="#"><img src="img/17.jpg" class="w-100" alt="img25"></a>
                    </figure>
                </div>
            </div>
            <div class="trend_2im2 clearfix text-center position-absolute w-100 top-0">
                <span class="fs-1"><a class="col_red" href="#"><i
                            class="fa fa-youtube-play"></i></a></span>
            </div>
        </div>
        <div class="trend_2ilast bg_grey p-3 clearfix">
            <h5><a class="col_red" href="#">Semper</a></h5>
            <p class="mb-2">A father travels from Oklahoma to France to help his...</p>
        </div>
    
    `;

    const container = document.getElementById("bestRevenuedMoviesRow");

    for (let i = 0; i < 3; i++) {
      const newDiv = document.createElement("div");

      newDiv.className = "col-md-4";

      newDiv.innerHTML = dummyBlock;

      container.appendChild(newDiv);
    }
  }
};
