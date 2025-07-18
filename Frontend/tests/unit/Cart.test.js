import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '@/stores/cart'

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with empty cart', () => {
    const cartStore = useCartStore()
    
    expect(cartStore.items).toEqual([])
    expect(cartStore.totalItems).toBe(0)
    expect(cartStore.totalPrice).toBe(0)
  })

  it('adds item to cart', () => {
    const cartStore = useCartStore()
    const item = {
      id: 1,
      name: 'Test Burger',
      price: 10.50,
      quantity: 1
    }
    
    cartStore.addItem(item)
    
    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0]).toEqual(item)
    expect(cartStore.totalItems).toBe(1)
    expect(cartStore.totalPrice).toBe(10.50)
  })

  it('increases quantity when adding same item', () => {
    const cartStore = useCartStore()
    const item = {
      id: 1,
      name: 'Test Burger',
      price: 10.50,
      quantity: 1
    }
    
    cartStore.addItem(item)
    cartStore.addItem(item)
    
    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0].quantity).toBe(2)
    expect(cartStore.totalItems).toBe(2)
    expect(cartStore.totalPrice).toBe(21.00)
  })

  it('removes item from cart', () => {
    const cartStore = useCartStore()
    const item = {
      id: 1,
      name: 'Test Burger',
      price: 10.50,
      quantity: 2
    }
    
    cartStore.addItem(item)
    cartStore.removeItem(1)
    
    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0].quantity).toBe(1)
    expect(cartStore.totalItems).toBe(1)
    expect(cartStore.totalPrice).toBe(10.50)
  })

  it('removes item completely when quantity reaches 0', () => {
    const cartStore = useCartStore()
    const item = {
      id: 1,
      name: 'Test Burger',
      price: 10.50,
      quantity: 1
    }
    
    cartStore.addItem(item)
    cartStore.removeItem(1)
    
    expect(cartStore.items).toHaveLength(0)
    expect(cartStore.totalItems).toBe(0)
    expect(cartStore.totalPrice).toBe(0)
  })

  it('clears entire cart', () => {
    const cartStore = useCartStore()
    const item1 = { id: 1, name: 'Burger', price: 10.50, quantity: 1 }
    const item2 = { id: 2, name: 'Fries', price: 5.25, quantity: 2 }
    
    cartStore.addItem(item1)
    cartStore.addItem(item2)
    cartStore.clearCart()
    
    expect(cartStore.items).toHaveLength(0)
    expect(cartStore.totalItems).toBe(0)
    expect(cartStore.totalPrice).toBe(0)
  })

  it('calculates total price correctly with multiple items', () => {
    const cartStore = useCartStore()
    const item1 = { id: 1, name: 'Burger', price: 10.50, quantity: 2 }
    const item2 = { id: 2, name: 'Fries', price: 5.25, quantity: 1 }
    
    cartStore.addItem(item1)
    cartStore.addItem(item2)
    
    expect(cartStore.totalPrice).toBe(26.25) // (10.50 * 2) + (5.25 * 1)
    expect(cartStore.totalItems).toBe(3) // 2 + 1
  })

  it('updates item quantity', () => {
    const cartStore = useCartStore()
    const item = { id: 1, name: 'Burger', price: 10.50, quantity: 1 }
    
    cartStore.addItem(item)
    cartStore.updateQuantity(1, 5)
    
    expect(cartStore.items[0].quantity).toBe(5)
    expect(cartStore.totalItems).toBe(5)
    expect(cartStore.totalPrice).toBe(52.50)
  })

  it('finds item by id', () => {
    const cartStore = useCartStore()
    const item = { id: 1, name: 'Burger', price: 10.50, quantity: 1 }
    
    cartStore.addItem(item)
    const foundItem = cartStore.getItemById(1)
    
    expect(foundItem).toEqual(item)
    expect(cartStore.getItemById(999)).toBeUndefined()
  })
}) 