import FullCalendar, {
  DateSelectArg,
  EventClickArg,
  EventDropArg,
  EventInput
} from '@fullcalendar/react'; // => request placed at the top
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useState, useRef, useEffect } from 'react';
// material
import { useTheme } from '@material-ui/core/styles';
import {
  Card,
  Button,
  Container,
  Dialog,
  DialogTitle,
  useMediaQuery,
  makeStyles
} from '@material-ui/core';
// redux
import useAuth from '../../hooks/useAuth';
import { RootState, useDispatch, useSelector } from '../../redux/store';
import {
  getEvents,
  openModal,
  closeModal,
  updateEvent,
  selectEvent,
  selectRange
} from '../../redux/slices/calendar';
import { getBatchList, getAllUserByID } from '../../redux/slices/lists';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  AdminCalendarForm,
  CalendarStyle,
  CalendarToolbar,
  SlotsCalendarForm
} from '../../components/_dashboard/calendar';
import ResourceModal from './AddResources';
import AssignmentModal from './AddAssignment';
import { CalendarView } from '../../@types/calendar';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  calenderHeader: {
    display: 'flex'
  }
}));

const selectedEventSelector = (state: RootState) => {
  const { events, selectedEventId } = state.calendar;
  if (selectedEventId) {
    return events.find((_event) => _event.id === selectedEventId);
  }
  return null;
};

const getViewByUserRole = (userRole: string) => {
  switch (userRole) {
    case 'Mentor':
      return 'timeGridWeek';
    default:
      return 'dayGridMonth';
  }
};

export default function Calendar() {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const calendarRef = useRef<FullCalendar>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(
    isMobile ? 'listWeek' : getViewByUserRole(user?.role)
  );
  const [refresh, setRefresh] = useState(false);
  const selectedEvent = useSelector(selectedEventSelector);
  const { events, isOpenModal, selectedRange } = useSelector((state: RootState) => state.calendar);
  const { batchList, userList } = useSelector((state: RootState) => state.list);

  useEffect(() => {
    if (user?.role !== 'Student') {
      dispatch(getBatchList(user?.id));
      dispatch(getAllUserByID(user?.id));
    }
    dispatch(getEvents(user?.role === 'Super Admin' ? null : user?.id));
    setRefresh(false);
  }, [dispatch, user?.id, user?.role, refresh]);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = isMobile ? 'listWeek' : getViewByUserRole(user?.role);
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isMobile]);

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleChangeView = (newView: CalendarView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleSelectRange = (arg: DateSelectArg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }
    dispatch(selectRange(arg.start, arg.end));
  };

  const handleSelectEvent = (arg: EventClickArg) => {
    dispatch(selectEvent(arg.event.id));
  };

  const handleResizeEvent = async ({ event }: EventResizeDoneArg) => {
    // try {
    //   dispatch(
    //     updateEvent(event.id, {
    //       ...event,
    //       eventStart: new Date(event?.start),
    //       eventEnd: event.end
    //     })
    //   );
    //   enqueueSnackbar('Update event success', { variant: 'success' });
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const handleDropEvent = async ({ event }: EventDropArg) => {
    try {
      dispatch(
        updateEvent(event.id, {
          ...event,
          eventStart: event.startStr,
          eventEnd: event.endStr
        })
      );
      enqueueSnackbar('Update event success', {
        variant: 'success'
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddEvent = () => {
    dispatch(openModal());
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  return (
    <Page title="Calendar">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Calendar"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Calendar' }]}
          action={
            user?.role !== 'Student' ? (
              <Button
                variant="contained"
                startIcon={<Icon icon={plusFill} width={20} height={20} />}
                onClick={handleAddEvent}
              >
                {user?.role === 'Mentor' ? 'Add Slot' : 'New Event'}
              </Button>
            ) : null
          }
        />

        <Card>
          <CalendarStyle>
            <CalendarToolbar
              date={date}
              view={view}
              onNextDate={handleClickDateNext}
              onPrevDate={handleClickDatePrev}
              onToday={handleClickToday}
              onChangeView={handleChangeView}
            />
            <FullCalendar
              weekends
              editable
              droppable
              selectable
              events={events}
              ref={calendarRef}
              rerenderDelay={10}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              headerToolbar={false}
              allDayMaintainDuration
              eventResizableFromStart
              select={handleSelectRange}
              eventDrop={handleDropEvent}
              eventClick={handleSelectEvent}
              eventResize={handleResizeEvent}
              height={isMobile ? 'auto' : 720}
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin
              ]}
            />
          </CalendarStyle>
        </Card>
        {(user?.role === 'Admin' || user?.role === 'Super Admin') && (
          <Dialog open={isOpenModal} onClose={handleCloseModal}>
            <DialogTitle>{selectedEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
            <AdminCalendarForm
              role={user?.role}
              event={selectedEvent || {}}
              range={selectedRange}
              onCancel={handleCloseModal}
              batchList={batchList}
              setRefresh={setRefresh}
            />
          </Dialog>
        )}

        {user?.role === 'Student' &&
          selectedEvent &&
          Object.keys(selectedEvent).length > 0 &&
          selectedEvent?.eventType === 'masterclass' && (
            <Dialog open={isOpenModal} onClose={handleCloseModal}>
              <DialogTitle>View Event</DialogTitle>
              <AdminCalendarForm
                role={user?.role}
                event={selectedEvent || {}}
                range={selectedRange}
                onCancel={handleCloseModal}
                batchList={batchList}
                setRefresh={setRefresh}
              />
            </Dialog>
          )}

        {user?.role === 'Student' &&
          selectedEvent &&
          Object.keys(selectedEvent).length > 0 &&
          selectedEvent?.eventType === 'slot' && (
            <Dialog open={isOpenModal} onClose={handleCloseModal}>
              <DialogTitle>{selectedEvent ? 'Edit Slot' : 'Add Slot'}</DialogTitle>
              <SlotsCalendarForm
                role={user?.role}
                event={selectedEvent || {}}
                range={selectedRange}
                onCancel={handleCloseModal}
                batchList={userList}
                setRefresh={setRefresh}
              />
            </Dialog>
          )}

        {user?.role === 'Mentor' && (
          <Dialog open={isOpenModal} onClose={handleCloseModal}>
            <DialogTitle>{selectedEvent ? 'Edit Slot' : 'Add Slot'}</DialogTitle>
            <SlotsCalendarForm
              role={user?.role}
              event={selectedEvent || {}}
              range={selectedRange}
              onCancel={handleCloseModal}
              batchList={userList}
              setRefresh={setRefresh}
            />
          </Dialog>
        )}
      </Container>
    </Page>
  );
}
