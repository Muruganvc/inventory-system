
export interface TableColumn {
  field: string;
  header: string;
  type: 'text' | 'input' | 'select' | 'checkbox' | 'date' | 'button' | 'actions';
  options?: { label: string; value: any }[]; // For 'select'
  visible?: boolean;
  editable?: boolean;
  align?: 'left' | 'right' | 'center';
  buttons?: ActionButton[]; // Only for actions
}

export interface ActionButton {
  icon?: string;
  label: string;
  color?: string;
  action: (row: any) => void;
}

export interface ActionButtons {
  label: string;
  icon?: string;
  class: string;
  callback: (args?: any) => void;
  params?: any;
  disabled?: boolean;
  validate: boolean; 
  isHidden: boolean;
}

export interface TableColumns<T extends Record<string, T>> {
  key: keyof T;
  label: string;
  type?: 'text' | 'input' | 'select' | 'checkbox' | 'date' | 'button' | 'actions';
  editable?: boolean;
  options?: { label: string; value: T[keyof T] }[];
  width?: string;
  align?: 'left' | 'center' | 'right';
}