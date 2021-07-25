import * as Yup from 'yup';
import { merge } from 'lodash';
import { isBefore } from 'date-fns';
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
  Autocomplete,
  Checkbox
} from '@material-ui/core';
import { LoadingButton, MobileDateTimePicker } from '@material-ui/lab';
import { EventInput } from '@fullcalendar/common';
// redux
import { useDispatch } from '../../../redux/store';
import { createEvent, updateEvent, deleteEvent } from '../../../redux/slices/calendar';
//
import ColorSinglePicker from '../../ColorSinglePicker';
import { BatchManager } from '../../../@types/user';

// ----------------------------------------------------------------------

const COLOR_OPTIONS = [
  '#00AB55', // theme.palette.primary.main,
  '#1890FF', // theme.palette.info.main,
  '#94D82D', // theme.palette.success.main,
  '#FFC107', // theme.palette.warning.main,
  '#FF4842', // theme.palette.error.main
  '#04297A', // theme.palette.info.darker
  '#7A0C2E' // theme.palette.error.darker
];

const getInitialValues = (event: EventInput, range: { start: Date; end: Date } | null) => {
  // eslint-disable-next-line no-underscore-dangle
  const _event = {
    eventName: '',
    eventDescription: '',
    eventType: 'masterclass',
    eventColor: '#1890FF',
    eventStart: range ? new Date(range.start) : new Date(),
    eventEnd: range ? new Date(range.end) : new Date(),
    organiserId: '',
    organiserName: '',
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

export default function CalendarForm({ event, range, onCancel, batchList }: CalendarFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const isCreating = !event;

  const EventSchema = Yup.object().shape({
    eventName: Yup.string().max(255).required('Event Name is required'),
    eventDescription: Yup.string().max(5000)
  });

  const formik = useFormik({
    initialValues: getInitialValues(event, range),
    validationSchema: EventSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const newEvent = { ...values };
        if (event.id) {
          dispatch(updateEvent(event.id, newEvent));
          enqueueSnackbar('Update event success', { variant: 'success' });
        } else {
          console.log('inside create');
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

  const handleDelete = async () => {
    if (!event.id) return;
    try {
      onCancel();
      dispatch(deleteEvent(event.id));
      enqueueSnackbar('Delete event success', { variant: 'success' });
    } catch (error) {
      console.error(error);
    }
  };

  const isDateError = isBefore(new Date(values.eventEnd), new Date(values.eventStart));

  const setAttendees = (values: BatchManager[], setFieldValue: any) => {
    const finalList = values.map((element) => {
      const obj = {
        batchId: element.batchId
      };
      return obj;
    });
    setFieldValue('attendees', finalList?.length > 0 ? finalList : []);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <DialogContent sx={{ pb: 0, overflowY: 'unset' }}>
          <TextField
            fullWidth
            label="Title"
            {...getFieldProps('eventName')}
            error={Boolean(touched.eventName && errors.eventName)}
            helperText={touched.eventName && errors.eventName}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            multiline
            maxRows={4}
            label="Description"
            {...getFieldProps('eventDescription')}
            error={Boolean(touched.eventDescription && errors.eventDescription)}
            helperText={touched.eventDescription && errors.eventDescription}
            sx={{ mb: 3 }}
          />

          <FormControlLabel
            control={<Switch checked={values.hasAssignment} {...getFieldProps('hasAssignment')} />}
            label="Assignment"
            sx={{ mb: 3 }}
          />

          <MobileDateTimePicker
            label="Start date"
            value={values.eventStart}
            inputFormat="dd/MM/yyyy hh:mm a"
            onChange={(date) => setFieldValue('eventStart', date)}
            renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 3 }} />}
          />

          <MobileDateTimePicker
            label="End date"
            value={values.eventEnd}
            inputFormat="dd/MM/yyyy hh:mm a"
            onChange={(date) => setFieldValue('eventEnd', date)}
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

          {batchList && (
            <Autocomplete
              fullWidth
              multiple
              options={batchList}
              onChange={(event, value) => setAttendees(value, setFieldValue)}
              disableCloseOnSelect
              getOptionLabel={(option) => option.batchName}
              renderOption={(props, option, { selected }) => (
                <li key={option.batchId} {...props}>
                  <Checkbox checked={selected} />
                  {option.batchName}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  error={Boolean(touched.attendees && errors.attendees)}
                  helperText={touched.attendees && errors.attendees}
                  {...params}
                  label="Team Members"
                  placeholder="Members"
                />
              )}
            />
          )}

          <ColorSinglePicker
            style={{ marginTop: 20 }}
            {...getFieldProps('eventColor')}
            colors={COLOR_OPTIONS}
          />
        </DialogContent>

        <DialogActions>
          {!isCreating && (
            <Tooltip title="Delete Event">
              <IconButton onClick={handleDelete}>
                <Icon icon={trash2Fill} width={20} height={20} />
              </IconButton>
            </Tooltip>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Button type="button" variant="outlined" color="inherit" onClick={onCancel}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            loadingIndicator="Loading..."
          >
            Add
          </LoadingButton>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
}
