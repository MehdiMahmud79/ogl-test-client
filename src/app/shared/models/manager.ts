export enum ActionMode {
  CREATE = 'create',
  EDIT = 'edit',
}
export type FormFieldConfig<T> = {
  key: keyof T;
  label: string;
  type: 'text' | 'number' | 'textarea';
  placeholder: string;
};
export type FormDialogData<T> = {
  model: T;
  mode: ActionMode;
  formSchema: any;
  fields: FormFieldConfig<T>[];
};
