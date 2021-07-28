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
import useAuth from '../../hooks/useAuth';
import { RootState, useDispatch, useSelector } from '../../redux/store';
import { deleteBatch, getBatchList, getAllUserList } from '../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// @types
import { BatchManager } from '../../@types/user';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import BatchList from '../../components/_dashboard/batch/batchList';
import BatchModal from './CreateBatchModal';

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
  array: BatchManager[],
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
      (_batch) => _batch.batchName.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Batches() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [refresh, setRefresh] = useState(false);
  const { batchList, userList } = useSelector((state: RootState) => state.user);
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getAllUserList());
    dispatch(getBatchList(user?.id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (refresh) {
      dispatch(getAllUserList());
      dispatch(getBatchList(user?.id));
      setRefresh(false);
    }
  }, [refresh]);

  const admins = userList.filter((users) => users.role === 'admin');
  const otherUsers = userList.filter(
    (users) => users.role === 'mentor' || users.role === 'student'
  );

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = batchList.map((n) => n.batchName);
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

  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - batchList.length) : 0;

  // const filteredUsers = applySortFilter(batchList, getComparator(order, orderBy), filterName);

  // const isUserNotFound = filteredUsers.length === 0;

  const handleDeleteBatch = async (id: string) => {
    await deleteBatch(id).then((response) => {
      console.log(response);
      if (response?.data?.statusCode) {
        enqueueSnackbar('Batch deleted successfully', {
          variant: 'success'
        });
        setRefresh(true);
      }
    });
  };

  return (
    <Page title="Batches: List">
      <Container>
        <HeaderBreadcrumbs
          heading="Batches List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Batches', href: PATH_DASHBOARD.batch }
          ]}
          action={
            <BatchModal
              isEdit={false}
              currentBatch={null}
              setRefresh={setRefresh}
              admins={admins}
              otherUsers={otherUsers}
            />
          }
        />
        <BatchList
          type="mentor"
          handleRequestSort={handleRequestSort}
          handleSelectAllClick={handleSelectAllClick}
          handleClick={handleClick}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleFilterByName={handleFilterByName}
          handleDeleteBatch={handleDeleteBatch}
          page={page}
          setPage={setPage}
          order={order}
          selected={selected}
          orderBy={orderBy}
          filterName={filterName}
          rowsPerPage={rowsPerPage}
          userList={batchList}
          setRefresh={setRefresh}
          admins={admins}
          otherUsers={otherUsers}
        />
      </Container>
    </Page>
  );
}
