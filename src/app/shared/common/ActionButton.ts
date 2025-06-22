
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
