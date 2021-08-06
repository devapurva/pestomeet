import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import { Form, FormikErrors, FormikProvider, useFormik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { EventInput } from '@fullcalendar/common';
// material
import { LoadingButton } from '@material-ui/lab';

import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
  FormHelperText,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  InputAdornment,
  IconButton,
  Autocomplete,
  Checkbox,
  Button
} from '@material-ui/core';
import plusFill from '@iconify/icons-eva/plus-fill';
import closeFill from '@iconify/icons-eva/close-fill';
// redux
import { RootState, useDispatch, useSelector } from '../../../redux/store';
import { addAssignments, deleteAssignment } from '../../../redux/slices/calendar';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { AssignmentManager } from '../../../@types/common';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';

// ----------------------------------------------------------------------

const useStyles = makeStyles({
  legend: {
    paddingTop: 8
  }
});

type TeamFormProps = {
  isEdit: boolean;
  currentAssignment?: AssignmentManager | null;
  setRefresh: any;
  handleClose?: any;
};

type FormikValues = {
  assignmentId?: string;
  assignmentName: string;
  uploaderId: string;
  eventID: string;
  assignmentLinks: any;
};

type FormikSetErrors = {
  (
    errors: FormikErrors<{
      assignmentName: string;
      resource: string;
      assignmentLinks: string;
    }>
  ): void;
};

const VALIDURL =
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

export default function AssignmentsForm({
  isEdit,
  currentAssignment,
  setRefresh,
  handleClose
}: TeamFormProps) {
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { user } = useAuth();
  const { events } = useSelector((state: RootState) => state.calendar);
  const [assignmentLinks, setAssignmentLinks] = useState<string[]>([]);
  const [invalidLink, setInvalidLink] = useState(false);
  const [eventDetails, setEventDetails] = useState<EventInput>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (events?.length > 0 && currentAssignment && !eventDetails) {
      const details = events.find((event) => event.eventId === currentAssignment?.eventID);
      if (details) {
        setEventDetails(details);
      }
    }
  }, [events, currentAssignment, eventDetails]);

  const NewResourceSchema = Yup.object().shape({
    assignmentName: Yup.string()
      .max(100, `Assignment name cannot be more than ${100} characters`)
      .required('Assignment name is required'),
    eventID: Yup.string().required('Event is required'),
    eventType: Yup.string().required('Event is required'),
    assignmentLink: Yup.string()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      assignmentId: currentAssignment?.assignmentId || '',
      assignmentName: currentAssignment?.assignmentName || '',
      uploaderId: currentAssignment?.uploaderId || '',
      eventID: currentAssignment?.eventID || '',
      resourceLink: ''
    },
    validationSchema: NewResourceSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setLoading(true);
      try {
        dispatch(
          addAssignments({
            assignmentName: values.assignmentName,
            assignmentLinks: assignmentLinks,
            uploaderId: user?.id,
            eventID: values.eventID
          })
        ).then((response: any) => {
          if (response?.data?.statusCode) {
            enqueueSnackbar('Assignments Added Successfully', { variant: 'success' });
            if (isMountedRef.current) {
              setLoading(false);
              setSubmitting(false);
            }
            if (setRefresh) setRefresh(true);
            if (handleClose) handleClose();
          } else {
            setLoading(false);
            handleError(response?.data, setSubmitting, setErrors);
          }
        });
      } catch (error) {
        setLoading(false);
        handleError(error, setSubmitting, setErrors);
      }
    }
  });

  const handleError = (error: any, setSubmitting: any, setErrors: any) => {
    if (isMountedRef.current) {
      setSubmitting(false);
      setErrors({ afterSubmit: error.message });
    }
  };

  const {
    errors,
    values,
    touched,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    getFieldProps,
    handleChange
  } = formik;

  const setEventsDetails = (value: any, setFieldValue: any) => {
    setEventDetails(value);
    setFieldValue('eventID', value ? value.id : null);
    setFieldValue('eventType', value ? value.eventType : null);
  };

  const appendResourceLinks = (setFieldValue: any) => {
    if (values.resourceLink.match(VALIDURL)) {
      setInvalidLink(false);
      const link = [...assignmentLinks, values.resourceLink];
      setAssignmentLinks(link);
      setFieldValue('resourceLink', '');
    } else setInvalidLink(true);
  };

  const deleteLink = (link: string) => {
    const filterLinks = assignmentLinks.filter((links) => links !== link);
    setAssignmentLinks(filterLinks);
  };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Assignment Name"
                    {...getFieldProps('assignmentName')}
                    error={Boolean(touched.assignmentName && errors.assignmentName)}
                    helperText={touched.assignmentName && errors.assignmentName}
                  />
                </Stack>

                <FormLabel className={classes.legend} component="legend">
                  Event:
                </FormLabel>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  {events && (
                    <Autocomplete
                      fullWidth
                      id="event-list"
                      options={events}
                      value={eventDetails}
                      isOptionEqualToValue={(option: any, value: any) =>
                        option?.eventId === value?.eventId
                      }
                      onChange={(event, value) => setEventsDetails(value, setFieldValue)}
                      disableCloseOnSelect
                      getOptionLabel={(option) => (option?.title ? option?.title : '')}
                      // eslint-disable-next-line consistent-return
                      renderOption={(props, option, { selected }) => {
                        if (option?.hasAssignment) {
                          return (
                            <li key={option.id} {...props}>
                              <Checkbox checked={selected} />
                              {option.title}
                            </li>
                          );
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          error={Boolean(touched.eventID && errors.eventID)}
                          helperText={touched.eventID && errors.eventID}
                          {...params}
                          label="Event"
                          placeholder="Event"
                        />
                      )}
                    />
                  )}
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    type="text"
                    label="Assignment Links"
                    {...getFieldProps('resourceLink')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            id="add-link"
                            edge="end"
                            onClick={() => appendResourceLinks(setFieldValue)}
                          >
                            <Icon icon={plusFill} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(touched.resourceLink && errors.resourceLink)}
                    helperText={touched.resourceLink && errors.resourceLink}
                  />
                </Stack>
                {invalidLink && <FormHelperText error={true}>Invalid Link</FormHelperText>}
                {assignmentLinks &&
                  assignmentLinks?.map((link, index) => (
                    <div key={index}>
                      {link}
                      <IconButton edge="end" onClick={() => deleteLink(link)}>
                        <Icon icon={closeFill} />
                      </IconButton>
                    </div>
                  ))}

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={loading}>
                    Add Assignment
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
