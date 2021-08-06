import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Form, FormikErrors, FormikProvider, useFormik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
// material
import { LoadingButton } from '@material-ui/lab';
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
  Checkbox,
  CircularProgress,
  Autocomplete
} from '@material-ui/core';
// @types
import { BatchManager, TeamManager, TeamMember, UserManager } from '../../../@types/common';
// redux
import useAuth from '../../../hooks/useAuth';
import { RootState, useDispatch, useSelector } from '../../../redux/store';
import { addTeam, editTeam, getBatchList, getAllUserList } from '../../../redux/slices/lists';
// components
import useIsMountedRef from '../../../hooks/useIsMountedRef';

// ----------------------------------------------------------------------

const useStyles = makeStyles({
  legend: {
    paddingTop: 8
  },
  loader: {
    textAlign: 'center'
  }
});

type TeamFormProps = {
  isEdit: boolean;
  currentTeam?: TeamManager | null;
  setRefresh: any;
  handleClose?: any;
  type: string;
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

export default function TeamForm({
  isEdit,
  currentTeam,
  setRefresh,
  handleClose,
  type
}: TeamFormProps) {
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const { batchList, userList } = useSelector((state: RootState) => state.list);
  const [mentors, setMentors] = useState<UserManager[]>([]);
  const [students, setStudents] = useState<UserManager[]>([]);
  const [batchDetails, setBatchDetails] = useState<BatchManager>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllUserList());
    dispatch(getBatchList(user?.id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (currentTeam && batchList?.length > 0 && userList?.length > 0 && !batchDetails) {
      setLoading(true);
      const getBatch: BatchManager | undefined = batchList?.find(
        (batch) => batch.batchId === currentTeam.batchId
      );
      if (getBatch) {
        setBatchDetails(getBatch);
        getBatch?.batchMembers?.forEach((element: any) => {
          const findUser = userList.find((user) => user.id === element.id);
          if (findUser?.role === 'mentor') {
            setMentors((mentors) => mentors.concat(findUser));
          }
          if (findUser?.role === 'student') {
            setStudents((students) => students.concat(findUser));
          }
        });
      }
      setLoading(false);
    }
  }, [currentTeam, batchList, userList, batchDetails]);

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
      teamType: currentTeam?.teamType || type,
      mentorName: currentTeam?.mentorName || '',
      mentorId: currentTeam?.mentorId || '',
      batchId: currentTeam?.batchId || '',
      batchOwnerID: currentTeam?.batchOwnerID || '',
      teamMembers: currentTeam?.teamMembers || []
    },
    validationSchema: NewTeamSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setLoading(true);
      setSubmitting(true);
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
          setLoading(false);
        }
        if (setRefresh) setRefresh(true);
        if (handleClose) handleClose();
      } else {
        setLoading(false);
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

  const setBatchValues = (value: any, setFieldValue: any) => {
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
    setBatchDetails(value);
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

                {values.teamType?.length === 0 && (
                  <>
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
                  </>
                )}

                <FormLabel className={classes.legend} component="legend">
                  Batch:
                </FormLabel>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  {batchList && (
                    <Autocomplete
                      id="batch-list"
                      fullWidth
                      value={batchDetails}
                      inputValue={batchDetails?.batchName ? batchDetails?.batchName : ''}
                      onChange={(event, newValue) => setBatchValues(newValue, setFieldValue)}
                      options={batchList}
                      isOptionEqualToValue={(option: BatchManager, value: BatchManager) =>
                        option?.batchId === value?.batchId
                      }
                      disableCloseOnSelect
                      getOptionLabel={(option: BatchManager) => option.batchName}
                      renderOption={(props, option, { selected }) => (
                        <li key={option.batchId} {...props}>
                          {option.batchName}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField {...params} label="" placeholder="Select Batch" />
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
                        id="team-mentor"
                        value={mentors[0]}
                        isOptionEqualToValue={(option: any, value: any) => option?.id === value}
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
                            placeholder="Team Mentor"
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
                        id="team-member"
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
                            placeholder="Team Members"
                          />
                        )}
                      />
                    </Stack>
                  </>
                )}

                {loading && (
                  <div className={classes.loader}>
                    <CircularProgress color="primary" />
                  </div>
                )}

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={loading}>
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
