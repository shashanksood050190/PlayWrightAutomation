import { test, expect, request } from "@playwright/test";
const { APIUtils } = require("./utils/APIUtils");

const loginPayload = {
  userEmail: "rahulshetty@gmail.com",
  userPassword: "Iamking@00",
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
  await page.locator("button[routerLink*='myorders']").click();

  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=640fcafe568c3e9fb1315772",
    (route) =>
      route.continue({
        url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=640f8bd9568c3e9fb1313eb4",
      })
  );
  await page.locator("button:has-text('View')").first().click();
  await page.pause();
});
//verify if order created is shwoing in history page
//Pre condition - create order
