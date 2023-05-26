import { test, expect, request } from "@playwright/test";
const { APIUtils } = require("./utils/APIUtils");

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

const fakePayLoadOrders = { message: "No Product in Cart" };

let response;

test.beforeAll(async () => {
  //Login API
  const apiContext = await request.newContext({ ignoreHTTPSErrors: true });
  const apiUtils = new APIUtils(apiContext, loginPayload);
  response = await apiUtils.createOrder(orderPayload);
});

test("Place the order", async ({ page }) => {
  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, response.token);

  const email = "anshika@gmail.com";
  const productName = "Zara Coat 3";
  await page.goto("https://rahulshettyacademy.com/client/");

  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/620c7bf148767f1f1215d2ca",
    async (route) => {
      const response = await page.request.fetch(route.request());
      let body = JSON.stringify(fakePayLoadOrders);
      route.fulfill({
        response,
        body,
      });
      //intercepting response - API response -> {{playwright fakeresponse} -> browser -> render data on front end
    }
  );
  await page.locator("button[routerLink*='myorders']").click();
  console.log(await page.locator(".mt-4").textContent());
});
//verify if order created is shwoing in history page
//Pre condition - create order
