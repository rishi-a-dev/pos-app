export const createPostOrderItem = (menuItem) => {
  const { items } = menuItem;

  return {
    transactionId: items?.transactionId || null,
    itemId: items?.id,
    itemCode: items?.itemCode,
    itemName: items?.itemName,
    unit: {
      unit: items?.unit || null,
      basicUnit: items?.basicUnit || null,
      factor: items?.factor || null,
    },
    barCode: items?.barCode || null,
    sellingPrice: items?.sellingPrice || 0,
    arabicName: items?.arabicName || null,
    taxTypeID: items?.taxTypeID || 0,
    taxPerc: items?.taxPerc || 0,
    categoryID: items?.categoryID || 0,
    commodityID: items?.commodityID || 0,
    taxAccountID: items?.taxAccountID || 0,
    imagePath: items?.imagePath || null,
    shipMark: items?.shipMark || null,
    paintMark: items?.paintMark || null,
    qty: 1,
    rate: items?.rate || 0,
    description: items?.description || "",
    discountAmt: 0,
    discountPerc: items?.discountPerc || 0,
  };
};
