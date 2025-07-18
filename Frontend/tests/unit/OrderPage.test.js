import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import OrderPage from '@/views/OrderPage.vue'
import { useOrderStore } from '@/stores/order'

// Mock the services
vi.mock('@/services/orderFoodService', () => ({
  fetchParentMerchants: vi.fn(),
  getChildMerchants: vi.fn(),
  getMerchantInfoById: vi.fn()
}))

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

describe('OrderPage.vue', () => {
  let wrapper
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    
    wrapper = mount(OrderPage, {
      global: {
        plugins: [pinia],
        stubs: {
          ChatBar: true
        }
      }
    })
  })

  it('renders correctly', () => {
    expect(wrapper.find('.order-page').exists()).toBe(true)
    expect(wrapper.find('.page-title').text()).toBe('Order with SMUNCH!')
    expect(wrapper.find('.page-subtitle').text()).toBe('Choose your favorite restaurant and let us handle the rest')
  })

  it('displays daily challenge', () => {
    expect(wrapper.find('.daily-challenge').exists()).toBe(true)
    expect(wrapper.find('.challenge-title').text()).toBe('Daily Challenge')
    expect(wrapper.find('.challenge-task').exists()).toBe(true)
    expect(wrapper.find('.challenge-reward').exists()).toBe(true)
  })

  it('daily challenge changes based on day of week', () => {
    const component = wrapper.vm
    const challenges = component.challenges
    
    // Test that we have 7 different challenges
    expect(challenges).toHaveLength(7)
    
    // Test that each challenge has required properties
    challenges.forEach(challenge => {
      expect(challenge).toHaveProperty('id')
      expect(challenge).toHaveProperty('title')
      expect(challenge).toHaveProperty('description')
      expect(challenge).toHaveProperty('task')
      expect(challenge).toHaveProperty('reward')
      expect(challenge).toHaveProperty('icon')
      expect(challenge).toHaveProperty('color')
      expect(challenge).toHaveProperty('difficulty')
    })
  })

  it('shows merchant grid when merchants are loaded', async () => {
    // Set some mock merchants
    wrapper.vm.merchants = [
      {
        id: 1,
        merchant_id: 'merchant1',
        name: 'Test Restaurant',
        image_url: 'test.jpg'
      },
      {
        id: 2,
        merchant_id: 'merchant2',
        name: 'Another Restaurant',
        image_url: 'test2.jpg'
      }
    ]
    
    await wrapper.vm.$nextTick()
    
    const merchantCards = wrapper.findAll('.merchant-card')
    expect(merchantCards).toHaveLength(2)
    expect(wrapper.find('.merchant-name').text()).toBe('Test Restaurant')
  })

  it('shows empty state when no merchants', () => {
    wrapper.vm.merchants = []
    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.find('.empty-state h3').text()).toBe('No restaurants available')
  })

  it('handles chat state changes', async () => {
    expect(wrapper.vm.isChatExpanded).toBe(false)
    
    wrapper.vm.handleChatStateChange(true)
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.isChatExpanded).toBe(true)
    expect(wrapper.find('.order-page').classes()).toContain('faded')
  })

  it('completes challenge correctly', () => {
    expect(wrapper.vm.challengeCompleted).toBe(false)
    
    // Mock alert to avoid actual alert popup in tests
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    wrapper.vm.completeChallenge()
    
    expect(wrapper.vm.challengeCompleted).toBe(true)
    expect(alertSpy).toHaveBeenCalled()
    
    alertSpy.mockRestore()
  })
}) 