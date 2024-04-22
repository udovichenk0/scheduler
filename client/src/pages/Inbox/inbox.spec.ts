import { test, expect } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/inbox")
  await page.getByRole("button", { name: "New Task" }).click()
})

test("Create task with title", async ({ page }) => {
  await page.getByPlaceholder("New Task").fill("asdfadf")
  await page.getByTestId("page-content").click()
  const item = page.getByTestId("task-item")
  await expect(item).toBeVisible()
})

test("Create task with empty title", async ({ page }) => {
  await page.getByTestId("page-content").click()
  const item = page.getByTestId("task-item")
  await expect(item).not.toBeVisible()
})

test("should move task from inbox to today section if we set a date to it", async ({
  page,
}) => {
  //create new task
  await page.getByPlaceholder("New Task").fill("inbox task")
  const taskItem = page.getByTestId("task-item")
  await page.getByTestId("page-content").click()

  //click on calendar button
  await expect(taskItem).toBeVisible()
  await page.getByTestId("task-date-button").click({ force: true })

  //click on the last button of the calendar
  const lastRow = page.getByRole("listitem").last()
  const allInnerTexts = await lastRow.allInnerTexts()
  const days = allInnerTexts[0].split("\n")
  const lastDay = days[days.length - 1]
  await lastRow.getByRole("button", { name: lastDay, exact: true }).click()

  //check the new created task in upcoming page
  await page.goto("http://localhost:5173/upcoming")
  await expect(page.getByText("inbox task")).toBeVisible()
})
