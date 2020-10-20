import React, { useState } from 'react';
import {
  TabbedShowLayout,
  Tab,
  Show,
  TextField,
  // NumberField,
  // BooleanField,
  DateField,
  EmailField,
  EditButton,
  Datagrid,
  ReferenceManyField,
} from 'react-admin'

import {
  AppointmentModel,
  ViewState,
  EditingState,
  IntegratedEditing,
  SchedulerDateTime,
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
  ConfirmationDialog,
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

  const [data, setData] = useState<AppointmentModel[]>([]);

  const commitChanges = ({ added, changed, deleted }: any) => {

    console.log(props.id)

    //     allDay: false
// endDate: Fri Jul 17 2020 11:30:00 GMT-0700 (Pacific Daylight Time) {}
// id: NaN
// startDate: Fri Jul 17 2020 11:00:00 GMT-0700 (Pacific Daylight Time) {}
// title: undefined
// __proto__: Object

    if (added) {
      const startingAddedId = data.length > 0 ? data[data.length - 1].length + 1 : 0;
      setData([...data, { id: startingAddedId, ...added }])
    }

    if (changed) {
      let newData = data.map((appointment: any) => (
        changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment)
      );
      setData(newData)
    }

    if (deleted !== undefined) {
      let newData = data.filter(appointment => appointment.id !== deleted);
      setData(newData)
    }

    console.log(data)

    return data;
  }


  return (
    <Show {...props}>
      <TabbedShowLayout>
        <Tab label="summary">
          <TextField label="Id" source="id" />
            <TextField source="name" />
            <TextField label="Organization Name" source="organization.name" />
            <TextField source="location" />
            <TextField source="description" />
          </Tab>
          <Tab label="Users" path="users">
            <ReferenceManyField label="Users" reference="users" target="userIds" addLabel={false}>
              <Datagrid>
                <TextField source="firstName" />
                <TextField source="lastName" />
                <EmailField source="email" />
                {/* <EditButton /> */}
              </Datagrid>
            </ReferenceManyField>
          </Tab>
          <Tab label="Appointments" path="appointments">
            <ReferenceManyField reference="appointments" target="eventId" addLabel={false}>
              <Datagrid>
                <TextField source="event.name" />
                <TextField source="notes" />
                <DateField source="starts_on" />
                <DateField source="ends_on" />
                <EditButton />
              </Datagrid>
            </ReferenceManyField>
          </Tab>
          <Tab label="Calendar" path="calendar">
            <Scheduler
                data={data}
              >
              <ViewState
                // currentDate={currentDate}
                // onCurrentDateChange={setCurrentDate}
              />
              <EditingState
                onCommitChanges={commitChanges}
              />
              <IntegratedEditing />
              <WeekView
                startDayHour={10}
                endDayHour={19}
              />
              <DayView
                startDayHour={7}
                endDayHour={12}
              />
              <MonthView />
              <Toolbar />
              <DateNavigator />
              <TodayButton />
              <ViewSwitcher />
              <ConfirmationDialog />
              <Appointments />
              <AppointmentTooltip
                showCloseButton
                showOpenButton
              />
              <AppointmentForm />
              {/* <Resources
                data={resources}
              /> */}
            </Scheduler>
          </Tab>
        </TabbedShowLayout>
    </Show>
  )
}

export default EventShow;
