import * as React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput,
  ReferenceInput,
  TabbedForm,
  FormTab,
} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  inlineBlock: { display: 'inline-flex', marginRight: '1rem' },
});

export const OrganizationCreate = (props: any) => {
  const classes = useStyles();
  return (
  <Create {...props}>
      <TabbedForm warnWhenUnsavedChanges>
        <FormTab label="summary">
          <TextInput source="name" fullWidth required />
          <TextInput source="website" fullWidth />

          <TextInput source="portalName" required formClassName={classes.inlineBlock} />

          <SelectInput source="timezone" required formClassName={classes.inlineBlock} choices={[
              { id: 'US/Eastern', name: 'Eastern Daylight Time' },
              { id: 'US/Central', name: 'Central Daylight Time' },
              { id: 'US/Mountain', name: 'Mountain Daylight Time' },
              { id: 'US/Arizona', name: 'MST/Phoenix' },
              { id: 'US/Pacific', name: 'Pacific Daylight Time' },
              { id: 'US/Alaska', name: 'Alaska Daylight Time' },
              { id: 'US/Hawaii', name: 'Hawaii Standard Time' },
          ]} />

          <ReferenceInput label="Owner" required source="userId" reference="users">
            <SelectInput optionText="email" />
          </ReferenceInput>
        </FormTab>

        <FormTab label="Users">
          <ReferenceArrayInput label="Users" source="userIds" reference="users" fullWidth>
            <SelectArrayInput optionText="email" />
          </ReferenceArrayInput>
        </FormTab>

        <FormTab label="Contact">
          <TextInput source="streetAddress" fullWidth />
          <TextInput source="streetAddress2" fullWidth />
          <TextInput source="city" formClassName={classes.inlineBlock} />
          <TextInput source="state" formClassName={classes.inlineBlock} />
          <TextInput source="postalCode" formClassName={classes.inlineBlock} />
          <TextInput source="country" />

          <TextInput source="phoneNumber" fullWidth />
          <TextInput source="mobileNumber" fullWidth />
          <TextInput source="faxNumber" fullWidth />

          <TextInput source="notes" multiline fullWidth />
        </FormTab>

        <FormTab label="Billing">
          <TextInput label="Billing Organization Name" source="billingOrgName" fullWidth />
          <TextInput source="billingPrimaryEmail" fullWidth />
          <TextInput source="billingPurchaseOrderNumber" fullWidth />

          <TextInput source="billingAttentionTo" fullWidth />
          <TextInput source="billingAddress" fullWidth />
          <TextInput source="billingAddress2" fullWidth />
          <TextInput source="billingCity" formClassName={classes.inlineBlock} />
          <TextInput source="billingState" formClassName={classes.inlineBlock} />
          <TextInput source="billingPostalCode" formClassName={classes.inlineBlock} />
        </FormTab>
      </TabbedForm>
  </Create>
  )
}

export default OrganizationCreate;
