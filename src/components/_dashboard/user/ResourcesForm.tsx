import * as Yup from 'yup';
import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikErrors, FormikProvider, useFormik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Icon } from '@iconify/react';
import MIconButton from 'components/@material-extend/MIconButton';
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
  Checkbox
} from '@material-ui/core';
import { addUser, addAvatar, editUser } from '../../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { TeamManager, TeamMember, UserManager } from '../../../@types/user';
//
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import Label from '../../Label';
import { UploadAvatar } from '../../upload';

// ----------------------------------------------------------------------

const useStyles = makeStyles({
  legend: {
    paddingTop: 8
  }
});

type TeamFormProps = {
  isEdit: boolean;
  currentTeam?: TeamManager | null;
  setRefresh: any;
  handleClose?: any;
  mentors: UserManager[];
  students: UserManager[];
};

type FormikValues = {
  teamName: string;
  teamType: string;
  mentorName: string;
  teamMembers: TeamMember[] | [];
};

type FormikSetErrors = {
  (
    errors: FormikErrors<{
      teamName: string;
      teamType: string;
      mentorName: string;
      teamMembers: TeamMember[] | [];
    }>
  ): void;
};

export default function ResourcesForm({
  isEdit,
  currentTeam,
  setRefresh,
  handleClose,
  mentors,
  students
}: TeamFormProps) {
  const navigate = useNavigate();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();

  const NewTeamSchema = Yup.object().shape({
    teamName: Yup.string()
      .max(100, `Team name cannot be more than ${100} characters`)
      .required('Team name is required'),
    teamType: Yup.string().required('Team Type is Required'),
    mentorName: Yup.string()
      .max(50, `Mentor's Name cannot be more than ${50} characters`)
      .required(`Mentor's Name is required`),
    teamMembers: Yup.mixed()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      teamName: currentTeam?.teamName || '',
      teamType: currentTeam?.teamType || '',
      mentorName: currentTeam?.mentorName || '',
      teamMembers: currentTeam?.teamMembers || []
    },
    validationSchema: NewTeamSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        if (isEdit) {
          handleEditTeam(values, { setErrors, setSubmitting });
        } else {
          handleAddTeam(values, { setErrors, setSubmitting });
        }
      } catch (error) {
        handleError(error, setSubmitting, setErrors);
      }
    }
  });

  const handleAddTeam = async (
    values: FormikValues,
    { setErrors, setSubmitting }: { setErrors: FormikSetErrors; setSubmitting: any }
  ) => {
    // await addTeam(values.teamName, values.teamType, values.mentorName, values.teamMembers).then(
    //   (response: any) => {
    //     if (response?.data?.statusCode) {
    //       enqueueSnackbar('Mentor team added successfully', {
    //         variant: 'success',
    //         action: (key) => (
    //           <MIconButton size="small" onClick={() => closeSnackbar(key)}>
    //             <Icon icon={closeFill} />
    //           </MIconButton>
    //         )
    //       });
    //       if (isMountedRef.current) {
    //         setSubmitting(false);
    //       }
    //       if (setRefresh) setRefresh(true);
    //       if (handleClose) handleClose();
    //     } else {
    //       handleError(response?.data, setSubmitting, setErrors);
    //     }
    //   }
    // );
  };

  const handleEditTeam = async (
    values: FormikValues,
    { setErrors, setSubmitting }: { setErrors: FormikSetErrors; setSubmitting: any }
  ) => {
    // await editUser(
    //   currentTeam?.id,
    //   values?.name,
    //   values?.role,
    //   values?.phone,
    //   values?.role === 'student' ? values?.experience : 'not_applicable',
    //   values?.email,
    //   'inprogress'
    // ).then((response: any) => {
    //   if (response?.data?.statusCode) {
    //     enqueueSnackbar('User updated successfully', {
    //       variant: 'success',
    //       action: (key) => (
    //         <MIconButton size="small" onClick={() => closeSnackbar(key)}>
    //           <Icon icon={closeFill} />
    //         </MIconButton>
    //       )
    //     });
    //     if (isMountedRef.current) {
    //       setSubmitting(false);
    //     }
    //     if (setRefresh) setRefresh(true);
    //     if (handleClose) handleClose();
    //   } else {
    //     handleError(response?.data, setSubmitting, setErrors);
    //   }
    // });
  };

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

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('avatar', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );

  const setTeamOwner = (value: any, setFieldValue: any) => {
    setFieldValue('mentorName', value ? value.name : null);
  };

  const setTeamMembers = (values: UserManager[], setFieldValue: any) => {
    const finalList = values.map((element) => {
      const obj = {
        id: element.id,
        name: element.name
      };
      return obj;
    });
    setFieldValue('teamMembers', finalList?.length > 0 ? finalList : []);
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
                    label="Team Name"
                    {...getFieldProps('teamName')}
                    error={Boolean(touched.teamName && errors.teamName)}
                    helperText={touched.teamName && errors.teamName}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <FormLabel className={classes.legend} component="legend">
                    Team Type:
                  </FormLabel>
                  <RadioGroup
                    row
                    value={values?.teamType}
                    aria-label="teamType"
                    name="teamType"
                    id="teamType"
                    onChange={handleChange}
                  >
                    <FormControlLabel value="mentor" control={<Radio />} label="Mentor Team" />
                    <FormControlLabel
                      value="buddypairing"
                      control={<Radio />}
                      label="Buddy Pairing"
                    />
                  </RadioGroup>
                </Stack>

                {touched.teamType && errors.teamType && (
                  <FormHelperText error={true}>{errors.teamType}</FormHelperText>
                )}

                <FormLabel className={classes.legend} component="legend">
                  Team Mentor:
                </FormLabel>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  {mentors && (
                    <Autocomplete
                      fullWidth
                      options={mentors}
                      onChange={(event, value) => setTeamOwner(value, setFieldValue)}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.name}
                      renderOption={(props, option, { selected }) => (
                        <li key={option.id} {...props}>
                          <Checkbox checked={selected} />
                          {option.name}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          error={Boolean(touched.mentorName && errors.mentorName)}
                          helperText={touched.mentorName && errors.mentorName}
                          {...params}
                          label="Team Mentor"
                          placeholder="Mentor"
                        />
                      )}
                    />
                  )}
                </Stack>

                <FormLabel className={classes.legend} component="legend">
                  Team Members:
                </FormLabel>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  {students && (
                    <Autocomplete
                      fullWidth
                      multiple
                      options={students}
                      onChange={(event, value) => setTeamMembers(value, setFieldValue)}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.name}
                      renderOption={(props, option, { selected }) => (
                        <li key={option.id} {...props}>
                          <Checkbox checked={selected} />
                          {option.name}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          error={Boolean(touched.teamMembers && errors.teamMembers)}
                          helperText={touched.teamMembers && errors.teamMembers}
                          {...params}
                          label="Team Members"
                          placeholder="Members"
                        />
                      )}
                    />
                  )}
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Team' : 'Save Changes'}
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
