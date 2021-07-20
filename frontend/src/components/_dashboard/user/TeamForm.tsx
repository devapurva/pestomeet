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
import { addUser, addAvatar, editUser, addTeam } from '../../../redux/slices/user';
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

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
  { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
  { title: 'Casablanca', year: 1942 },
  { title: 'City Lights', year: 1931 },
  { title: 'Psycho', year: 1960 },
  { title: 'The Green Mile', year: 1999 },
  { title: 'The Intouchables', year: 2011 },
  { title: 'Modern Times', year: 1936 },
  { title: 'Raiders of the Lost Ark', year: 1981 },
  { title: 'Rear Window', year: 1954 },
  { title: 'The Pianist', year: 2002 },
  { title: 'The Departed', year: 2006 },
  { title: 'Terminator 2: Judgment Day', year: 1991 },
  { title: 'Back to the Future', year: 1985 },
  { title: 'Whiplash', year: 2014 },
  { title: 'Gladiator', year: 2000 },
  { title: 'Memento', year: 2000 },
  { title: 'The Prestige', year: 2006 },
  { title: 'The Lion King', year: 1994 },
  { title: 'Apocalypse Now', year: 1979 },
  { title: 'Alien', year: 1979 },
  { title: 'Sunset Boulevard', year: 1950 },
  {
    title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    year: 1964
  },
  { title: 'The Great Dictator', year: 1940 },
  { title: 'Cinema Paradiso', year: 1988 },
  { title: 'The Lives of Others', year: 2006 },
  { title: 'Grave of the Fireflies', year: 1988 },
  { title: 'Paths of Glory', year: 1957 },
  { title: 'Django Unchained', year: 2012 },
  { title: 'The Shining', year: 1980 },
  { title: 'WALL·E', year: 2008 },
  { title: 'American Beauty', year: 1999 },
  { title: 'The Dark Knight Rises', year: 2012 },
  { title: 'Princess Mononoke', year: 1997 },
  { title: 'Aliens', year: 1986 },
  { title: 'Oldboy', year: 2003 },
  { title: 'Once Upon a Time in America', year: 1984 },
  { title: 'Witness for the Prosecution', year: 1957 },
  { title: 'Das Boot', year: 1981 },
  { title: 'Citizen Kane', year: 1941 },
  { title: 'North by Northwest', year: 1959 },
  { title: 'Vertigo', year: 1958 },
  { title: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
  { title: 'Reservoir Dogs', year: 1992 },
  { title: 'Braveheart', year: 1995 },
  { title: 'M', year: 1931 },
  { title: 'Requiem for a Dream', year: 2000 },
  { title: 'Amélie', year: 2001 },
  { title: 'A Clockwork Orange', year: 1971 },
  { title: 'Like Stars on Earth', year: 2007 },
  { title: 'Taxi Driver', year: 1976 },
  { title: 'Lawrence of Arabia', year: 1962 },
  { title: 'Double Indemnity', year: 1944 },
  { title: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
  { title: 'Amadeus', year: 1984 },
  { title: 'To Kill a Mockingbird', year: 1962 },
  { title: 'Toy Story 3', year: 2010 },
  { title: 'Logan', year: 2017 },
  { title: 'Full Metal Jacket', year: 1987 },
  { title: 'Dangal', year: 2016 },
  { title: 'The Sting', year: 1973 },
  { title: '2001: A Space Odyssey', year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: 'Toy Story', year: 1995 },
  { title: 'Bicycle Thieves', year: 1948 },
  { title: 'The Kid', year: 1921 },
  { title: 'Inglourious Basterds', year: 2009 },
  { title: 'Snatch', year: 2000 },
  { title: '3 Idiots', year: 2009 },
  { title: 'Monty Python and the Holy Grail', year: 1975 }
];

export default function TeamForm({
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
  const [showPassword, setShowPassword] = useState(false);

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
    await addTeam(values.teamName, values.teamType, values.mentorName, values.teamMembers).then(
      (response: any) => {
        if (response?.data?.statusCode) {
          enqueueSnackbar('Mentor team added successfully', {
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
                    <FormControlLabel value="buddy" control={<Radio />} label="Buddy Pairing" />
                  </RadioGroup>
                </Stack>

                {touched.teamType && errors.teamType && (
                  <FormHelperText error={true}>{errors.teamType}</FormHelperText>
                )}

                <FormLabel className={classes.legend} component="legend">
                  Team Owner:
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
                          label="Team Owner"
                          placeholder="Owner"
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
