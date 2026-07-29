// getOrder
export class OrderRequestDTO {
  constructor(body) {
    this.id = body.id;
  }
}

export class OrderResponseDTO {
  constructor(row) {
    this.id = row.id;
    this.items = row.items || [];
    this.price = row.price;
    this.status = row.status;
    this.comments = row.comments;
    this.createdAt = row.created_at;
    this.modifiedAt = row.modified_at;
    this.finishedAt = row.finished_at;
    this.customerName = row.customer_name;
    this.paymentMethod = row.payment_method;
    this.createdBy = row.created_by;
    this.finishedBy = row.finished_by;
    this.modifiedBy = row.modified_by;
    this.isPriority = row.is_priority;
  }
}

// CreateOrder
export class OrderCreateRequestDTO {
  constructor(body, userId) {
    this.customer_name = body.customerName;
    this.comments = body.comments || '';
    this.payment_method = body.paymentMethod;
    this.is_priority = body.isPriority || false;
    this.items = body.items || []; 
    this.created_by = userId;
    this.modified_by = userId;
  }
}

export class OrderCreateResponseDTO {
  constructor(row) {
    this.id = row.id;
    // this.customerName = row.customer_name;
    // this.status = row.status;
    // this.comments = row.comments || '';
    // this.paymentMethod = row.payment_method;
    // this.isPriority = row.is_priority;
    // this.createdAt = 'date';
    // this.createdBy = row.created_by;
    // this.modifiedAt = 'date';
    // this.modifiedBy = row.modified_by;
    // this.finishedAt = row.finished_at;
    // this.finishedBy = row.finished_by;
  }
}

// UpdateOrder
export class OrderUpdateRequestDTO {
  constructor(body, userId) {
    this.customer_name = body.customerName;
    this.comments = body.comments || '';
    this.payment_method = body.paymentMethod;
    this.is_priority = body.isPriority || false;
    this.items = body.items || [];
    this.created_at = '';
    this.created_by = '';
    this.modified_at = '';
    this.modified_by = userId;
    this.finished_at = '';
    this.finished_by = '';
  }
}

export class OrderUpdateResponseDTO {
  constructor(row) {
    this.id = row.id;
  }
}