import { test, expect } from '@playwright/test'

test.beforeEach( async ({ page }) => {
  await page.goto('/')
  await page.getByTitle("Settings").click()
  await page.getByRole("button", { name: "Synchronization" }).click()
  await page.getByRole("button", { name: "Continue With Email"}).click()
})
test('Successful login', async ({ page }) => {

  await page.route("http://localhost:3000/user?email=mytestemail%40gmail.com", async (route) => {
    const json = {id: 'user_id', email: 'mytestemail@gmail.com', verified: true}
    return route.fulfill({json})
  })
  await page.route("http://localhost:3000/auth/sign-in", async (route) => {
    const json = {
      user: {id: 'user_id', email: 'mytestemail@gmail.com', verified: true},
      access_token: "access_token",
    }
    return route.fulfill({json})
  })
  //signin

  await page.getByRole('textbox').fill("mytestemail@gmail.com")

  await page.getByRole("button", { name: "Continue"}).click()

  await expect(page.getByText("Sign in")).toBeVisible()

  await page.getByRole("textbox").fill("password123")
  await page.getByRole("button", { name: "Resume" }).click()

  //to be logged in
  await expect(page.getByRole("button", { name: "Quit" })).toBeVisible()
})

test('Sign up flow', async ({ page }) => {

  await page.route("http://localhost:3000/user?email=mytestemail%40gmail.com", async (route) => {
    const json = {
      message: "User not found",
      error: "not_found"
    }
    return route.fulfill({json})
  })
  await page.route("http://localhost:3000/auth/sign-up", async (route) => {
    const json = {id: 'user_id', email: 'mytestemail@gmail.com', verified: false}
    return route.fulfill({json})
  })
  await page.route("http://localhost:3000/auth/verify-email", async (route) => {
    const json = {
      user: {id: 'user_id', email: 'mytestemail@gmail.com', verified: true},
      access_token: "access_token",
    }
    return route.fulfill({json})
  })
  await page.getByRole('textbox').fill("mytestemail@gmail.com")
  await page.getByRole("button", { name: "Continue"}).click()
  //signup modal
  await expect(page.getByText('Sign up')).toBeVisible()

  await page.getByRole("textbox").fill("password123")
  await page.getByRole("button", { name: "Resume" }).click()
  // to be verification modal
  await expect(page.getByRole("heading", {name: "Verification"})).toBeVisible()
  //input
  const input = page.getByLabel('Code')
  await input.focus()
  const submit = page.getByRole("button", { name: "Submit" })

  await expect(submit).toBeDisabled()
  //enter code
  await page.keyboard.press("1")
  await page.keyboard.press("2")
  await page.keyboard.press("3")
  await page.keyboard.press("4")
  await page.keyboard.press("5")
  await page.keyboard.press("6")

  await expect(submit).toBeEnabled()
  await submit.click()

  //to be logged in
  await expect(page.getByRole("button", { name: "Quit" })).toBeVisible()
})
test('Show error if verification code is not correct', async ({ page }) => {

  await page.route("http://localhost:3000/user?email=mytestemail%40gmail.com", async (route) => {
    const json = {
      message: "User not found",
      error: "not_found"
    }
    return route.fulfill({json})
  })
  await page.route("http://localhost:3000/auth/sign-up", async (route) => {
    const json = {id: 'user_id', email: 'mytestemail@gmail.com', verified: false}
    return route.fulfill({json})
  })
  await page.route("http://localhost:3000/auth/verify-email", async (route) => {
    const json = {
      statusCode: 406,
      message: "Code is not valid",
      error:"Not Acceptable"
    }
    return route.fulfill({json})
  })
  await page.getByRole('textbox').fill("mytestemail@gmail.com")
  await page.getByRole("button", { name: "Continue"}).click()
  //signup modal
  await expect(page.getByText('Sign up')).toBeVisible()

  await page.getByRole("textbox").fill("password123")
  await page.getByRole("button", { name: "Resume" }).click()
  // to be verification modal
  await expect(page.getByRole("heading", {name: "Verification"})).toBeVisible()
  //input
  const input = page.getByLabel('Code')
  await input.focus()
  const submit = page.getByRole("button", { name: "Submit" })

  await expect(submit).toBeDisabled()
  //enter code
  await page.keyboard.press("1")
  await page.keyboard.press("2")
  await page.keyboard.press("3")
  await page.keyboard.press("4")
  await page.keyboard.press("5")
  await page.keyboard.press("6")

  await expect(submit).toBeEnabled()
  await submit.click()

  await expect(page.getByText("Code is not valid")).toBeVisible()
})
//

test("Show error if password is not correct", async ({ page }) => {
  await page.route("http://localhost:3000/user?email=mytestemail%40gmail.com", async (route) => {
    const json = {id: 'user_id', email: 'mytestemail@gmail.com', verified: true}
    return route.fulfill({json})
  })
  await page.route("http://localhost:3000/auth/sign-in", async (route) => {
    const json = {
      statusCode: 404,
      message: "Entered password is not correct!",
      error: "Not Found"
    }
    return route.fulfill({
      status: 404,
      json 
    })
  })
  //signin

  await page.getByRole('textbox').fill("mytestemail@gmail.com")

  await page.getByRole("button", { name: "Continue"}).click()

  await expect(page.getByText("Sign in")).toBeVisible()

  await page.getByRole("textbox").fill("password123")
  await page.getByRole("button", { name: "Resume" }).click()

  await expect(page.getByLabel("Incorrect login or password")).toBeVisible()
})

test('Show error if email is too short', async ({ page }) => {
  const errorMessage = 'Entered email is too short'
  await page.getByRole('textbox').fill("s");

  await page.getByRole("button", { name: "Continue" }).click()

  await expect(page.getByText(errorMessage)).toBeVisible()
})