import { test, expect, request } from "@playwright/test";
const {APIUtils} = require('./utils/APIUtils');

const loginPayload = {
  userEmail: "anshika@gmail.com",
  userPassword: "Iamking@000",
};

const orderPayload = {
  orders: [
    {
      country: "Cuba",
      productOrderedId: "6262e990e26b7e1a10e89bfa",
    },
  ],
};

let response;

test.beforeAll(async () => {
  //Login API
  const apiContext = await request.newContext({ ignoreHTTPSErrors: true });
  const apiUtils = new APIUtils(apiContext,loginPayload);
  response = await apiUtils.createOrder(orderPayload);
});


test("Place the order", async ({ page }) => {

  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, response.token);

  const email = "anshika@gmail.com";
  const productName = "Zara Coat 3";
  await page.goto("https://rahulshettyacademy.com/client/");

  
  await page.locator("button[routerLink*='myorders']").click();
  await page.locator("tbody").waitFor();
  const rows = page.locator("tbody tr");
  for (let i = 0; i < (await rows.count()); ++i) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();
    if (response.orderId.includes(rowOrderId)) {
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }
  const orderIdDetails = await page.locator(".col-text").textContent();
  await page.pause();
  expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
});
//verify if order created is shwoing in history page
//Pre condition - create order 
