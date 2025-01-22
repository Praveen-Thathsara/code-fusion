import { BASE_GIFT_VOUCHER_URL } from "./URL.js";

document.addEventListener("DOMContentLoaded", async () => {
  const giftVouchers = await fetchGiftVoucherOfReceiver();
  console.log(giftVouchers);
  setGiftVouchers(giftVouchers.data);

  let claimButtons = document.querySelectorAll("#claim-button");

  claimButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      const voucherId = event.target.getAttribute("data-voucher-id");
      await claimGiftVoucher(voucherId);
    });
  });

  const giftVoucherModal = document.getElementById("gift-voucher-modal");

  giftVoucherModal.addEventListener("show.bs.modal", (event) => {
    let receiverEmail = document.getElementById("recipient-email");
    let voucherAmount = document.getElementById("voucher-amount");

    let giftVoucherForm = document.getElementById("gift-voucher-form");
    giftVoucherForm.addEventListener("submit", async (event) => {
      try {
        event.preventDefault();
        receiverEmail = receiverEmail.value;
        voucherAmount = voucherAmount.value;
        const response = await fetch(`${BASE_GIFT_VOUCHER_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            receiverEmail: receiverEmail,
            amount: voucherAmount,
          }),
        });

        const responseJson = await response.json();

        if (
          response.status === 400 ||
          response.status === 500 ||
          response.status === 404
        ) {
          alert(responseJson.message);
          location.reload();
        } else {
          alert("Voucher sent successfully");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });
});

async function fetchGiftVoucherOfReceiver() {
  try {
    const response = await fetch(`${BASE_GIFT_VOUCHER_URL}/receiver`, {
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

function setGiftVouchers(giftVouchers) {
  const unclaimedGiftVouchers = giftVouchers.filter(
    (giftVoucher) => giftVoucher.status === "unclaimed"
  );
  const claimedGiftVouchers = giftVouchers.filter(
    (giftVoucher) =>
      giftVoucher.status === "claimed" || giftVoucher.status === "expired"
  );

  const unclaimedGiftVoucherList = document.getElementById(
    "unclaimed-gift-vouchers"
  );
  const claimedGiftVoucherList = document.getElementById(
    "claimed-gift-vouchers"
  );

  if (unclaimedGiftVouchers.length !== 0) {
    unclaimedGiftVouchers.forEach((giftVoucher) => {
      let modifiedDates = modifyDate(giftVoucher);
      const giftVoucherElement = `<div
    class="card"
    style="box-shadow: 4px 4px 4px -1px rgb(192, 192, 192)"
  >
    <div class="card-content">
      <div class="card-body">
        <div
          class="d-flex align-items-center justify-content-between"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            class="bi bi-gift-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A3 3 0 0 1 3 2.506zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43zM9 3h2.932l.023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0zm6 4v7.5a1.5 1.5 0 0 1-1.5 1.5H9V7zM2.5 16A1.5 1.5 0 0 1 1 14.5V7h6v9z"
            />
          </svg>
          <span>Received From: ${giftVoucher.senderName} </span>
          <div class="d-flex flex-column">
          <span>Issue Date:${modifiedDates.expiresAt}</span>
          <span>Expiry Date:${modifiedDates.issuedAt}</span>
          </div>
          <h3>${giftVoucher.amount}</h3>

          <button class="btn-custom" data-voucher-id="${giftVoucher.id}" id="claim-button">Claim</button>
        
        </div>
      </div>
    </div>
  </div> `;
      unclaimedGiftVoucherList.innerHTML += giftVoucherElement;
    });
  } else {
    unclaimedGiftVoucherList.innerHTML = `<h3>No unclaimed gift vouchers</h3>`;
  }

  if (claimedGiftVouchers.length !== 0) {
    claimedGiftVouchers.forEach((giftVoucher) => {
      const modifiedDates = modifyDate(giftVoucher);
      const giftVoucherElement = `<div
    class="card mb-4"
    style="box-shadow: 4px 4px 4px -1px rgb(192, 192, 192)"
  >
    <div class="card-content">
      <div class="card-body">
        <div
          class="d-flex align-items-center justify-content-between"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            class="bi bi-gift-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A3 3 0 0 1 3 2.506zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43zM9 3h2.932l.023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0zm6 4v7.5a1.5 1.5 0 0 1-1.5 1.5H9V7zM2.5 16A1.5 1.5 0 0 1 1 14.5V7h6v9z"
            />
          </svg>
          <span>Received From: ${giftVoucher.senderName} </span>
          <div class="d-flex flex-column">
            <span>Issue Date:${modifiedDates.expiresAt}</span>
            <span>Expiry Date:${modifiedDates.issuedAt}</span>
          </div>
          <h3>${giftVoucher.amount}</h3>
          <h5>Status: ${giftVoucher.status}</h5>
         
        </div>
      </div>
    </div>
  </div> `;
      claimedGiftVoucherList.innerHTML += giftVoucherElement;
    });
  } else {
    claimedGiftVoucherList.innerHTML = `<h3>No claimed or expired gift vouchers</h3>`;
  }
}

function modifyDate(giftVoucher) {
  let issuedAt = new Date(giftVoucher.issuedAt).toLocaleDateString();
  let issuedTime = new Date(giftVoucher.issuedAt).toLocaleTimeString();
  let expiresAt = new Date(giftVoucher.expiresAt).toLocaleDateString();
  let expiresTime = new Date(giftVoucher.expiresAt).toLocaleTimeString();

  return {
    issuedAt: issuedAt + " " + issuedTime,
    expiresAt: expiresAt + " " + expiresTime,
  };
}

async function claimGiftVoucher(voucherId) {
  try {
    const response = await fetch(
      `${BASE_GIFT_VOUCHER_URL}/claim/${voucherId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.message);
    } else {
      alert("Voucher claimed successfully!");
      location.reload();
    }
  } catch (error) {
    alert(error.message);
    location.reload();
  }
}

async function sendGiftVoucher(receiverEmail, voucherAmount) {
  try {
    const response = await fetch(`${BASE_GIFT_VOUCHER_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        receiverEmail: receiverEmail,
        amount: voucherAmount,
      }),
    });
    const data = await response.json();
    if (response.status !== 201) {
      throw new Error(data.message);
    }
    alert("Gift voucher sent successfully!");
    location.reload();
  } catch (error) {
    alert(error.message);
  }
}
