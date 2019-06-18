import { IViewGroup } from "./view-group.model";

export interface IBookmark {
  id: string;
  name: string;
  pageNumber: number;
  description?: string;
  updatedAt?: Date;
  viewGroup: IViewGroup;
}
