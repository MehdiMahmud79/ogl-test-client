import { FormOptions, SchemaOrSchemaFn } from "@angular/forms/signals";

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
  formSchema: SchemaOrSchemaFn<T, any> | FormOptions<T>;
  fields: FormFieldConfig<T>[];
};
