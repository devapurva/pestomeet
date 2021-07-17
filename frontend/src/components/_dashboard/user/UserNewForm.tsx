import * as Yup from 'yup';
import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
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
  IconButton
} from '@material-ui/core';
// utils
import { fData } from '../../../utils/formatNumber';
import { addUser } from '../../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { UserManager } from '../../../@types/user';
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

type UserNewFormProps = {
  isEdit: boolean;
  currentUser?: UserManager;
  setRefresh?: any;
  handleClose?: any;
};

export default function UserNewForm({
  isEdit,
  currentUser,
  setRefresh,
  handleClose
}: UserNewFormProps) {
  const navigate = useNavigate();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);

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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: '',
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      avatar: currentUser?.avatar || null,
      approval: currentUser?.approval,
      role: currentUser?.role || '',
      experience: currentUser?.experience || ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
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
            enqueueSnackbar('User added successfully', {
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
        });
      } catch (error) {
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

  console.log(errors);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3 }}>
              {isEdit && (
                <Label
                  color="success"
                  sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
                >
                  Success
                </Label>
              )}

              <Box sx={{ mb: 5 }}>
                <UploadAvatar
                  accept="image/*"
                  file={values.avatar}
                  maxSize={3145728}
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
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.avatar && errors.avatar}
                </FormHelperText>
              </Box>

              {/* <FormControlLabel
                labelPlacement="start"
                control={
                  <Switch
                    {...getFieldProps('approval')}
                    checked={values.approval === 'approved' ? true : false}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Email Verified
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Disabling this will automatically send the user a verification email
                    </Typography>
                  </>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              /> */}
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
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

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
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
                </Stack>

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
                    <FormControlLabel value="student" control={<Radio />} label="Student" />
                    <FormControlLabel value="mentor" control={<Radio />} label="Mentor" />
                    <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                    <FormControlLabel value="superadmin" control={<Radio />} label="Super Admin" />
                  </RadioGroup>
                  {touched.role && errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                </Stack>

                {values?.role === 'student' && (
                  <TextField
                    fullWidth
                    autoComplete="experience"
                    type="text"
                    label="Experience"
                    {...getFieldProps('experience')}
                    error={Boolean(touched.experience && errors.experience)}
                    helperText={touched.experience && errors.experience}
                  />
                )}

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create User' : 'Save Changes'}
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
