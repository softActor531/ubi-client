import * as React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  BooleanField,
  ShowButton,
  EditButton,
} from 'react-admin';

export const EventList = (props: any) => (
  <List {...props}>
    <Datagrid>
      <TextField source="event.name" label="Event Name" />
      <DateField source="startDate" />
      <DateField source="endDate" />
      <TextField source="timezone" />
      <BooleanField source="allDay" />
      <TextField source="rrule" label="Recurring Rule" />
      <TextField source="exDate" label="Exception Dates" />
      <ShowButton basePath="/appointments" />
      <EditButton basePath="/appointments" />
    </Datagrid>
  </List>
);

export default EventList;
