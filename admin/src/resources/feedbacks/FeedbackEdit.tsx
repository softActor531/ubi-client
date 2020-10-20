import * as React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
} from 'react-admin';

export const EventEdit = (props: any) => (
  <Edit {...props}>
    <SimpleForm warnWhenUnsavedChanges>
      <ReferenceInput label="Session" source="sessionId" reference="sessions" fullWidth>
        <SelectInput optionText="id" />
      </ReferenceInput>
      <NumberInput source="serviceRating" label="Service Rating" min='1' max='5' required />
      <NumberInput source="techRating" label="Technical Quality" min='1' max='5' required />
      <TextInput source="comments" fullWidth />
    </SimpleForm>
  </Edit>
);

export default EventEdit;

