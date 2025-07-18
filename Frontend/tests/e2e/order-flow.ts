describe('SMUNCH Order Flow', function () {
  before((browser) => {
    browser.init()
  })

  it('should navigate through complete order flow', function () {
    browser
      .navigateTo('http://localhost:5173')
      .waitForElementVisible('body', 3000)
      .assert.titleContains('SMUNCH')
  })

  it('should display daily challenge on order page', function () {
    browser
      .navigateTo('http://localhost:5173/order')
      .waitForElementVisible('.daily-challenge', 3000)
      .assert.visible('.challenge-title')
      .assert.textContains('.challenge-title', 'Daily Challenge')
      .assert.visible('.challenge-task')
      .assert.visible('.challenge-reward')
  })

  it('should show merchant grid', function () {
    browser
      .waitForElementVisible('.merchant-grid', 5000)
      .assert.visible('.merchant-card')
      .assert.textContains('.page-title', 'Order with SMUNCH!')
  })

  it('should click on a merchant card', function () {
    browser
      .click('.merchant-card:first-child')
      .pause(2000)
      // Should navigate to merchant page or show child merchants
  })

  it('should open chat and verify it overlays properly', function () {
    browser
      .navigateTo('http://localhost:5173/order')
      .waitForElementVisible('.chat-container', 3000)
      .click('.chat-toggle')
      .waitForElementVisible('.chat-expanded', 2000)
      .assert.cssClassPresent('.order-page', 'faded')
  })

  it('should be responsive on mobile viewport', function () {
    browser
      .setWindowSize(375, 667) // iPhone SE size
      .navigateTo('http://localhost:5173/order')
      .waitForElementVisible('.daily-challenge', 3000)
      .assert.visible('.merchant-grid')
      // Daily challenge should be smaller on mobile
      .assert.cssProperty('.daily-challenge', 'width', '180px')
  })

  it('should navigate to cart page', function () {
    browser
      .setWindowSize(1024, 768) // Reset to desktop
      .navigateTo('http://localhost:5173/cart')
      .waitForElementVisible('body', 3000)
      .assert.urlContains('/cart')
  })

  it('should navigate to home page and verify content', function () {
    browser
      .navigateTo('http://localhost:5173')
      .waitForElementVisible('.home-content', 3000)
      .assert.visible('.navbar')
      .assert.textContains('h1', 'SMUNCH')
  })

  it('should test navigation menu functionality', function () {
    browser
      .click('.nav-link[href="/order"]')
      .waitForElementVisible('.order-page', 3000)
      .assert.urlContains('/order')
      .click('.nav-link[href="/"]')
      .waitForElementVisible('.home-content', 3000)
      .assert.urlContains('/')
  })

  it('should test mobile navigation', function () {
    browser
      .setWindowSize(375, 667)
      .navigateTo('http://localhost:5173')
      .waitForElementVisible('.mobile-toggle', 3000)
      .click('.mobile-toggle')
      .waitForElementVisible('.mobile-menu', 2000)
      .assert.visible('.mobile-nav-links')
  })

  after((browser) => {
    browser.end()
  })
}) 