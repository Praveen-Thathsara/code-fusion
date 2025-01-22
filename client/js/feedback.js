import { BASE_FEEDBACK_URL, BASE_MOVIE_URL } from "./URL.js";

export const getMovies = async () => {
  const response = await fetch(`${BASE_MOVIE_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  return (await response.json()).data;
};

export async function getFeedbackByMovieId(movieId) {
  const response = await fetch(`${BASE_FEEDBACK_URL}/search/${movieId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  return (await response.json()).data;
}

export async function getFeedbackForMovie(movieName) {
  try {
    const response = await fetch(
      `${BASE_FEEDBACK_URL}/search?name=${encodeURIComponent(movieName)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    const feedbackData = await response.json();
    const feedbackList = document.getElementById("FeedbackList");
    feedbackList.innerHTML = "";

    if (feedbackData.data && feedbackData.data.length > 0) {
      console.log(feedbackData);
      feedbackData.data.forEach((feedback) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${feedback.userName}</td>
                    <td>${feedback.comment}</td>
                    <td>${feedback.rating}</td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-feedback-btn" data-id="${feedback.id}">Delete</button>
                    </td>
                `;
        feedbackList.appendChild(row);
      });
    } else {
      const noDataRow = document.createElement("tr");
      noDataRow.innerHTML = `<td colspan="4">No feedback found for this movie.</td>`;
      feedbackList.appendChild(noDataRow);
    }
  } catch (error) {
    console.error("Error fetching feedback:", error);
  }
}

export async function deleteFeedback(movieId, userId) {
  try {
    const isConfirmed = confirm(
      "Are you sure you want to delete this feedback?"
    );
    if (!isConfirmed) return;

    const response = await fetch(`${BASE_FEEDBACK_URL}/${movieId}/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (response.ok) {
      alert("Feedback deleted successfully.");
    } else {
      const errorMessage = await response.text();
      console.error(
        `Error deleting feedback (status ${response.status}):`,
        errorMessage
      );
      alert("Failed to delete feedback.");
    }
  } catch (error) {
    console.error("Error deleting feedback:", error);
    alert("An error occurred. Check the console for more details.");
  }
}
