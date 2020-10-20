import * as React from 'react';
import {
  List,
  Datagrid,
  TextField,
  ShowButton,
  EditButton,
} from 'react-admin';

export const EventList = (props: any) => (
  <List {...props}>
      <Datagrid>
          <TextField source="name" />
          <TextField label="Org. Name" source="organization.name" />
          <TextField source="location" />
          <TextField source="description" />
          <ShowButton basePath="/events" />
          <EditButton basePath="/events" />
      </Datagrid>
  </List>
);

export default EventList;
