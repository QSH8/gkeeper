export class MenuRequestDTO {
  constructor(data) {
    this.id = data.id;
  }
}

export class MenuResponseDTO {
  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.price = Number(row.price);
    this.category = row.category;
    this.subCategory = row.sub_category;
    this.isAvailable = row.is_available;
    this.ingredients = row.ingredients;
  }
}