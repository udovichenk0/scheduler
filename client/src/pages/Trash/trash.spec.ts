import { test, expect } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/")
  await page.getByRole("button", { name: "New Task" }).click()
})

test("Put task to trash", async ({ page }) => {
  // create new task
  await page.getByPlaceholder("New Task").fill("asdfadf")
  await page.getByTestId("page-content").click()
  const taskItem = page.getByTestId("task-item")
  await taskItem.click()
  const deleteBtn = page.getByTitle("Delete")

  await expect(taskItem).toBeVisible()
  await expect(taskItem).toBeFocused()
  await expect(deleteBtn).toBeEnabled()
  //delete task
  await deleteBtn.click()
  await expect(taskItem).not.toBeVisible()

  //check the deleted task in trash page
  await page.goto("http://localhost:5173/trash")
  await expect(taskItem).toBeVisible()
})
