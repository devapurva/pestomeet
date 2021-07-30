import { useRef, useEffect } from 'react';
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
import { useDispatch } from '../../../redux/store';
import { createEvent, updateEvent, deleteEvent } from '../../../redux/slices/calendar';
//
import ColorSinglePicker from '../../ColorSinglePicker';
import { BatchManager, UserManager } from '../../../@types/user';
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
    attendees: []
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
  batchList: BatchManager[];
};

export default function SlotsCalendarForm({
  event,
  range,
  onCancel,
  batchList
}: CalendarFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isCreating = !event;
  const submitRef = useRef<any>(null);

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Event Name is required'),
    description: Yup.string().max(5000),
    attendees: Yup.mixed(),
    hasAssignment: Yup.boolean().required('Assignment is required'),
    start: Yup.string().required('Start Date & Time is required'),
    end: Yup.string().required('End Date & Time is required')
  });

  useEffect(() => {
    if (submitRef) {
      submitRef?.current?.click();
    }
  }, [submitRef]);

  const formik = useFormik({
    initialValues: getInitialValues(event, range, user),
    validationSchema: EventSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const newEvent = {
          eventName: values.title,
          eventDescription: values.description,
          eventType: values.eventType,
          eventColor: values.textColor,
          eventStart: values.start,
          eventEnd: values.end,
          organiserId: user?.id,
          organiserName: user?.name,
          hasAssignment: values.hasAssignment,
          attendees: values.attendees
        };
        if (event.id) {
          dispatch(updateEvent(event.id, newEvent));
          enqueueSnackbar('Update event success', { variant: 'success' });
        } else {
          dispatch(createEvent(newEvent));
          enqueueSnackbar('Create event success', { variant: 'success' });
        }
        resetForm();
        onCancel();
        setSubmitting(false);
      } catch (error) {
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
            label="Title"
            {...getFieldProps('title')}
            error={Boolean(touched.title && errors.title)}
            helperText={touched.title && errors.title}
            sx={{ mb: 3 }}
          />

          <FormControlLabel
            control={<Switch checked={values.hasAssignment} {...getFieldProps('hasAssignment')} />}
            label="Assignment"
            sx={{ mb: 3 }}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
            <MobileDateTimePicker
              label="Start date"
              value={values.start}
              inputFormat="dd/MM/yyyy hh:mm a"
              onChange={(date) => setFieldValue('start', date)}
              renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 3 }} />}
            />

            <MobileDateTimePicker
              label="End date"
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
            loading={isSubmitting}
            loadingIndicator="Loading..."
          >
            {!isCreating ? 'Save' : 'Add'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
}
