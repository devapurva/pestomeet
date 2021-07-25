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
import { addBatch } from '../../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { BatchManager, BatchMembers, UserManager } from '../../../@types/user';
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
  const navigate = useNavigate();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);

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
      batchMembers: currentBatch?.batchMembers || []
    },
    validationSchema: NewBatchSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
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
    await addBatch(values.batchName, values.batchType, values.batchOwner, values.batchMembers).then(
      (response: any) => {
        if (response?.data?.statusCode) {
          enqueueSnackbar('Batch added successfully', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
          if (isMountedRef.current) {
            setSubmitting(false);
          }
          if (setRefresh) setRefresh(true);
          if (handleClose) handleClose();
        } else {
          handleError(response?.data, setSubmitting, setErrors);
        }
      }
    );
  };

  const handleEditBatch = async (
    values: FormikValues,
    { setErrors, setSubmitting }: { setErrors: FormikSetErrors; setSubmitting: any }
  ) => {
    // await editUser(
    //   currentBatch?.batchId,
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

  const setBatchOwner = (value: any, setFieldValue: any) => {
    setFieldValue('batchOwner', value ? value.name : null);
  };

  const setBatchMembers = (values: UserManager[], setFieldValue: any) => {
    const finalList = values.map((element) => {
      const obj = {
        id: element.id,
        name: element.name
      };
      return obj;
    });
    setFieldValue('batchMembers', finalList?.length > 0 ? finalList : []);
  };

  console.log(errors);

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
                      onChange={(event, value) => setBatchOwner(value, setFieldValue)}
                      options={admins}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.name}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} />
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
                      fullWidth
                      onChange={(event, value) => setBatchMembers(value, setFieldValue)}
                      multiple
                      options={otherUsers}
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
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
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
