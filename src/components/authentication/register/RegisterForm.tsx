import * as Yup from 'yup';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormHelperText
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
//
import { MIconButton } from '../../@material-extend';

// ----------------------------------------------------------------------

type InitialValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  experience: string;
  role: string;
  confirmPassword?: string;
  approval?: string;
  afterSubmit?: string;
};

export default function RegisterForm() {
  const { register } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);

  const RegisterSchema = Yup.object().shape(
    {
      name: Yup.string()
        .max(50, `Full name cannot be more than ${50} characters`)
        .required('Full name is required for registration'),
      phone: Yup.string()
        .matches(/^([7-9][0-9]{9})$/, 'Enter valid phone number')
        .required('Phone number is required for registration'),
      email: Yup.string().email().required('Enter valid email-id'),
      role: Yup.string().required('Select a Role, it is required for registration'),
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
      confirmPassword: Yup.string()
        .required('Required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
      experience: Yup.string().when('role', {
        is: (role: string) => role === 'student',
        then: Yup.string()
          .max(2, `Experience cannot be more than ${2} characters`)
          .required('Experience is required for student registration')
          .nullable(),
        otherwise: Yup.string().when('role', {
          is: (role: string) => role === 'mentor',
          then: Yup.string().nullable()
        })
      })
    },
    [['email', 'phone']]
  );

  const formik = useFormik<InitialValues>({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      experience: '',
      role: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        await register(
          values?.name,
          values?.role,
          values?.phone,
          values?.role === 'mentor' ? 'not_applicable' : values?.experience,
          values?.email,
          values?.password,
          'inprogress'
        ).then((response: any) => {
          if (response?.data?.statusCode) {
            enqueueSnackbar('Register success', {
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

  const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, handleChange } =
    formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Full name"
              {...getFieldProps('name')}
              error={Boolean(touched.name && errors.name)}
              helperText={touched.name && errors.name}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="phone-numer"
            type="text"
            label="Phone Number"
            {...getFieldProps('phone')}
            error={Boolean(touched.phone && errors.phone)}
            helperText={touched.phone && errors.phone}
          />

          <FormLabel component="legend">Role:</FormLabel>

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
          </RadioGroup>
          <FormHelperText error={true}>{errors?.role}</FormHelperText>

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

          <TextField
            fullWidth
            autoComplete="confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm Password"
            {...getFieldProps('confirmPassword')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setConfirmPassword((prev) => !prev)}>
                    <Icon icon={showConfirmPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            helperText={touched.confirmPassword && errors.confirmPassword}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
