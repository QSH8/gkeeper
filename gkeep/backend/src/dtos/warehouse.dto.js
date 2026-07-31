// getWarehouse
export class WarehouseRequestDTO {
  constructor(data) {
    this.id = data.id;
  }
}

export class WarehouseResponseDTO {
  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.quantity = row.quantity;
    this.units = row.units;
  }
}


// CreateWarehouse
export class WarehouseCreateRequestDTO {
  constructor(body) {
    this.name = body.name;
    this.quantity = body.quantity !== undefined ? parseInt(body.quantity, 10) : 0; 
    this.units = body.units;
  }
}

export class WarehouseCreateResponseDTO {
  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.quantity = row.quantity;
    this.units = row.units;
  }
}


// UpdateWarehouse
export class WarehouseUpdateRequestDTO {
  constructor(body, id) {
    this.id = body.id;
    this.name = body.name;
    this.quantity = body.quantity !== undefined ? parseInt(body.quantity, 10) : 0; 
    this.units = body.units;
  }
}

export class WarehouseUpdateResponseDTO {
  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.quantity = row.quantity;
    this.units = row.units;
  }
}