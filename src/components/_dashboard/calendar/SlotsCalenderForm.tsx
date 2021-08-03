import { useRef, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { merge } from 'lodash';
import { isBefore, add } from 'date-fns';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import { useFormik, Form, FormikProvider } from 'formik';
import {
  Box,
  Button,
  Switch,
  Tooltip,
  TextField,
  IconButton,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Stack
} from '@material-ui/core';
import { LoadingButton, MobileDateTimePicker } from '@material-ui/lab';
import { EventInput } from '@fullcalendar/common';
// hooks
import useAuth from '../../../hooks/useAuth';
// redux
import { RootState, useDispatch, useSelector } from '../../../redux/store';
import { createEvent, updateEvent, deleteEvent } from '../../../redux/slices/calendar';
//
import { BatchManager, UserManager } from '../../../@types/common';
import { AuthUser } from '../../../@types/authentication';

// ----------------------------------------------------------------------

const getInitialValues = (
  event: EventInput,
  range: { start: Date; end: Date } | null,
  user: UserManager | AuthUser
) => {
  // eslint-disable-next-line no-underscore-dangle
  const _event = {
    title: '1:1 with Mentor',
    description: '',
    textColor: '#1890FF',
    allDay: false,
    start: range ? new Date(range.start) : new Date(),
    end: range ? new Date(range.end) : new Date(),
    // end: range ? add(new Date(range.end), { hours: 1 }) : new Date(),
    eventType: 'slot',
    organiserId: user?.id,
    organiserName: user?.name,
    hasAssignment: false,
    attendees: [],
    hasBooked: false
  };

  if (event || range) {
    return merge({}, _event, event);
  }

  return _event;
};

// ----------------------------------------------------------------------

type CalendarFormProps = {
  event: EventInput;
  range: {
    start: Date;
    end: Date;
  } | null;
  onCancel: VoidFunction;
  batchList: UserManager[];
  setRefresh?: any;
  role: string | undefined;
};

export default function SlotsCalendarForm({
  event,
  range,
  onCancel,
  batchList,
  setRefresh,
  role
}: CalendarFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isCreating = !event;
  const submitRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  const [batchId, setBatchId] = useState<any[]>([]);

  useEffect(() => {
    if (batchList?.length > 0) {
      const obj = {
        batchMember: batchList
      };
      setBatchId([{ ...obj }]);
    }
  }, [batchList]);

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Event Name is required'),
    description: Yup.string().max(5000),
    attendees: Yup.mixed(),
    hasAssignment: Yup.boolean().required('Assignment is required'),
    start: Yup.string().required('Start Date & Time is required'),
    end: Yup.string().required('End Date & Time is required')
  });

  // useEffect(() => {
  //   if (submitRef) {
  //     submitRef?.current?.click();
  //   }
  // }, [submitRef]);

  const formik = useFormik({
    initialValues: getInitialValues(event, range, user),
    validationSchema: EventSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setLoading(false);
      try {
        const newEvent = {
          eventName: values.title,
          eventDescription: values.title,
          eventType: values.eventType,
          eventColor: values.textColor,
          eventStart: values.start,
          eventEnd: values.end,
          organiserId: user?.id,
          organiserName: user?.name,
          hasAssignment: values.hasAssignment,
          attendees: role === 'Student' ? event?.attendees : batchId || values.attendees,
          hasBooked: values.hasBooked
        };
        if (event.id) {
          dispatch(updateEvent(event.id, newEvent)).then((response) => {
            if (response?.data?.statusCode) {
              enqueueSnackbar('Update event success', { variant: 'success' });
              setLoading(false);
            }
          });
        } else {
          dispatch(createEvent(newEvent)).then((response) => {
            if (response?.data?.statusCode) {
              enqueueSnackbar('Create event success', { variant: 'success' });
              setLoading(false);
            }
          });
        }
        resetForm();
        onCancel();
        setSubmitting(false);
        if (setRefresh) {
          setRefresh(true);
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    }
  });

  const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } =
    formik;

  const isDateError = isBefore(new Date(values.end), new Date(values.start));

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <DialogContent sx={{ pb: 0, overflowY: 'unset' }}>
          <TextField
            fullWidth
            disabled={role === 'Student'}
            label="Title"
            {...getFieldProps('title')}
            error={Boolean(touched.title && errors.title)}
            helperText={touched.title && errors.title}
            sx={{ mb: 3 }}
          />

          <FormControlLabel
            disabled={role === 'Student'}
            control={<Switch checked={values.hasAssignment} {...getFieldProps('hasAssignment')} />}
            label="Assignment"
            sx={{ mb: 3 }}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
            <MobileDateTimePicker
              disabled={role === 'Student'}
              label="Start date"
              value={values.start}
              inputFormat="dd/MM/yyyy hh:mm a"
              onChange={(date) => setFieldValue('start', date)}
              renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 3 }} />}
            />

            <MobileDateTimePicker
              label="End date"
              disabled={role === 'Student'}
              value={values.end}
              inputFormat="dd/MM/yyyy hh:mm a"
              onChange={(date) => setFieldValue('end', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={Boolean(isDateError)}
                  helperText={isDateError && 'End date must be later than start date'}
                  sx={{ mb: 3 }}
                />
              )}
            />
          </Stack>
          {role === 'Student' && (
            <FormControlLabel
              control={<Switch checked={values.hasBooked} {...getFieldProps('hasBooked')} />}
              label="Book Event"
              sx={{ mb: 3 }}
            />
          )}
        </DialogContent>

        <DialogActions>
          <Box sx={{ flexGrow: 1 }} />
          <Button type="button" variant="outlined" color="inherit" onClick={onCancel}>
            Cancel
          </Button>
          <LoadingButton
            ref={submitRef}
            type="submit"
            variant="contained"
            loading={loading}
            loadingIndicator="Loading..."
          >
            {!isCreating ? 'Save' : 'Add'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
}
