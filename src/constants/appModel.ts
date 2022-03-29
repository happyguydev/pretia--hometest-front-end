export interface AppModel {
  id: string;
  title: string;
  type: string;
  description: string;
}

export interface AppListResponse {
  applist: AppModel[]
}