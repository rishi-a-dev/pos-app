export const ordersSlice = (set) => ({
  orderList: [],

  // Update an order based on index
  updateOrder: (index, updatedOrder) =>
    set((state) => ({
      orderList: state.orderList.map((order, idx) =>
        idx === index ? { ...order, ...updatedOrder } : order
      ),
    })),

  // Add a new order
  addNewOrder: (newOrder) =>
    set((state) => ({
      orderList: [newOrder, ...state.orderList],
    })),

  // Remove an order based on orderIndex
  removeOrder: (orderIndex) =>
    set((state) => ({
      orderList: state.orderList.filter((_, idx) => idx !== orderIndex),
    })),

  // Add an item to an order based on order index
  addItem: (orderIndex, newItem) =>
    set((state) => ({
      orderList: state.orderList.map((order, idx) =>
        idx === orderIndex
          ? { ...order, items: [...order.items, newItem] }
          : order
      ),
    })),

  // Remove an item from an order based on order index and item id
  removeItem: (orderIndex, itemId) =>
    set((state) => ({
      orderList: state.orderList.map((order, idx) =>
        idx === orderIndex
          ? {
              ...order,
              items: order.items.filter((item) => item.uuid !== itemId),
            }
          : order
      ),
    })),

  // Update an item in an order based on order index and item id
  updateItem: (orderIndex, itemId, updatedItem) =>
    set((state) => ({
      orderList: state.orderList.map((order, idx) =>
        idx === orderIndex
          ? {
              ...order,
              items: order.items.map((item) =>
                item.uuid === itemId
                  ? {
                      ...item,
                      ...updatedItem,
                    }
                  : item
              ),
            }
          : order
      ),
    })),

  // Remove all items from an order based on order index
  removeAllItems: (orderIndex) =>
    set((state) => ({
      orderList: state.orderList.map((order, idx) =>
        idx === orderIndex ? { ...order, items: [] } : order
      ),
    })),

  // Increase the quantity of an item in an order
  increaseItemQuantity: (orderIndex, itemId) =>
    set((state) => ({
      orderList: state.orderList.map((order, idx) => {
        if (idx === orderIndex) {
          const updatedItems = order.items
            .map((item) =>
              item.uuid === itemId ? { ...item, qty: item.qty + 1 } : item
            )
            .filter((item) => item.uuid !== itemId);

          const movedItem = order.items.find((item) => item.uuid === itemId);

          return {
            ...order,
            items: [...updatedItems, { ...movedItem, qty: movedItem.qty + 1 }],
          };
        }
        return order;
      }),
    })),

  // Decrease the quantity of an item in an order
  decreaseItemQuantity: (orderIndex, itemId) =>
    set((state) => ({
      orderList: state.orderList.map((order, idx) => {
        if (idx === orderIndex) {
          const updatedItems = order.items
            .map((item) =>
              item.uuid === itemId && item.qty > 1
                ? { ...item, qty: Math.max(item.qty - 1, 1) }
                : item
            )
            .filter((item) => item.uuid !== itemId);

          const movedItem = order.items.find((item) => item.uuid === itemId);

          return {
            ...order,
            items: [
              ...updatedItems,
              { ...movedItem, qty: Math.max(movedItem.qty - 1, 1) },
            ],
          };
        }
        return order;
      }),
    })),

  // Add description and unit to an item in an order
  addItemDetails: (orderIndex, itemId, rate, description, unit) =>
    set((state) => ({
      orderList: state.orderList.map((order, idx) =>
        idx === orderIndex
          ? {
              ...order,
              items: order.items.map((item) =>
                item.uuid === itemId
                  ? {
                      ...item,
                      rate,
                      description,
                      unit,
                    }
                  : item
              ),
            }
          : order
      ),
    })),
});
