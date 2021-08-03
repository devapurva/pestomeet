import * as Yup from 'yup';
import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useLocation } from 'react-router-dom';
import { Form, FormikErrors, FormikProvider, useFormik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Icon } from '@iconify/react';
// material
import { LoadingButton } from '@material-ui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
  FormHelperText,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  InputAdornment,
  IconButton
} from '@material-ui/core';
import useAuth from '../../../hooks/useAuth';
import { addUser, addAvatar, editUser } from '../../../redux/slices/lists';
// @types
import { UserManager } from '../../../@types/common';
import { AuthUser } from '../../../@types/authentication';
//
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import { UploadAvatar } from '../../upload';

// ----------------------------------------------------------------------

const useStyles = makeStyles({
  legend: {
    paddingTop: 8
  }
});

type UserNewFormProps = {
  isEdit: boolean;
  currentUser?: UserManager | AuthUser | null;
  setRefresh?: any;
  handleClose?: any;
};

type FormikValues = {
  password: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  approval: string | undefined;
  role: string;
  experience: string;
};

type FormikSetErrors = {
  (
    errors: FormikErrors<{
      password: string;
      name: string;
      email: string;
      phone: string;
      avatar: string | null;
      approval: string | undefined;
      role: string;
      experience: string;
    }>
  ): void;
};

export default function UserNewForm({
  isEdit,
  currentUser,
  setRefresh,
  handleClose
}: UserNewFormProps) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line consistent-return
  const getRole = () => {
    if (pathname.includes('student')) {
      return 'student';
    }
    if (pathname.includes('mentor')) {
      return 'mentor';
    }
  };

  const NewUserSchema = Yup.object().shape(
    {
      name: Yup.string()
        .max(50, `Full name cannot be more than ${50} characters`)
        .required('Full name is required'),
      phone: Yup.string()
        .matches(/^([7-9][0-9]{9})$/, 'Enter valid phone number')
        .required('Phone number is required'),
      email: Yup.string().email().required('Enter valid email-id'),
      role: Yup.string().required('Role is Required'),
      password: Yup.string()
        .min(8, `Password must be atleast ${8} characters`)
        .max(20, `Password cannot be more than ${20} characters`)
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,20}\S$/,
          `Password must contain - One uppercase, one lowercase, one special character, no spaces and of ${
            8 - 20
          } characters.`
        )
        .required(
          `Enter valid password. One uppercase, one lowercase, one special character and no spaces`
        ),
      experience: Yup.string().when('role', {
        is: (role: string) => role === 'student',
        then: Yup.string()
          .max(2, `Experience cannot be more than ${2} characters`)
          .required('Experience is required for student role')
          .nullable(),
        otherwise: Yup.string().when('role', {
          is: (role: string) => role === 'mentor',
          then: Yup.string().nullable()
        })
      }),
      avatar: Yup.mixed()
    },
    [['email', 'phone']]
  );

  const EditUserSchema = Yup.object().shape(
    {
      name: Yup.string()
        .max(50, `Full name cannot be more than ${50} characters`)
        .required('Full name is required'),
      phone: Yup.string()
        .matches(/^([7-9][0-9]{9})$/, 'Enter valid phone number')
        .required('Phone number is required'),
      email: Yup.string().email().required('Enter valid email-id'),
      role: Yup.string().required('Role is Required'),
      password: Yup.string()
        .min(8, `Password must be atleast ${8} characters`)
        .max(20, `Password cannot be more than ${20} characters`)
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,20}\S$/,
          `Password must contain - One uppercase, one lowercase, one special character, no spaces and of ${
            8 - 20
          } characters.`
        ),
      experience: Yup.string().when('role', {
        is: (role: string) => role === 'student',
        then: Yup.string()
          .max(2, `Experience cannot be more than ${2} characters`)
          .required('Experience is required for student role')
          .nullable(),
        otherwise: Yup.string().when('role', {
          is: (role: string) => role === 'mentor',
          then: Yup.string().nullable()
        })
      }),
      avatar: Yup.mixed()
    },
    [['email', 'phone']]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: '',
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      avatar: currentUser?.avatar || null,
      approval: currentUser?.approval || 'inprogress',
      role: currentUser?.role || getRole() || '',
      experience: currentUser?.experience || ''
    },
    validationSchema: isEdit ? EditUserSchema : NewUserSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        setLoading(true);
        if (isEdit) {
          handleEditUser(values, { setErrors, setSubmitting });
        } else {
          handleAddUser(values, { setErrors, setSubmitting });
        }
      } catch (error) {
        handleError(error, setSubmitting, setErrors);
      }
    }
  });

  const handleAddUser = async (
    values: FormikValues,
    { setErrors, setSubmitting }: { setErrors: FormikSetErrors; setSubmitting: any }
  ) => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    await addUser(
      values?.name,
      values?.role,
      values?.phone,
      values?.role === 'student' ? values?.experience : 'not_applicable',
      values?.email,
      values?.password,
      'inprogress'
    ).then((response: any) => {
      if (response?.data?.statusCode) {
        enqueueSnackbar('User added successfully', { variant: 'success' });
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

  const handleEditUser = async (
    values: FormikValues,
    { setErrors, setSubmitting }: { setErrors: FormikSetErrors; setSubmitting: any }
  ) => {
    await editUser(
      currentUser?.id,
      values?.name,
      values?.role,
      values?.phone,
      values?.role === 'student' ? values?.experience : 'not_applicable',
      values?.email,
      currentUser?.approval ? currentUser?.approval : 'inprogress'
    ).then((response: any) => {
      if (response?.data?.statusCode) {
        enqueueSnackbar('User updated successfully', { variant: 'success' });
        if (isMountedRef.current) {
          setSubmitting(false);
          setLoading(false);
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
      setLoading(false);
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
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file && currentUser) {
        const formData = new FormData();
        formData.append('profileImage', file);
        await addAvatar(formData, currentUser.id).then((response: any) => {
          if (response?.data?.statusCode) {
            enqueueSnackbar('User profile avartar uploaded successfully', { variant: 'success' });
          }
        });
        setFieldValue('avatar', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue, currentUser, enqueueSnackbar]
  );

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {isEdit && (
            <Grid item xs={12} md={4}>
              <Card sx={{ py: 10, px: 3 }}>
                <Box sx={{ mb: 5 }}>
                  <UploadAvatar
                    accept="image/*"
                    file={values.avatar}
                    maxSize={2097152}
                    onDrop={handleDrop}
                    error={Boolean(touched.avatar && errors.avatar)}
                    caption={
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 2,
                          mx: 'auto',
                          display: 'block',
                          textAlign: 'center',
                          color: 'text.secondary'
                        }}
                      >
                        Allowed *.jpeg, *.jpg, *.png, *.gif
                        <br /> max size of 2MB
                      </Typography>
                    }
                  />
                  <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                    {touched.avatar && errors.avatar}
                  </FormHelperText>
                </Box>
              </Card>
            </Grid>
          )}

          <Grid item xs={12} md={isEdit ? 8 : 12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    {...getFieldProps('phone')}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Stack>

                {pathname.includes('all-user') && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <FormLabel className={classes.legend} component="legend">
                      Role:
                    </FormLabel>
                    <RadioGroup
                      row
                      value={values?.role}
                      aria-label="role"
                      name="role"
                      id="role"
                      onChange={handleChange}
                    >
                      {user?.role === 'Super Admin' && pathname.includes('all-user') && (
                        <FormControlLabel
                          value="super admin"
                          control={<Radio />}
                          label="Super Admin"
                        />
                      )}
                      {user?.role === 'Super Admin' && pathname.includes('all-user') && (
                        <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                      )}
                      {(user?.role === 'Admin' || user?.role === 'Super Admin') &&
                        (pathname.includes('mentor') || pathname.includes('all-user')) && (
                          <FormControlLabel value="mentor" control={<Radio />} label="Mentor" />
                        )}
                      {(user?.role === 'Admin' || user?.role === 'Super Admin') &&
                        (pathname.includes('student') || pathname.includes('all-user')) && (
                          <FormControlLabel value="student" control={<Radio />} label="Student" />
                        )}
                    </RadioGroup>
                  </Stack>
                )}

                {touched.role && errors.role && (
                  <FormHelperText error={true}>{errors.role}</FormHelperText>
                )}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  {!isEdit && (
                    <TextField
                      fullWidth
                      style={{ width: values?.role === 'student' ? '100%' : '50%' }}
                      autoComplete="current-password"
                      type={showPassword ? 'text' : 'password'}
                      label="Password"
                      {...getFieldProps('password')}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                              <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      error={Boolean(touched.password && errors.password)}
                      helperText={touched.password && errors.password}
                    />
                  )}
                  {values?.role === 'student' ? (
                    <TextField
                      fullWidth
                      autoComplete="experience"
                      type="text"
                      label="Experience"
                      {...getFieldProps('experience')}
                      error={Boolean(touched.experience && errors.experience)}
                      helperText={touched.experience && errors.experience}
                    />
                  ) : (
                    <></>
                  )}
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={loading}>
                    {!isEdit ? `Add ${getRole() || 'User'}` : 'Save Changes'}
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
