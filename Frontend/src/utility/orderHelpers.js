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
    'refund_pending': 'status-grey',
    'refund_completed': 'status-grey',
    'awaiting_payment': 'status-grey',
    'awaiting_verification': 'status-grey',
    'payment_confirmed': 'status-orange',
    'preparing': 'status-yellow',
    'collected_by_runner': 'status-yellow',
    'delivered': 'status-green',
    'completed': 'status-green',
    'cancelled': 'status-red'
  }[status] || 'status-grey'
}

export function formatStatus(status) {
  switch (status) {
    case 'refund_pending': return 'Refund pending'
    case 'refund_completed': return 'Refund completed'
    case 'awaiting_payment': return 'Awaiting payment'
    case 'payment_confirmed': return 'Payment confirmed'
    case 'awaiting_verification': return 'Awaiting verification'
    case 'preparing': return 'Preparing'
    case 'collected_by_runner': return 'Collected by runner'
    case 'delivered': return 'Delivered'
    case 'completed': return 'Completed'
    case 'cancelled': return 'Cancelled'
    default: return status
  }
}


