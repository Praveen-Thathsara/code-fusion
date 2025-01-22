document.addEventListener("DOMContentLoaded", function () {
  createNavDropdown();
  document.getElementById("username").innerHTML =
    localStorage.getItem("username");
});

createNavDropdown = async () => {
  const profileIcon = document.getElementById("profileIcon");

  profileIcon.addEventListener("click", function (event) {
    event.preventDefault();
    const list = document.getElementById("navLinksList");
    const isAdmin = localStorage.getItem("isAdmin");

    if (isAdmin === "1") {
      list.innerHTML = `
            <li><a class="dropdown-item" href="#">Profile</a></li>
            <li><a class="dropdown-item" href="movielist.html">Admin View</a></li>
            <li><a class="dropdown-item" href="rentals.html" id="rental">My Rentals</a></li>
            <li><a class="dropdown-item" href="giftVoucher.html" id="rental">Gift Voucher</a></li>
            <li class="dropdown-item" id="logout">Logout</li>
            `;
    } else {
      list.innerHTML = `
            <li><a class="dropdown-item" href="#">Profile</a></li>
            <li><a class="dropdown-item" href="rentals.html" id="rental">My Rentals</a></li>
            <li><a class="dropdown-item" href="giftVoucher.html" id="rental">Gift Voucher</a></li>
            <li class="dropdown-item" id="logout">Logout</li>
            `;
    }
    const logoutButton = document.getElementById("logout");

    logoutButton.addEventListener("click", function (event) {
      event.preventDefault();
      localStorage.removeItem("token");
      window.location.href = "../client/login.html";
    });
  });
};
