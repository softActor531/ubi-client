import * as React from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  ShowButton,
} from 'react-admin';

export const EventList = (props: any) => (
  <List {...props}>
    <Datagrid>
      <TextField source="status" />
      <TextField source="date" />
      <BooleanField source="audioReady" />
      <BooleanField source="transcriptReady" />
      <BooleanField source="editedTranscriptReady" />
      <BooleanField source="summaryReady" />
      <BooleanField source="isBilled" />
      <ShowButton basePath="/sessions" />
    </Datagrid>
  </List>
);

export default EventList;
