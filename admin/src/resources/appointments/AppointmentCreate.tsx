import * as React from 'react';
import {
  Create,
  SimpleForm,
  DateTimeInput,
  TextInput,
  BooleanInput,
  SelectInput,
  ReferenceInput,
} from 'react-admin';

export const EventCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm warnWhenUnsavedChanges>
      <ReferenceInput label="Event" source="eventId" reference="events" fullWidth>
        <SelectInput optionText="name" />
      </ReferenceInput>
      <TextInput source="title"/>
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
  </Create>
);

export default EventCreate;
