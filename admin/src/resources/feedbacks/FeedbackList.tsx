import * as React from 'react';
import {
  List,
  Datagrid,
  TextField,
  ShowButton,
  EditButton,
} from 'react-admin';

import StarRatingField from './StarRatingField'

export const EventList = (props: any) => (
  <List {...props}>
      <Datagrid>
        <StarRatingField source="serviceRating" label="Service Rating" size="small" />
        <StarRatingField source="techRating" label="Technical Quality" size="small" />
        <TextField source="comments" />
        <ShowButton basePath="/feedbacks" />
        <EditButton basePath="/feedbacks" />
      </Datagrid>
  </List>
);

export default EventList;
