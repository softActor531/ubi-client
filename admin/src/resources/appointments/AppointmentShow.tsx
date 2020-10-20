import * as React from 'react';
import {
  TabbedShowLayout,
  Tab,
  Show,
  TextField,
  // NumberField,
  // BooleanField,
  DateField,
  EditButton,
  Datagrid,
  ReferenceManyField,
} from 'react-admin'

import {
  AppointmentModel,
  ViewState,
  SchedulerDateTime
} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  WeekView,
  MonthView,
  Appointments,
  Resources,
  Toolbar,
  ViewSwitcher,
  DateNavigator,
  TodayButton,
  AppointmentTooltip,
  AppointmentForm,
} from '@devexpress/dx-react-scheduler-material-ui';

const appointments: Array<AppointmentModel> = [{
  startDate: '2018-10-31T10:00',
  endDate: '2018-10-31T11:15',
  title: 'Meeting',
  type: 'private',
}, {
  startDate: '2018-10-31T07:30',
  endDate: '2018-10-31T09:00',
  title: 'Go to a gym',
  type: 'work',
}];
const resources = [{
  fieldName: 'type',
  title: 'Type',
  instances: [
    { id: 'private', text: 'Private', color: '#EC407A' },
    { id: 'work', text: 'Work', color: '#7E57C2' },
  ],
}];


export const EventShow = (props: any) => {
  const [currentDate, setCurrentDate] = React.useState<SchedulerDateTime>('2018-10-31');
  return (
    <Show {...props}>
      <TabbedShowLayout>
        <Tab label="summary">
          <TextField label="Id" source="id" />
          <TextField source="name" />
          <TextField source="location" />
          <TextField source="description" />
        </Tab>
        <Tab label="Agents" path="agents">
          <ReferenceManyField label="Users" reference="users" target="userIds" addLabel={false}>
            <Datagrid>
              <TextField source="firstName" />
              <TextField source="lastName" />
              <TextField source="email" />
              {/* <EditButton /> */}
            </Datagrid>
          </ReferenceManyField>
        </Tab>
        {/* <Tab label="Appointments" path="appointments">
          <ReferenceManyField reference="appointments" target="eventId" addLabel={false}>
            <Datagrid>
              <TextField source="event.name" />
              <TextField source="notes" />
              <DateField source="starts_on" />
              <DateField source="ends_on" />
              <EditButton />
            </Datagrid>
          </ReferenceManyField>

            <Scheduler
              data={appointments}
            >
              <ViewState
                currentDate={currentDate}
                onCurrentDateChange={setCurrentDate}
              />
              <DayView
                startDayHour={7}
                endDayHour={12}
              />
              <WeekView
                startDayHour={10}
                endDayHour={19}
              />

              <MonthView />


              <Toolbar />
              <DateNavigator />
              <TodayButton />
              <ViewSwitcher />
              <Appointments />
              <AppointmentTooltip
                showCloseButton
                showOpenButton
              />
              <AppointmentForm />
              <Resources
                data={resources}
              />
            </Scheduler>

        </Tab> */}
        {/* <Tab label="comments" path="comments">
            <ReferenceManyField reference="comments" target="post_id" addLabel={false}>
                <Datagrid>
                    <TextField source="body" />
                    <DateField source="created_at" />
                    <EditButton />
                </Datagrid>
            </ReferenceManyField>
        </Tab> */}
      </TabbedShowLayout>
    </Show>
  );
}

export default EventShow;
