export default function createStars(rating, containerId) {
  const container = document.getElementById(containerId);

  const starsContainer = `<div class="d-flex align-items-center">
    <img class="star" data-index="1" src="" alt="Star">
    <img class="star" data-index="2" src="" alt="Star">
    <img class="star" data-index="3" src="" alt="Star">
    <img class="star" data-index="4" src="" alt="Star">
    <img class="star" data-index="5" src="" alt="Star">
  
    <span id="user-rating">user-rating</span>
  </div>`;

  container.innerHTML = starsContainer;
  const stars = container.querySelectorAll(".star");
  const ratingValue = container.querySelector("#user-rating");

  updateStars();

  function getStarImage(noOffullStars, hasHalfStar, index) {
    const imageName =
      index < noOffullStars
        ? "star-fill"
        : index === noOffullStars && hasHalfStar
        ? "star-half"
        : "star-empty";
    return `./assets/stars/${imageName}.svg`;
  }

  function updateStars() {
    const noOffullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0 && rating % 1 >= 0.5;

    stars.forEach((star, index) => {
      const imageSrc = getStarImage(noOffullStars, hasHalfStar, index);
      star.src = imageSrc;
    });
    ratingValue.textContent = rating;
  }
}
