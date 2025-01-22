import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase.js";
import { expect, test, describe, beforeAll, afterAll, afterEach } from "vitest";
import HttpStatus from "../src/enums/httpStatus.js";


let testSession = null;

/**
 * Create a super test session and initiate the database before running tests.
 */
beforeAll(async () => {
    testSession = testBase.createSuperTestSession(app);
    await testBase.resetDatabase(db);
});

/**
 * Reset the database after every test case
 */
afterEach(async () => {
    await testBase.resetDatabase(db);
});

/**
 * Take down the app once test execution is done
 */
afterAll((done) => {
    app.close(done);
});



describe("Post authentication tasks", () => {
    let authenticatedSession = null;
    let authToken = null;
    let authenticatedUserId = null;


    beforeAll(async () => {
        const result = await testBase.authenticateTestSession(testSession);
        authenticatedSession = testSession;
        authToken = result.token;
        authenticatedUserId = result.userId;
    });

    let giftAmount = 100;
    test("Challenge 16.a - Send a gift voucher to a user", async () => {

        const senderBefore = await authenticatedSession
            .get(`/api/user/${authenticatedUserId}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(senderBefore.status).toBe(HttpStatus.OK);

        const response1 = await authenticatedSession
            .post("/api/gift-voucher")
            .send({
                "receiverEmail": "johnC@gmail.com",
                "amount": giftAmount
            })
            .set("Authorization", `Bearer ${authToken}`);

        expect(response1.status).toBe(HttpStatus.NOT_FOUND);
        expect(response1.body.message).toBe("No user for the email provided");

        const response2 = await authenticatedSession
            .post("/api/gift-voucher")
            .send({
                "receiverEmail": "johnS@gmail.com",
                "amount": giftAmount
            })
            .set("Authorization", `Bearer ${authToken}`);

        expect(response2.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response2.body.message).toBe("You cannot send a gift voucher to yourself");

        const response3 = await authenticatedSession
            .post("/api/gift-voucher")
            .send({
                "receiverEmail": "mattD@gmail.com",
                "amount": 300
            })
            .set("Authorization", `Bearer ${authToken}`);

        expect(response3.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response3.body.message).toBe("Insufficient balance");

        const response4 = await authenticatedSession
            .post("/api/gift-voucher")
            .send({
                "receiverEmail": "mattD@gmail.com",
                "amount": giftAmount
            })
            .set("Authorization", `Bearer ${authToken}`);

        expect(response4.status).toBe(HttpStatus.CREATED);
        expect(response4.body.data.status).toBe("unclaimed");

        let issuedAt = new Date(response4.body.data.issuedAt);
        issuedAt.setDate(issuedAt.getDate() + 14);
        expect(response4.body.data.expiresAt).toBe(issuedAt.toISOString());

        const senderAfter = await authenticatedSession
            .get(`/api/user/${authenticatedUserId}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(senderAfter.status).toBe(HttpStatus.OK);
        expect(senderAfter.body.data.balance).toBe(senderBefore.body.data.balance - giftAmount);

    });

    test("Challenge 16.b - Get gift voucher by receiver id", async () => {
        const expectedResponse = [{
            "id": "ad8b570b-0084-4e6e-9f26-aa5f8c17fbc2",
            "senderId": "da9347a6-2a7f-4573-be27-15f05569fb0d",
            "receiverId": "c784dd78-b26e-4cc0-9c8a-b84bdb4330b9",
            "amount": 200,
            "issuedAt": "2024-04-10T11:37:01.316Z",
            "expiresAt": "2024-04-24T11:37:01.316Z",
            "status": "expired",
            "senderName": "Matt Damon"
        }];

        const response = await authenticatedSession
            .get(`/api/gift-voucher/receiver`)
            .set("Authorization", `Bearer ${authToken}`)

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.data).toEqual(expectedResponse);


    });

    test("Challenge 16.c - claim a gift voucher", async () => {

        const response1 = await authenticatedSession
            .post("/api/gift-voucher")
            .send({
                "receiverEmail": "mattD@gmail.com",
                "amount": giftAmount
            })
            .set("Authorization", `Bearer ${authToken}`);

        expect(response1.status).toBe(HttpStatus.CREATED);

        const result = await testBase.authenticateAdminTestSession(testSession);
        authenticatedSession = testSession;
        authToken = result.token;
        authenticatedUserId = result.userId;

        const receiverBefore = await authenticatedSession
            .get(`/api/user/${authenticatedUserId}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(receiverBefore.status).toBe(HttpStatus.OK);

        const response2 = await authenticatedSession
            .patch(`/api/gift-voucher/claim/${response1.body.data.id}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(response2.status).toBe(HttpStatus.OK);
        expect(response2.body.data.status).toBe("claimed");

        const receiverAfter = await authenticatedSession
            .get(`/api/user/${authenticatedUserId}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(receiverAfter.status).toBe(HttpStatus.OK);
        expect(receiverAfter.body.data.balance).toBe(receiverBefore.body.data.balance + giftAmount);
    });
})

