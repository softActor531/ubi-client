import * as React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  ShowButton,
  EditButton,
} from 'react-admin';

export const UserList = (props: any) => (
  <List {...props}>
      <Datagrid>
          {/* <TextField source="id" /> */}
          <TextField source="firstName" />
          <TextField source="lastName" />
          <EmailField source="email" />
          <TextField source="role" />
          <TextField source="verifiedDate" />
          <ShowButton basePath="/users" />
          <EditButton basePath="/users" />
      </Datagrid>
  </List>
);

export default UserList;
