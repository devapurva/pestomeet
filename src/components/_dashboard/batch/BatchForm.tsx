import * as Yup from 'yup';
import { useState } from 'react';
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
  Autocomplete
} from '@material-ui/core';
import { addBatch, editBatch } from '../../../redux/slices/lists';
// @types
import { BatchManager, BatchMembers, UserManager } from '../../../@types/common';
//
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

const useStyles = makeStyles({
  legend: {
    paddingTop: 8
  }
});

type BatchFormProps = {
  isEdit: boolean;
  currentBatch?: BatchManager | null;
  setRefresh: any;
  handleClose?: any;
  admins: UserManager[];
  otherUsers: UserManager[];
};

type FormikValues = {
  batchName: string;
  batchType: string;
  batchOwner: string;
  batchOwnerID: string;
  batchMembers: BatchMembers[] | [];
};

type FormikSetErrors = {
  (
    errors: FormikErrors<{
      batchName: string;
      batchType: string;
      batchOwner: string;
      batchMembers: BatchMembers[] | [];
    }>
  ): void;
};

export default function BatchForm({
  isEdit,
  currentBatch,
  setRefresh,
  handleClose,
  admins,
  otherUsers
}: BatchFormProps) {
  const { user } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const NewBatchSchema = Yup.object().shape({
    batchName: Yup.string()
      .max(100, `Batch name cannot be more than ${100} characters`)
      .required('Batch name is required'),
    batchType: Yup.string().required('Batch Type is Required'),
    batchOwner: Yup.string()
      .max(50, `Batch Admin cannot be more than ${50} characters`)
      .required(`Batch Admin Name is required`),
    batchMembers: Yup.mixed()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      batchName: currentBatch?.batchName || '',
      batchType: currentBatch?.batchType || '',
      batchOwner: currentBatch?.batchOwner || '',
      batchMembers: currentBatch?.batchMembers || [],
      batchOwnerID: currentBatch?.batchOwnerID || user?.id
    },
    validationSchema: NewBatchSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setLoading(true);
      try {
        if (isEdit) {
          handleEditBatch(values, { setErrors, setSubmitting });
        } else {
          handleAddBatch(values, { setErrors, setSubmitting });
        }
      } catch (error) {
        handleError(error, setSubmitting, setErrors);
      }
    }
  });

  const handleAddBatch = async (
    values: FormikValues,
    { setErrors, setSubmitting }: { setErrors: FormikSetErrors; setSubmitting: any }
  ) => {
    await addBatch(
      values.batchName,
      values.batchType,
      values.batchOwner,
      user?.id,
      values.batchMembers
    ).then((response: any) => {
      if (response?.data?.statusCode) {
        enqueueSnackbar('Batch added successfully', { variant: 'success' });
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

  const handleEditBatch = async (
    values: FormikValues,
    { setErrors, setSubmitting }: { setErrors: FormikSetErrors; setSubmitting: any }
  ) => {
    await editBatch(
      currentBatch?.batchId ? currentBatch?.batchId : '',
      values.batchName,
      values.batchType,
      values.batchOwner,
      values.batchOwnerID,
      values.batchMembers
    ).then((response: any) => {
      if (response?.data?.statusCode) {
        enqueueSnackbar('Batch updated successfully', { variant: 'success' });
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

  const setBatchOwnerValues = (value: any, setFieldValue: any) => {
    setFieldValue('batchOwner', value ? value.name : null);
    setFieldValue('batchOwnerID', value ? value.id : null);
  };

  const setBatchMembers = (values: any, setFieldValue: any) => {
    setFieldValue('batchMembers', values?.length > 0 ? values : []);
  };

  const defaultProps = {
    options: otherUsers,
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
                    label="Batch Name"
                    {...getFieldProps('batchName')}
                    error={Boolean(touched.batchName && errors.batchName)}
                    helperText={touched.batchName && errors.batchName}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <FormLabel className={classes.legend} component="legend">
                    Batch Type:
                  </FormLabel>
                  <RadioGroup
                    row
                    value={values?.batchType}
                    aria-label="batchType"
                    name="batchType"
                    id="batchType"
                    onChange={handleChange}
                  >
                    <FormControlLabel value="ninja" control={<Radio />} label="Ninja" />
                    <FormControlLabel value="beginner" control={<Radio />} label="Beginner" />
                  </RadioGroup>
                </Stack>

                {touched.batchType && errors.batchType && (
                  <FormHelperText error={true}>{errors.batchType}</FormHelperText>
                )}

                <FormLabel className={classes.legend} component="legend">
                  Batch Admin:
                </FormLabel>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  {admins && (
                    <Autocomplete
                      fullWidth
                      id="batch-admin"
                      inputValue={values.batchOwner}
                      onChange={(event, value) => setBatchOwnerValues(value, setFieldValue)}
                      options={admins}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.name}
                      renderOption={(props, option, { selected }) => (
                        <li key={option.id} {...props}>
                          {option.name}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          error={Boolean(touched.batchOwner && errors.batchOwner)}
                          helperText={touched.batchOwner && errors.batchOwner}
                          {...params}
                          label="Batch Admin"
                          placeholder="Admin"
                        />
                      )}
                    />
                  )}
                </Stack>

                <FormLabel className={classes.legend} component="legend">
                  Batch Member:
                </FormLabel>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  {otherUsers && (
                    <Autocomplete
                      {...defaultProps}
                      fullWidth
                      id="batch-members"
                      onChange={(event, value) => setBatchMembers(value, setFieldValue)}
                      multiple
                      value={values.batchMembers}
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
                          error={Boolean(touched.batchMembers && errors.batchMembers)}
                          helperText={touched.batchMembers && errors.batchMembers}
                          {...params}
                          label="Batch Members"
                          placeholder="Members"
                        />
                      )}
                    />
                  )}
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={loading}>
                    {!isEdit ? 'Create Batch' : 'Save Changes'}
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
