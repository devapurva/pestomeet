import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import { useTheme } from '@material-ui/core/styles';
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  responsiveFontSizes
} from '@material-ui/core';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
import { deleteTeam, getTeamList, getAllUserList } from '../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// @types
import { TeamManager } from '../../@types/user';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import TeamList from '../../components/_dashboard/team/teamList';
import TeamModal from './CreateTeamModal';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'phone', label: 'Phone', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'experience', label: 'Experience', alignRight: false },
  { id: 'approval', label: 'Approval Status', alignRight: false }
];

// ----------------------------------------------------------------------

type Anonymous = Record<string | number, string>;

function descendingComparator(a: Anonymous, b: Anonymous, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: Anonymous, b: Anonymous) => descendingComparator(a, b, orderBy)
    : (a: Anonymous, b: Anonymous) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(
  array: TeamManager[],
  comparator: (a: any, b: any) => number,
  query: string
) {
  const stabilizedThis = array.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_team) => _team.teamName.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function BuddyPairing() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [refresh, setRefresh] = useState(false);
  const { buddyList, userList } = useSelector((state: RootState) => state.user);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getAllUserList());
    dispatch(getTeamList('buddypairing'));
  }, [dispatch]);

  useEffect(() => {
    if (refresh) {
      dispatch(getAllUserList());
      dispatch(getTeamList('buddypairing'));
      setRefresh(false);
    }
  }, [refresh]);

  const mentors = userList.filter((users) => users.role === 'mentor');
  const students = userList.filter((users) => users.role === 'student');

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = buddyList.map((n) => n.teamName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - buddyList.length) : 0;

  //   const filteredUsers = applySortFilter(buddyList, getComparator(order, orderBy), filterName);

  //   const isUserNotFound = filteredUsers.length === 0;

  const handleDeleteTeam = async (id: string) => {
    await deleteTeam(id).then((response) => {
      console.log(response);
      if (response?.data?.statusCode) {
        enqueueSnackbar('Team deleted successfully', {
          variant: 'success'
        });
        setRefresh(true);
      }
    });
  };

  return (
    <Page title="Teams: List">
      <Container>
        <HeaderBreadcrumbs
          heading="Buddy Pairings"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Buddy Pairing' }]}
          action={
            <TeamModal
              isEdit={false}
              currentTeam={null}
              setRefresh={setRefresh}
              mentors={mentors}
              students={students}
            />
          }
        />
        <TeamList
          type="mentor"
          handleRequestSort={handleRequestSort}
          handleSelectAllClick={handleSelectAllClick}
          handleClick={handleClick}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleFilterByName={handleFilterByName}
          handleDeleteTeam={handleDeleteTeam}
          page={page}
          setPage={setPage}
          order={order}
          selected={selected}
          orderBy={orderBy}
          filterName={filterName}
          rowsPerPage={rowsPerPage}
          userList={buddyList}
          setRefresh={setRefresh}
        />
      </Container>
    </Page>
  );
}