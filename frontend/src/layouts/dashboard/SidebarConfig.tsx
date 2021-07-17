import GroupIcon from '@material-ui/icons/Group';
import CastForEducationIcon from '@material-ui/icons/CastForEducation';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);
const ICONS = {
  student: getIcon('ic_user'),
  mentor: <GroupIcon />,
  batch: <CastForEducationIcon />,
  calendar: getIcon('ic_calendar'),
  dashboard: getIcon('ic_dashboard')
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      {
        title: 'overview',
        path: PATH_DASHBOARD.general.app,
        icon: ICONS.dashboard
      }
    ]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // MANAGEMENT : USER
      {
        title: 'Students',
        path: PATH_DASHBOARD.student,
        icon: ICONS.student
      },
      {
        title: 'Mentors',
        path: PATH_DASHBOARD.mentor,
        icon: ICONS.mentor
      },
      {
        title: 'Batches',
        path: PATH_DASHBOARD.batch,
        icon: ICONS.batch
      }
    ]
  },

  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'app',
    items: [{ title: 'calendar', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar }]
  }
];

export default sidebarConfig;
