import { BASE_USER_URL } from "./URL.js";

let i = 1;
window.addEventListener("DOMContentLoaded", () => {
  setUserList();
});

const setUserList = async () => {
  let users = [];
  try {
    const response = await fetch(`${BASE_USER_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    users = await response.json();
    let userList = document.getElementById("userList");
    userList.innerHTML = "";
    users.data.forEach((user) => {
      let userRow = document.createElement("tr");
      userRow.innerHTML = `
            <td><div style="width:50px">${i}</div></td>
            <td><div>${user.firstName}</div></td>
            <td><div>${user.lastName}</div></td>
            <td><div style="width:200px">${user.email}</div></td>
            <td><div>${user.isAdmin === 1 ? "Yes" : "No"}</div></td>
            <td>
                 <button class="btn btn-danger delete-user-btn" data-id="${
                   user.id
                 }">
                        Delete
                    </button>

            </td>
            `;
      userRow.className = "user-row";
      userList.appendChild(userRow);
      i++;
    });

    attachDeleteEvent();
  } catch (error) {
    console.error(error);
  }
};

const attachDeleteEvent = () => {
  document.querySelectorAll(".delete-user-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const userId = e.target.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this user?")) {
        try {
          const response = await fetch(`${BASE_USER_URL}/${userId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          });

          if (response.ok) {
            alert("User deleted successfully");
            setUserList();
          } else {
            const errorData = await response.json();
            alert(`Failed to delete user: ${errorData.message}`);
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          alert("An error occurred while deleting the user.");
        }
      }
    });
  });
};

window.addEventListener("DOMContentLoaded", () => {
  setUserList();
});
