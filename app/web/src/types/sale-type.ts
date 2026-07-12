export interface SaleResponse {
  status: string;
  message: string;
  data: {
    sale: {
      id: number;
      customerId: number;
      paymentMethodId: number;
      userId: number;
      saleItem: SaleItem[]
    }
  }
}

export interface SaleItem {
	id: number,
	description: string,
	barcode: string,
	quantity: number,
	costPrice: number,
	salePrice: number,
	totalPrice: number,
	date: Date,
	saleId:number,
	productId: number
}

export interface SaleData {
  document: string;
  cashier: number;
  payment: number;
  items: SaleDataItem[]
}

export interface SaleDataItem {
  barcode: string;
  quantity: number
}
