import * as React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
  ReferenceInput,
  SelectInput,
} from 'react-admin';

export const EventEdit = (props: any) => (
  <Edit {...props}>
      <SimpleForm warnWhenUnsavedChanges>
          <TextInput source="name" required fullWidth />
          <TextInput source="location" fullWidth />
          <TextInput source="description" fullWidth />

          <ReferenceInput label="Organization" source="organizationId" reference="organizations" fullWidth>
            <SelectInput optionText="name" />
          </ReferenceInput>

          <ReferenceArrayInput label="Users" source="userIds" reference="users" fullWidth>
            <SelectArrayInput optionText="email" />
          </ReferenceArrayInput>
      </SimpleForm>
  </Edit>
);

export default EventEdit;

