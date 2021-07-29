import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikErrors, FormikProvider, useFormik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
// material
import { LoadingButton, Autocomplete } from '@material-ui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  TextField,
  FormHelperText,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Checkbox
} from '@material-ui/core';
// @types
import { TeamManager, TeamMember, UserManager } from '../../../@types/user';
// redux
import useAuth from '../../../hooks/useAuth';
import { RootState, useDispatch, useSelector } from '../../../redux/store';
import { addTeam, editTeam, getBatchList, getAllUserList } from '../../../redux/slices/user';
// components
import useIsMountedRef from '../../../hooks/useIsMountedRef';

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
};

type FormikValues = {
  teamId?: string;
  teamName: string;
  teamType: string;
  mentorName: string;
  mentorId: string;
  batchId: string;
  batchOwnerID: string;
  teamMembers: TeamMember[] | [];
};

type FormikSetErrors = {
  (
    errors: FormikErrors<{
      teamName: string;
      teamType: string;
      mentorName: string;
      mentorId: string;
      batchId: string;
      batchOwnerID: string;
      teamMembers: TeamMember[] | [];
    }>
  ): void;
};

export default function TeamForm({ isEdit, currentTeam, setRefresh, handleClose }: TeamFormProps) {
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const { batchList, userList } = useSelector((state: RootState) => state.user);
  const [mentors, setMentors] = useState<UserManager[]>([]);
  const [students, setStudents] = useState<UserManager[]>([]);

  useEffect(() => {
    dispatch(getAllUserList());
    dispatch(getBatchList(user?.id));
  }, [dispatch, user?.id]);

  // useEffect(() => {

  // }, [batchList, userList]);

  const NewTeamSchema = Yup.object().shape({
    teamName: Yup.string()
      .max(100, `Team name cannot be more than ${100} characters`)
      .required('Team name is required'),
    teamType: Yup.string().required('Team Type is Required'),
    mentorName: Yup.string().required(`Mentor is required`),
    teamMembers: Yup.mixed()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      teamName: currentTeam?.teamName || '',
      teamType: currentTeam?.teamType || '',
      mentorName: currentTeam?.mentorName || '',
      mentorId: currentTeam?.mentorId || '',
      batchId: currentTeam?.batchId || '',
      batchOwnerID: currentTeam?.batchOwnerID || '',
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
    await addTeam(
      values.teamName,
      values.teamType,
      values.mentorName,
      values.mentorId,
      values.batchId,
      values.batchOwnerID,
      values.teamMembers
    ).then((response: any) => {
      if (response?.data?.statusCode) {
        enqueueSnackbar('Team added successfully', { variant: 'success' });
        if (isMountedRef.current) {
          setSubmitting(false);
        }
        if (setRefresh) setRefresh(true);
        if (handleClose) handleClose();
      } else {
        handleError(response?.data, setSubmitting, setErrors);
      }
    });
  };

  const handleEditTeam = async (
    values: FormikValues,
    { setErrors, setSubmitting }: { setErrors: FormikSetErrors; setSubmitting: any }
  ) => {
    await editTeam(
      currentTeam?.teamId ? currentTeam?.teamId : '',
      values.teamName,
      values.teamType,
      values.mentorName,
      values.mentorId,
      values.batchId,
      values.batchOwnerID,
      values.teamMembers
    ).then((response: any) => {
      if (response?.data?.statusCode) {
        enqueueSnackbar('Team updated successfully', { variant: 'success' });
        if (isMountedRef.current) {
          setSubmitting(false);
        }
        if (setRefresh) setRefresh(true);
        if (handleClose) handleClose();
      } else {
        handleError(response?.data, setSubmitting, setErrors);
      }
    });
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

  const setMentorNameValues = (value: any, setFieldValue: any) => {
    setFieldValue('mentorName', value ? value.name : null);
    setFieldValue('mentorId', value ? value.id : null);
  };

  const setBatchDetails = (value: any, setFieldValue: any) => {
    // eslint-disable-next-line consistent-return
    value.batchMembers.forEach((element: any) => {
      const findUser = userList.find((user) => user.id === element.id);
      if (findUser?.role === 'mentor') {
        setMentors((mentors) => mentors.concat(findUser));
      }
      if (findUser?.role === 'student') {
        setStudents((students) => students.concat(findUser));
      }
    });
    setFieldValue('batchId', value ? value.batchId : null);
    setFieldValue('batchOwnerID', value ? value.batchOwnerID : null);
  };

  const setTeamMembers = (values: any, setFieldValue: any) => {
    setFieldValue('teamMembers', values?.length > 0 ? values : []);
  };

  const defaultProps = {
    options: students,
    getOptionLabel: (option: any) => option?.name,
    fullWidth: true
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
                    <FormControlLabel value="mentor" control={<Radio />} label="Mentor" />
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
                  Batch:
                </FormLabel>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  {batchList && (
                    <Autocomplete
                      fullWidth
                      // inputValue={values.mentorName}
                      onChange={(event, value) => setBatchDetails(value, setFieldValue)}
                      options={batchList}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.batchName}
                      renderOption={(props, option, { selected }) => (
                        <li key={option.batchId} {...props}>
                          {option.batchName}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          error={Boolean(touched.mentorName && errors.mentorName)}
                          helperText={touched.mentorName && errors.mentorName}
                          {...params}
                          label=""
                          placeholder="Batch"
                        />
                      )}
                    />
                  )}
                </Stack>
                {mentors?.length > 0 && (
                  <>
                    <FormLabel className={classes.legend} component="legend">
                      Team Mentor:
                    </FormLabel>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <Autocomplete
                        fullWidth
                        inputValue={values.mentorName}
                        onChange={(event, value) => setMentorNameValues(value, setFieldValue)}
                        options={mentors}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option.name}
                        renderOption={(props, option, { selected }) => (
                          <li key={option.id} {...props}>
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
                    </Stack>
                  </>
                )}
                {students?.length > 0 && (
                  <>
                    <FormLabel className={classes.legend} component="legend">
                      Team Member:
                    </FormLabel>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <Autocomplete
                        {...defaultProps}
                        fullWidth
                        onChange={(event, value) => setTeamMembers(value, setFieldValue)}
                        multiple
                        value={values.teamMembers}
                        isOptionEqualToValue={(option: any, value: any) => option?.id === value?.id}
                        disableCloseOnSelect
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
                    </Stack>
                  </>
                )}

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
