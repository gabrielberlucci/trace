export interface ServiceOrder {
  date: Date;
  document: string;
  items: ServiceOrderItem[];
}

interface ServiceOrderItem {
  date: Date;
  description: string;
  hours: number;
  hourlyRate: number;
}
