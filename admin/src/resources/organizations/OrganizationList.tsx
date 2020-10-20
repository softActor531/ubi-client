import * as React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  ShowButton,
  EditButton,
  ReferenceManyField,
  SingleFieldList,
  ChipField,
} from 'react-admin';

export const OrganizationList = (props: any) => (
  <List {...props}>
      <Datagrid>
          {/* <TextField source="id" /> */}
          <TextField source="name" />
          <TextField source="city" />
          <TextField source="state" />
          <TextField source="timezone" />
          <TextField source="phoneNumber" />
          <ReferenceManyField label="Users" reference="users" target="userIds">
            <SingleFieldList>
                <ChipField source="firstName" />
            </SingleFieldList>
          </ReferenceManyField>
          <ShowButton basePath="/organizations" />
          <EditButton basePath="/organizations" />
      </Datagrid>
  </List>
);

export default OrganizationList;
