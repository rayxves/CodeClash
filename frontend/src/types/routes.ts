export type RouteParams = {
  [key: string]: string | undefined;
};

export interface CategoryPageParams extends RouteParams {
  language: string;
  category: string;
}

export interface CodeModalParams extends RouteParams {
  id: string;
  name: string;
}
