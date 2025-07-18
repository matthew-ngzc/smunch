describe('SMUNCH Authentication Flow', function () {
  before((browser) => {
    browser.init()
  })

  it('should display login and signup links when not authenticated', function () {
    browser
      .navigateTo('http://localhost:5173')
      .waitForElementVisible('.navbar', 3000)
      .assert.visible('a[href="/login"]')
      .assert.visible('a[href="/signup"]')
      .assert.textContains('a[href="/login"]', 'Login')
      .assert.textContains('a[href="/signup"]', 'Sign Up')
  })

  it('should navigate to login page', function () {
    browser
      .click('a[href="/login"]')
      .waitForElementVisible('.login-container', 3000)
      .assert.urlContains('/login')
      .assert.visible('input[type="email"]')
      .assert.visible('input[type="password"]')
      .assert.visible('button[type="submit"]')
  })

  it('should show validation errors for empty login form', function () {
    browser
      .click('button[type="submit"]')
      .pause(1000)
      // Should show validation messages
      .assert.visible('.error-message')
  })

  it('should navigate to signup page', function () {
    browser
      .navigateTo('http://localhost:5173/signup')
      .waitForElementVisible('.signup-container', 3000)
      .assert.urlContains('/signup')
      .assert.visible('input[name="name"]')
      .assert.visible('input[type="email"]')
      .assert.visible('input[type="password"]')
      .assert.visible('input[name="confirmPassword"]')
  })

  it('should show validation for password mismatch', function () {
    browser
      .setValue('input[name="name"]', 'Test User')
      .setValue('input[type="email"]', 'test@example.com')
      .setValue('input[type="password"]', 'password123')
      .setValue('input[name="confirmPassword"]', 'differentpassword')
      .click('button[type="submit"]')
      .pause(1000)
      // Should show password mismatch error
      .assert.visible('.error-message')
  })

  it('should handle successful login flow', function () {
    browser
      .navigateTo('http://localhost:5173/login')
      .waitForElementVisible('.login-container', 3000)
      .setValue('input[type="email"]', 'test@example.com')
      .setValue('input[type="password"]', 'correctpassword')
      .click('button[type="submit"]')
      .pause(2000)
      // Should redirect to dashboard or home
      .assert.not.urlContains('/login')
  })

  it('should show user profile when authenticated', function () {
    // Assuming user is logged in from previous test
    browser
      .navigateTo('http://localhost:5173')
      .waitForElementVisible('.navbar', 3000)
      .assert.visible('.profile-dropdown')
      .assert.not.visible('a[href="/login"]')
      .assert.not.visible('a[href="/signup"]')
  })

  it('should handle logout functionality', function () {
    browser
      .click('.profile-dropdown')
      .waitForElementVisible('.dropdown-menu', 2000)
      .click('.logout-button')
      .pause(2000)
      .assert.visible('a[href="/login"]')
      .assert.visible('a[href="/signup"]')
      .assert.not.visible('.profile-dropdown')
  })

  it('should handle forgot password flow', function () {
    browser
      .navigateTo('http://localhost:5173/login')
      .waitForElementVisible('.login-container', 3000)
      .click('.forgot-password-link')
      .waitForElementVisible('.reset-password-container', 3000)
      .assert.urlContains('/reset-password')
      .assert.visible('input[type="email"]')
      .assert.visible('button[type="submit"]')
  })

  it('should validate email format in reset password', function () {
    browser
      .setValue('input[type="email"]', 'invalid-email')
      .click('button[type="submit"]')
      .pause(1000)
      .assert.visible('.error-message')
  })

  it('should protect authenticated routes', function () {
    browser
      .navigateTo('http://localhost:5173/profile')
      .pause(2000)
      // Should redirect to login if not authenticated
      .assert.urlContains('/login')
  })

  after((browser) => {
    browser.end()
  })
}) 