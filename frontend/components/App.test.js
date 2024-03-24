import { render, fireEvent, screen } from "@testing-library/react";
import AppFunctional from "./AppFunctional";
import React from "react";
import "@testing-library/jest-dom/extend-expect";

let up, down, left, right, reset, submit;
let squares, coordinates, steps, message, email;

const updateStatelessSelectors = (document) => {
  up = document.querySelector("#up");
  down = document.querySelector("#down");
  left = document.querySelector("#left");
  right = document.querySelector("#right");
  reset = document.querySelector("#reset");
  submit = document.querySelector("#submit");
};

const updateStatefulSelectors = (document) => {
  squares = document.querySelectorAll(".square");
  coordinates = document.querySelector("#coordinates");
  steps = document.querySelector("#steps");
  message = document.querySelector("#message");
  email = document.querySelector("#email");
};

beforeEach(() => {
  render(<AppFunctional />);
  updateStatelessSelectors(document);
  updateStatefulSelectors(document);
});

test("Aksiyonlar : yukarı, sol Mail: fatih@gmail.com girilince 'fatih win #33' mesajı dönüyor", async () => {
  fireEvent.click(up);
  fireEvent.click(left);
  fireEvent.change(email, { target: { value: "fatih@gmail.com" } });
  fireEvent.click(submit);
  await screen.findByText("fatih win #33");
});

test("Aksiyonlar : yukarı sol yukarı 'Yukarıya gidemezsiniz' hata mesajı dönüyor", async () => {
  fireEvent.click(up);
  fireEvent.click(left);
  fireEvent.click(up);
  await screen.findByText("Yukarıya gidemezsiniz");
});

test("Aksiyonlar : yukarı yukarı sol hata mesajı dönmüyor", () => {
  fireEvent.click(up);
  fireEvent.click(up);
  fireEvent.click(left);
  expect(message).toHaveTextContent("");
});

test("Aksiyonlar : yukarı, aşağı steps mesajı 2 oluyor", () => {
  fireEvent.click(up);
  fireEvent.click(down);
  expect(steps).toHaveTextContent("2");
});

test("Mail girmeyince 'Ouch: email is required' mesajı dönüyor", () => {
  fireEvent.click(submit);
  expect(message).toHaveTextContent("Ouch: email is required");
});
