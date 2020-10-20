import * as React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  PasswordInput,
  ReferenceArrayInput,
  SelectArrayInput,
  SelectInput,
} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

// import RRRuleGenerator from 'rrrule-generator';

const useStyles = makeStyles({
  inlineBlock: { display: 'inline-flex', marginRight: '1rem' },
});

export const UserCreate = (props: any) => {
  const classes = useStyles();
  return (
    <Create title="Create a User" {...props}>
      <SimpleForm warnWhenUnsavedChanges>
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

        {/* <RRRuleGenerator
          onChange={(rrule:any) => console.log(`RRule changed, now it's ${rrule}`)}
          config={{
            repeat: ['Monthly', 'Weekly'],
            monthly: 'on',
            end: ['On date'],
            // weekStartsOnSunday: true,
            // hideError: true,
          }}
        /> */}
      </SimpleForm>
    </Create>
  )
}

export default UserCreate;
