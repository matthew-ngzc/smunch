export function formatDateTime(datetime) {
  const date = new Date(datetime)
  return date.toLocaleDateString('en-GB') + ', ' + date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

export function formatLocation(order) {
  return `${order.building.toUpperCase()}, ${order.room_type} ${order.room_number}`
}

export function formatStatusClass(status) {
  return {
    'awaiting_payment': 'status-grey',
    'payment_confirmed': 'status-green',
    'awaiting_verification': 'status-yellow'
  }[status] || 'status-grey'
}

export function formatStatus(status) {
  switch (status) {
    case 'awaiting_payment': return 'Awaiting Payment'
    case 'payment_confirmed': return 'Payment Confirmed'
    case 'awaiting_verification': return 'Awaiting Verification'
    default: return status
  }
}

// for pastorders.vue 
export function formatStatusBadge(status) {
  switch (status) {
    case 'completed':
      return { text: 'Completed', class: 'status-green', msg: 'Order successfully delivered.' }
    case 'cancelled':
      return { text: 'Cancelled', class: 'status-red', msg: 'You cancelled this order.' }
    default:
      return { text: status, class: 'status-grey', msg: 'Status unknown.' }
  }
}
