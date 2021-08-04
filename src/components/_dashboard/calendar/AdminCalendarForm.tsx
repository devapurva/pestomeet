import { useEffect, useState } from 'react';
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
// hooks
import useAuth from '../../../hooks/useAuth';
// redux
import { useDispatch } from '../../../redux/store';
import { createEvent, updateEvent, deleteEvent } from '../../../redux/slices/calendar';
//
import ColorSinglePicker from '../../ColorSinglePicker';
import { BatchManager } from '../../../@types/common';

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

const getInitialValues = (
  event: EventInput,
  range: { start: Date; end: Date } | null,
  batchDetails?: BatchManager[]
) => {
  // eslint-disable-next-line no-underscore-dangle

  const _event = {
    title: '',
    description: '',
    textColor: '#1890FF',
    allDay: false,
    start: range ? new Date(range.start) : new Date(),
    end: range ? new Date(range.end) : new Date(),
    eventType: 'masterclass',
    organiserId: '',
    organiserName: '',
    hasAssignment: false,
    attendees: batchDetails
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
  setRefresh?: any;
  role: string;
};

export default function AdminCalendarForm({
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
  const [batchDetails, setBatchDetails] = useState<BatchManager[]>([]);
  const isCreating = !event;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(event).length > 0 && batchDetails) {
      // eslint-disable-next-line consistent-return
      event?.attendees?.forEach((batchObj: { batchId: string | undefined }) => {
        const getBatch = batchList.find((batch) => batch?.batchId === batchObj?.batchId);
        if (getBatch) {
          setBatchDetails((batchDetails) => batchDetails.concat(getBatch));
        }
      });
    }
  }, [event, batchList]);

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Event Name is required'),
    description: Yup.string().max(5000),
    attendees: Yup.mixed().required('Event Members is required'),
    hasAssignment: Yup.boolean().required('Assignment is required'),
    start: Yup.string().required('Start Date & Time is required'),
    end: Yup.string().required('End Date & Time is required')
  });

  const formik = useFormik({
    initialValues: getInitialValues(event, range, batchDetails),
    validationSchema: EventSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setLoading(true);
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
          dispatch(updateEvent(event.id, newEvent)).then((response) => {
            if (response?.data.statusCode) {
              enqueueSnackbar('Update event success', { variant: 'success' });
            }
          });
        } else {
          dispatch(createEvent(newEvent)).then((response) => {
            if (response?.data?.statusCode) {
              enqueueSnackbar('Create event success', { variant: 'success' });
            }
          });
        }
        resetForm();
        onCancel();
        setSubmitting(false);
        setLoading(true);
        if (setRefresh) {
          setRefresh(true);
        }
      } catch (error) {
        setLoading(true);
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
      dispatch(deleteEvent(event.id)).then((response) => {
        if (response?.data?.statusCode) {
          enqueueSnackbar('Event Deleted', { variant: 'success' });
          setLoading(true);
          if (setRefresh) {
            setRefresh(true);
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const isDateError = isBefore(new Date(values.end), new Date(values.start));

  const setAttendees = (values: BatchManager[], setFieldValue: any) => {
    const finalList = values.map((element) => {
      const obj = {
        batchId: element.batchId,
        batchMember: element.batchMembers
      };
      return obj;
    });
    setBatchDetails(values);
    setFieldValue('attendees', finalList?.length > 0 ? finalList : []);
  };

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

          <TextField
            fullWidth
            disabled={role === 'Student'}
            multiline
            maxRows={4}
            label="Description"
            {...getFieldProps('description')}
            error={Boolean(touched.description && errors.description)}
            helperText={touched.description && errors.description}
            sx={{ mb: 3 }}
          />

          <FormControlLabel
            disabled={role === 'Student'}
            control={<Switch checked={values.hasAssignment} {...getFieldProps('hasAssignment')} />}
            label="Assignment"
            sx={{ mb: 3 }}
          />

          <MobileDateTimePicker
            disabled={role === 'Student'}
            label="Start date"
            value={values.start}
            inputFormat="dd/MM/yyyy hh:mm a"
            onChange={(date) => setFieldValue('start', date)}
            renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 3 }} />}
          />

          <MobileDateTimePicker
            disabled={role === 'Student'}
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

          {batchList && (
            <>
              <Autocomplete
                fullWidth
                disabled={role === 'Student'}
                multiple
                value={batchDetails}
                isOptionEqualToValue={(option: any, value: any) =>
                  option?.batchId === value?.batchId
                }
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
            </>
          )}

          {role !== 'Student' && (
            <ColorSinglePicker
              style={{ marginTop: 20 }}
              {...getFieldProps('textColor')}
              colors={COLOR_OPTIONS}
            />
          )}
        </DialogContent>

        <DialogActions>
          {!isCreating && role !== 'Student' && (
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
          {role !== 'Student' && (
            <LoadingButton
              type="submit"
              variant="contained"
              loading={loading}
              loadingIndicator="Loading..."
            >
              {isCreating ? 'Add' : 'Save'}
            </LoadingButton>
          )}
        </DialogActions>
      </Form>
    </FormikProvider>
  );
}
