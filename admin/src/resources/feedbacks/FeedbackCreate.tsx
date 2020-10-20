import * as React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  NumberInput,
  ReferenceInput,
} from 'react-admin';

export const EventCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm warnWhenUnsavedChanges>
      <ReferenceInput label="Session" source="sessionId" reference="sessions" fullWidth>
        <SelectInput optionText="id" />
      </ReferenceInput>
      <NumberInput source="serviceRating" label="Service Rating" min='1' max='5' required />
      <NumberInput source="techRating" label="Technical Quality" min='1' max='5' required />
      <TextInput source="comments" fullWidth />
    </SimpleForm>
  </Create>
);

export default EventCreate;
