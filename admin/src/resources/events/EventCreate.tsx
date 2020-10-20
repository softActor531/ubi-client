import * as React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput,
  ReferenceInput,
} from 'react-admin';

export const EventCreate = (props: any) => (
  <Create {...props}>
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
  </Create>
);

export default EventCreate;
