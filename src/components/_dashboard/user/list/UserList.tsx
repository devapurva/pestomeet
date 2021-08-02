import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import closeFill from '@iconify/icons-eva/close-fill';
// material
import { useTheme } from '@material-ui/core/styles';
import {
  Card,
  Table,
  Stack,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination
} from '@material-ui/core';
import MIconButton from 'components/@material-extend/MIconButton';
import { editUser } from '../../../../redux/slices/lists';
// @types
import { UserManager } from '../../../../@types/common';
// utils
import { getComparator, applySortFilter } from '../../../../utils/tableConstants';
// components
import Label from '../../../Label';
import Scrollbar from '../../../Scrollbar';
import { UserListHead, UserMoreMenu } from './index';
import EmptyContent from '../../../EmptyContent';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'phone', label: 'Phone', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'approval', label: 'Approval Status', alignRight: false },
  { id: '', label: 'Actions', alignRight: false }
];

const STUDENT_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'phone', label: 'Phone', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'experience', label: 'Experience', alignRight: false },
  { id: 'approval', label: 'Approval Status', alignRight: false },
  { id: '', label: 'Actions', alignRight: false }
];

// ----------------------------------------------------------------------

type UserListProps = {
  type: string;
  handleRequestSort: any;
  handleClick: any;
  handleChangeRowsPerPage: any;
  handleFilterByName: any;
  handleDeleteUser: any;
  page: number;
  setPage: any;
  order: 'asc' | 'desc';
  selected: string[];
  orderBy: string;
  filterName: string;
  rowsPerPage: number;
  userList: UserManager[];
  setRefresh?: any;
};

export default function UserList({
  type,
  handleRequestSort,
  handleClick,
  handleChangeRowsPerPage,
  handleFilterByName,
  handleDeleteUser,
  page,
  setPage,
  order,
  selected,
  orderBy,
  filterName,
  rowsPerPage,
  userList,
  setRefresh
}: UserListProps) {
  const theme = useTheme();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const getApprovalText = (approval: string) => {
    switch (approval) {
      case 'inprogress':
        return 'IN PROGRESS';
      case 'approved':
        return 'APPROVED';
      case 'deleted':
        return 'DELETED';
      default:
        return 'NA';
    }
  };

  const getRoleText = (approval: string) => {
    switch (approval) {
      case 'student':
        return 'STUDENT';
      case 'mentor':
        return 'MENTOR';
      case 'super admin':
        return 'SUPER ADMIN';
      case 'admin':
        return 'ADMIN';
      default:
        return 'NA';
    }
  };

  const handleApproveUser = async (row: UserManager) => {
    await editUser(
      row?.id,
      row?.name,
      row?.role,
      row?.phone,
      row?.role === 'student' ? row?.experience : 'not_applicable',
      row?.email,
      'approved'
    ).then((response: any) => {
      if (response?.data?.statusCode) {
        enqueueSnackbar('User approved successfully', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      } else {
        enqueueSnackbar('Error. Try Again.', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
      setRefresh(true);
    });
  };

  return (
    <Card style={{ paddingTop: 25 }}>
      {/* <UserListToolbar
        numSelected={selected.length}
        filterName={filterName}
        onFilterName={handleFilterByName}
      /> */}

      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <UserListHead
              order={order}
              orderBy={orderBy}
              headLabel={type === 'mentor' || type === 'all' ? TABLE_HEAD : STUDENT_HEAD}
              rowCount={userList.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const { id, name, role, experience, approval, avatar, email, phone } = row;
                  const isItemSelected = selected.indexOf(name) !== -1;

                  return (
                    <TableRow
                      hover
                      key={id}
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                    >
                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar alt={name} src={avatar} />
                          <Typography variant="subtitle2" noWrap>
                            {name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{email}</TableCell>
                      <TableCell align="left">{phone}</TableCell>
                      <TableCell align="left">
                        <Label
                          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                          color={
                            (role === 'mentor' && 'info') ||
                            (role === 'super admin' && 'primary') ||
                            (role === 'admin' && 'error') ||
                            'warning'
                          }
                        >
                          {getRoleText(role)}
                        </Label>
                      </TableCell>
                      {type === 'all' ||
                        (type === 'student' && <TableCell align="left">{experience}</TableCell>)}
                      <TableCell align="left">
                        <Label
                          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                          color={
                            (approval === 'approved' && 'success') ||
                            (approval === 'inprogress' && 'warning') ||
                            'error'
                          }
                        >
                          {getApprovalText(approval)}
                        </Label>
                      </TableCell>

                      <TableCell align="left">
                        <UserMoreMenu
                          setRefresh={setRefresh}
                          currentUser={row}
                          onDelete={() => handleDeleteUser(id)}
                          onApprove={() => handleApproveUser(row)}
                          userName={name}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            {userList?.length === 0 && (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                    <EmptyContent title="No Data Found Yet" />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={userList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, page) => setPage(page)}
        onRowsPerPageChange={(e) => handleChangeRowsPerPage}
      />
    </Card>
  );
}
