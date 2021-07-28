import { Icon, InlineIcon } from '@iconify/react';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import GroupIcon from '@material-ui/icons/Group';
// for students
import accountGroup from '@iconify/icons-mdi/account-group';
// for mentors
import accountTie from '@iconify/icons-mdi/account-tie';
// for batches
import googleClassroom from '@iconify/icons-mdi/google-classroom';
import accountChild from '@iconify/icons-mdi/account-child';
import accountMultiplePlus from '@iconify/icons-mdi/account-multiple-plus';
import newspaperVariantMultipleOutline from '@iconify/icons-mdi/newspaper-variant-multiple-outline';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const IconStyle = styled(Icon)(({ theme }) => ({
  width: '100%',
  height: '100%',
  color: theme.palette.grey[600]
}));

const ICONS = {
  student: <IconStyle icon={accountGroup} />,
  mentor: <IconStyle icon={accountTie} />,
  batch: <IconStyle icon={googleClassroom} />,
  calendar: getIcon('ic_calendar'),
  dashboard: getIcon('ic_dashboard'),
  mentorTeam: <IconStyle icon={accountChild} />,
  buddyPairing: <IconStyle icon={accountMultiplePlus} />,
  resources: <IconStyle icon={newspaperVariantMultipleOutline} />
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
      },
      {
        title: 'Mentor Team',
        path: PATH_DASHBOARD.mentorTeam,
        icon: ICONS.mentorTeam
      },
      {
        title: 'Buddy Pairing',
        path: PATH_DASHBOARD.buddyPairing,
        icon: ICONS.buddyPairing
      },
      {
        title: 'Resources',
        path: PATH_DASHBOARD.resources,
        icon: ICONS.resources
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