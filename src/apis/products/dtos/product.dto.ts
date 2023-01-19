export class CreateProductDto {
  name: string;
  cost: number;
}

export class UpdateProductDto {
  name?: string;
  cost?: number;
}

export class ValidatePatchProduct {
  sellerId: string;
  productId: string;
  data: UpdateProductDto;
}
