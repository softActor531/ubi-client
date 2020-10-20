import * as React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  PasswordInput,
  ReferenceArrayInput,
  SelectArrayInput,
  SelectInput,
} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  inlineBlock: { display: 'inline-flex', marginRight: '1rem' },
});

const UserTitle = ({ record }: any) => {
  return <span>User {record ? `"${record.name}"` : ''}</span>;
};

export const UserEdit = (props: any) => {
  const classes = useStyles();
  return (
    <Edit title={<UserTitle />} {...props}>
      <SimpleForm warnWhenUnsavedChanges>
          <TextInput disabled source="id" fullWidth />

          <TextInput source="firstName" formClassName={classes.inlineBlock} />
          <TextInput source="lastName" formClassName={classes.inlineBlock} />

          <TextInput source="email" />

          <PasswordInput source="password" inputProps={{ autoComplete: 'off' }} />

          <SelectInput source="role" choices={[
              { id: 'member', name: 'Member' },
              { id: 'manager', name: 'Manager' },
              { id: 'admin', name: 'Admin' },
          ]} />

          <ReferenceArrayInput label="Organizations" source="organizationIds" reference="organizations" fullWidth>
            <SelectArrayInput optionText="name" />
          </ReferenceArrayInput>
      </SimpleForm>
    </Edit>
  );
}

export default UserEdit;

