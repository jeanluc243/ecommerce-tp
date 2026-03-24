export function presentOrder(order) {
  return {
    id: order.id,
    customerPhone: order.customerPhone,
    totalAmount: Number(order.totalAmount),
    status: order.status ?? 'PENDING',
    validatedAt: order.validatedAt,
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      productId: item.productId,
      productName: item.product?.name ?? null,
    })),
  }
}
