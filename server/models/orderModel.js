export async function createOrder(db, data) {
  return db.order.create({
    data,
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })
}

export async function listOrders(db) {
  return db.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}
