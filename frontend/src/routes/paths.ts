// ----------------------------------------------------------------------

import { batch } from 'react-redux';

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify')
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  page404: '/404',
  page500: '/500'
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/overview')
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  mentor: path(ROOTS_DASHBOARD, '/mentor'),
  student: path(ROOTS_DASHBOARD, '/student'),
  batch: path(ROOTS_DASHBOARD, '/batch')
  // {
  //   root: path(ROOTS_DASHBOARD, '/user'),
  //   profile: path(ROOTS_DASHBOARD, '/user/profile'),
  //   cards: path(ROOTS_DASHBOARD, '/user/cards'),
  //   list: path(ROOTS_DASHBOARD, '/user/list'),
  //   newUser: path(ROOTS_DASHBOARD, '/user/new'),
  //   editById: path(ROOTS_DASHBOARD, '/user/ada-lindgren/edit'),
  //   account: path(ROOTS_DASHBOARD, '/user/account')
  // }
};
