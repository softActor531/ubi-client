import * as React from 'react';
import {
  Edit,
  SimpleForm,
  DateTimeInput,
  TextInput,
  BooleanInput,
  SelectInput,
  // ReferenceArrayInput,
  // SelectArrayInput,
  // ReferenceInput,
} from 'react-admin';

export const EventEdit = (props: any) => (
  <Edit {...props}>
    <SimpleForm warnWhenUnsavedChanges>
      <SelectInput source="timezone" choices={[
        { id: 'US/Eastern', name: 'Eastern Daylight Time' },
        { id: 'US/Central', name: 'Central Daylight Time' },
        { id: 'US/Mountain', name: 'Mountain Daylight Time' },
        { id: 'US/Arizona', name: 'MST/Phoenix' },
        { id: 'US/Pacific', name: 'Pacific Daylight Time' },
        { id: 'US/Alaska', name: 'Alaska Daylight Time' },
        { id: 'US/Hawaii', name: 'Hawaii Standard Time' },
      ]} />
      <DateTimeInput source="startDate" required />
      <DateTimeInput source="endDate" />
      <TextInput source="title"/>
      <BooleanInput source="allDay"/>
      <TextInput source="rrule"/>
      <TextInput source="exDate"/>
      <TextInput source="notes"/>

      {/* <ReferenceInput label="Organizations" source="organizationId" reference="organizations" fullWidth>
        <SelectInput optionText="name" />
      </ReferenceInput>

      <ReferenceArrayInput label="Users" source="userIds" reference="users" fullWidth>
        <SelectArrayInput optionText="email" />
      </ReferenceArrayInput> */}
    </SimpleForm>
  </Edit>
);

export default EventEdit;

