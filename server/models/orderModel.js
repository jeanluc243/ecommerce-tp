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

export async function getOrderById(db, id) {
  return db.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })
}

export async function updateOrder(db, id, data) {
  return db.order.update({
    where: { id },
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
