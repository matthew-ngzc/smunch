import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import Navbar from '@/components/Navbar.vue'
import { useAuthStore } from '@/stores/auth'

// Mock vue-router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush
  }),
  useRoute: () => ({
    name: 'home'
  })
}))

describe('Navbar.vue', () => {
  let wrapper
  let pinia
  let authStore

  beforeEach(() => {
    pinia = createPinia()
    wrapper = mount(Navbar, {
      global: {
        plugins: [pinia]
      }
    })
    authStore = useAuthStore()
    mockPush.mockClear()
  })

  it('renders correctly', () => {
    expect(wrapper.find('.navbar').exists()).toBe(true)
    expect(wrapper.find('.nav-logo').exists()).toBe(true)
    expect(wrapper.find('.nav-links').exists()).toBe(true)
  })

  it('shows login/signup when user not authenticated', () => {
    authStore.isAuthenticated = false
    
    expect(wrapper.find('[data-testid="login-link"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="signup-link"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="profile-dropdown"]').exists()).toBe(false)
  })

  it('shows profile dropdown when user authenticated', async () => {
    authStore.isAuthenticated = true
    authStore.user = { name: 'Test User', email: 'test@example.com' }
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('[data-testid="profile-dropdown"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="login-link"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="signup-link"]').exists()).toBe(false)
  })

  it('toggles mobile menu', async () => {
    const mobileToggle = wrapper.find('.mobile-toggle')
    expect(wrapper.vm.showMobileMenu).toBe(false)
    
    await mobileToggle.trigger('click')
    expect(wrapper.vm.showMobileMenu).toBe(true)
    
    await mobileToggle.trigger('click')
    expect(wrapper.vm.showMobileMenu).toBe(false)
  })

  it('closes mobile menu when clicking outside', async () => {
    wrapper.vm.showMobileMenu = true
    await wrapper.vm.$nextTick()
    
    // Simulate clicking outside
    wrapper.vm.closeMobileMenu()
    expect(wrapper.vm.showMobileMenu).toBe(false)
  })

  it('navigates to correct routes', async () => {
    const homeLink = wrapper.find('[data-testid="home-link"]')
    await homeLink.trigger('click')
    
    expect(mockPush).toHaveBeenCalledWith({ name: 'home' })
  })

  it('handles logout correctly', async () => {
    authStore.isAuthenticated = true
    const logoutSpy = vi.spyOn(authStore, 'logout')
    
    const logoutButton = wrapper.find('[data-testid="logout-button"]')
    await logoutButton.trigger('click')
    
    expect(logoutSpy).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith({ name: 'home' })
  })

  it('shows active link styling', () => {
    // Test that the current route gets active styling
    const activeLink = wrapper.find('.nav-link.active')
    expect(activeLink.exists()).toBe(true)
  })
}) 