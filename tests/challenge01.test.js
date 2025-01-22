import testBase from "./testBase.js";
import { expect, test, describe, beforeAll, afterAll, afterEach } from "vitest";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

import app from "../src/server.js";
import db from "../db/db-config.js";
import HttpStatus from "../src/enums/httpStatus.js";

describe("Pre authentication tasks", () => {
  let testSession = null;

  beforeAll(async () => {
    testSession = testBase.createSuperTestSession(app);
    await testBase.resetDatabase(db);
  });

  afterEach(async () => {
    await testBase.resetDatabase(db);
  });

  afterAll((done) => {
    app.close(done);
  });

  test("challenge 1.a - password validation", async () => {
    const users = [
      {
        firstName: "test1",
        lastName: "test1",
        email: "test1@gmail.com",
        password: "test1",
      },
      {
        firstName: "test2",
        lastName: "test2",
        email: "test2@gmail.com",
        password: "passwordwithmorethan25characters",
      },
      {
        firstName: "test3",
        lastName: "test3",
        email: "test3@gmail.com",
        password: "8characters",
      },
      {
        firstName: "test4",
        lastName: "test4",
        email: "test4@gamil.com",
        password: "Test@1234",
      },
    ];

    let res1 = await testSession.post("/api/auth/signup").send(users[0]);
    expect(res1.status).toBe(HttpStatus.BAD_REQUEST);
    expect(res1.body.message).toBe(
      "Password must be at least 8 characters long"
    );

    const res2 = await testSession.post("/api/auth/signup").send(users[1]);
    expect(res2.status).toBe(HttpStatus.BAD_REQUEST);
    expect(res2.body.message).toBe(
      "Password must not be more than 25 characters long"
    );

    const res3 = await testSession.post("/api/auth/signup").send(users[2]);
    expect(res3.status).toBe(HttpStatus.BAD_REQUEST);
    expect(res3.body.message).toBe(
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    );

    const res4 = await testSession.post("/api/auth/signup").send(users[3]);
    expect(res4.status).toBe(HttpStatus.CREATED);
    expect(res4.body.message).toBe("User created successfully");
  });

  test("challenge 1.b - send an error message if login credentials are incorrect", async () => {
    const loginCredentials = [
      {
        email: "johnS@gmail.com",
        password: "incorrectPassword",
      },
      {
        email: "incorrectEmail@gmail.com",
        password: "test1",
      },
      {
        email: "incorrectEmail@gmail.com",
        password: "incorrectPassword",
      },
    ];

    for (const loginCredential of loginCredentials) {
      const res = await testSession
        .post("/api/auth/login")
        .send(loginCredential);
      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body.message).toBe("Invalid email or password");
    }
  });
});

describe("Pre authentication tasks", () => {
  const html = fs.readFileSync(
    path.resolve(__dirname, "../client/login.html"),
    "utf8"
  );

  let dom;
  let container;

  beforeAll(() => {
    dom = new JSDOM(html, { runScripts: "dangerously" });
    container = dom.window.document.body;
  });

  test("challenge 1.c - toggle password visibility", () => {
    const passwordInput = container.querySelector("#password");
    const passwordToggle = container.querySelector(".password-toggle");
    expect(passwordInput.type).toBe("password");

    expect(
      dom.window.getComputedStyle(passwordToggle).getPropertyValue("color")
    ).toBe("rgb(204, 204, 204)");

    passwordToggle.click();
    expect(passwordInput.type).toBe("text");
    expect(passwordToggle.classList.contains("show")).toBeTruthy();

    expect(
      dom.window.getComputedStyle(passwordToggle).getPropertyValue("color")
    ).toBe("rgb(111, 0, 255)");

    passwordToggle.click();
    expect(passwordInput.type).toBe("password");
    expect(passwordToggle.classList.contains("show")).toBeFalsy();
  });
});


function validatePassword(password) {
  // Check for minimum length
  if (password.length < 8) {
    return { message: "Password should be at least 8 characters long" };
  }

  // Check for maximum length
  if (password.length > 25) {
    return { message: "Password must not be more than 25 characters long" };
  }

  // Check for required characters
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/;
  if (!regex.test(password)) {
    return { message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character" };
  }

  return { message: "User created successfully" }; // If all conditions are met
}

function loginUser(email, password) {
  const user = getUserByEmail(email); // Fetch user by email (assumed function)

  // Check if the user exists and password matches
  if (!user || user.password !== password) {
    return { message: "Invalid email or password" };
  }

  return { message: "Login successful" }; // If login is successful
}

const passwordInput = document.getElementById("password");
const eyeIcon = document.getElementById("eye-icon");

eyeIcon.addEventListener("click", function () {
  // Toggle password visibility
  if (passwordInput.type === "password") {
    passwordInput.type = "text"; // Show password
    eyeIcon.classList.add("show"); // Change eye icon color
  } else {
    passwordInput.type = "password"; // Hide password
    eyeIcon.classList.remove("show"); // Reset eye icon color
  }
});

