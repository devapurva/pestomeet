import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import { EventInput } from '@fullcalendar/common';
import { Form, FormikErrors, FormikProvider, useFormik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
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
  Divider,
  FormLabel,
  InputAdornment,
  IconButton,
  Autocomplete,
  Checkbox,
  Button
} from '@material-ui/core';
import plusFill from '@iconify/icons-eva/plus-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import mdiVideoPlusOutline from '@iconify/icons-mdi/video-plus-outline';
// redux
import { RootState, useDispatch, useSelector } from '../../../redux/store';
import { addResources, getResource, deleteResource } from '../../../redux/slices/calendar';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { TeamManager, TeamMember, UserManager, ResourceManager } from '../../../@types/common';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import Label from '../../Label';
import { UploadAvatar } from '../../upload';

// ----------------------------------------------------------------------

const useStyles = makeStyles({
  legend: {
    paddingTop: 8
  },
  link: {
    marginBottom: 10
  }
});

type TeamFormProps = {
  isEdit: boolean;
  setRefresh: any;
  handleClose?: any;
  eventId?: string;
};

type FormikValues = {
  resourceId?: string | undefined;
  resourceName: string;
  uploaderId: string;
  eventId: string;
  eventType: string;
  resource: any;
  resourceLinks: any;
};

type FormikSetErrors = {
  (
    errors: FormikErrors<{
      resourceName: string;
      resource: string;
      resourceLinks: string;
    }>
  ): void;
};

const VALIDURL =
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

export default function ResourcesForm({ isEdit, setRefresh, handleClose, eventId }: TeamFormProps) {
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { user } = useAuth();
  const { events } = useSelector((state: RootState) => state.calendar);
  const [resourceLinks, setResourceLinks] = useState<string[]>([]);
  const [invalidLink, setInvalidLink] = useState(false);
  const [eventDetails, setEventDetails] = useState<EventInput>({});
  const [currentResource, setCurrentResource] = useState<ResourceManager>();
  const [loading, setLoading] = useState(false);

  const NewResourceSchema = Yup.object().shape({
    resourceName: Yup.string()
      .max(100, `Resource name cannot be more than ${100} characters`)
      .required('Resource name is required'),
    resource: Yup.mixed(),
    eventId: Yup.string().required('Event is required'),
    eventType: Yup.string().required('Event is required'),
    resourceLink: Yup.string()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      resourceId: currentResource?.resourceId || '',
      resourceName: currentResource?.resourceName || '',
      uploaderId: currentResource?.uploaderId || '',
      eventId: currentResource?.eventId || '',
      eventType: currentResource?.eventType || '',
      resource: currentResource?.resource || '',
      resourceLink: ''
    },
    validationSchema: NewResourceSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('resourceName', values.resourceName);
        formData.append('resourceLinks', JSON.stringify(resourceLinks));
        formData.append('uploaderId', user?.id);
        formData.append('eventId', values.eventId);
        formData.append('eventType', values.eventType);
        formData.append('resource', values.resource);
        dispatch(addResources(formData)).then((response: any) => {
          if (response?.data?.statusCode) {
            enqueueSnackbar('Resources Added Successfully', { variant: 'success' });
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

  const setTeamOwner = (value: any, setFieldValue: any) => {
    setEventDetails(value);
    setFieldValue('eventId', value ? value.id : null);
    setFieldValue('eventType', value ? value.eventType : null);
  };

  const appendResourceLinks = (setFieldValue: any) => {
    if (values.resourceLink.match(VALIDURL)) {
      setInvalidLink(false);
      const link = [...resourceLinks, values.resourceLink];
      setResourceLinks(link);
      setFieldValue('resourceLink', '');
    } else setInvalidLink(true);
  };

  const deleteLink = (link: string) => {
    const filterLinks = resourceLinks.filter((links) => links !== link);
    setResourceLinks(filterLinks);
  };

  const uploadFile = (setFieldValue: any) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.mp4, .avi');
    input.click();
    return (input.onchange = async () => {
      setFieldValue('resource', input?.files?.[0]);
    });
  };

  const deleteResourceValue = (setFieldValue: any) => {
    setFieldValue('resource', '');
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
                    disabled={isEdit}
                    label="Resource Name"
                    {...getFieldProps('resourceName')}
                    error={Boolean(touched.resourceName && errors.resourceName)}
                    helperText={touched.resourceName && errors.resourceName}
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
                      disabled={isEdit}
                      options={events}
                      value={eventDetails}
                      isOptionEqualToValue={(option: any, value: any) =>
                        option?.eventId === value?.eventId
                      }
                      onChange={(event, value) => setTeamOwner(value, setFieldValue)}
                      disableCloseOnSelect
                      getOptionLabel={(option) => (option?.title ? option?.title : '')}
                      renderOption={(props, option, { selected }) => (
                        <li key={option.id} {...props}>
                          <Checkbox checked={selected} />
                          {option.title}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          error={Boolean(touched.eventId && errors.eventId)}
                          helperText={touched.eventId && errors.eventId}
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
                    style={{ width: '79%' }}
                    type="text"
                    label="Resource Links"
                    disabled={isEdit}
                    {...getFieldProps('resourceLink')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            id="add-link"
                            edge="end"
                            color="primary"
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
                  <Divider orientation="vertical" flexItem light={false} />
                  <Button
                    id="upload-video"
                    color="warning"
                    variant="contained"
                    startIcon={<Icon icon={mdiVideoPlusOutline} />}
                    onClick={() => uploadFile(setFieldValue)}
                  >
                    Upload Video
                  </Button>
                </Stack>
                {touched.resource && errors.resource && (
                  <FormHelperText error={true}>{errors.resource}</FormHelperText>
                )}
                {invalidLink && <FormHelperText error={true}>Invalid Link</FormHelperText>}
                {resourceLinks &&
                  resourceLinks?.map((link, index) => (
                    <div key={index}>
                      {link}
                      <IconButton edge="end" onClick={() => deleteLink(link)}>
                        <Icon icon={closeFill} />
                      </IconButton>
                    </div>
                  ))}
                {values.resource && (
                  <div key="resourceFile">
                    {values.resource?.name}
                    <IconButton edge="end" onClick={() => deleteResourceValue(setFieldValue)}>
                      <Icon icon={closeFill} />
                    </IconButton>
                  </div>
                )}

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={loading}>
                    Add Resources
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
