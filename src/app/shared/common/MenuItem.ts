export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  permission? : boolean;
  id?:number;
  parentId? : number;
  subMenuItem?: MenuItem[];
};