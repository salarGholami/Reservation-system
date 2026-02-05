// src/modules/budget/domain/entities/category.entity.ts

export type CategoryType = "income" | "expense";

export interface CategoryProps {
  id: string;
  name: string;
  type: CategoryType;
  color: string;
  isSystem: boolean;
}

export class Category {
  public readonly id: string;
  public readonly name: string;
  public readonly type: CategoryType;
  public readonly color: string;
  public readonly isSystem: boolean;

  private constructor(props: CategoryProps) {
    this.id = props.id;
    this.name = props.name;
    this.type = props.type;
    this.color = props.color;
    this.isSystem = props.isSystem;
  }

  static create(props: CategoryProps): Category {
    if (!props.name.trim()) {
      throw new Error("Category name is required");
    }

    return new Category(props);
  }
}
