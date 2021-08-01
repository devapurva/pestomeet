import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
// material
import { useTheme } from '@material-ui/core/styles';
import {
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination
} from '@material-ui/core';
// @types
import { TeamManager, TeamMember } from '../../../@types/common';
// components
import Label from '../../Label';
import Scrollbar from '../../Scrollbar';
import { TableListHead, TableMoreMenu } from './list';
import EmptyContent from '../../EmptyContent';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'teamName', label: 'Team Name', alignRight: false },
  { id: 'mentorName', label: 'Team Mentor', alignRight: false },
  { id: 'teamType', label: 'Team Type', alignRight: false },
  { id: 'teamMembers', label: 'Team Members', alignRight: false },
  { id: '', label: 'Actions', alignRight: false }
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

type TeamListProps = {
  type: string;
  handleRequestSort: any;
  handleSelectAllClick: any;
  handleClick: any;
  handleChangeRowsPerPage: any;
  handleFilterByName: any;
  handleDeleteTeam: any;
  page: number;
  setPage: any;
  order: 'asc' | 'desc';
  selected: string[];
  orderBy: string;
  filterName: string;
  rowsPerPage: number;
  userList: TeamManager[];
  setRefresh: any;
};

export default function TeamList({
  type,
  handleRequestSort,
  handleSelectAllClick,
  handleClick,
  handleChangeRowsPerPage,
  handleFilterByName,
  handleDeleteTeam,
  page,
  setPage,
  order,
  selected,
  orderBy,
  filterName,
  rowsPerPage,
  userList,
  setRefresh
}: TeamListProps) {
  const theme = useTheme();

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const getMembersName = (teamMembers: TeamMember[]) => {
    const names = teamMembers.map((element) => element.name);
    return names.toString();
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
            <TableListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={userList.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const { teamId, teamName, mentorName, teamType, teamMembers } = row;
                  const isItemSelected = selected.indexOf(teamName) !== -1;

                  return (
                    <TableRow
                      hover
                      key={teamId}
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                    >
                      <TableCell align="left">{sentenceCase(teamName)}</TableCell>
                      <TableCell align="left">{mentorName}</TableCell>
                      <TableCell align="left">
                        <Label
                          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                          color={(teamType === 'mentor' && 'success') || 'info'}
                        >
                          {teamType === 'buddypairing' ? 'Buddy Pairing' : 'Mentor Team'}
                        </Label>
                      </TableCell>
                      <TableCell align="left">{getMembersName(teamMembers)}</TableCell>
                      {/* <TableCell align="left">{experience}</TableCell>
                      <TableCell align="left">
                        <Label
                          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                          color={(approval === 'approved' && 'success') || 'error'}
                        >
                          {sentenceCase(approval)}
                        </Label>
                      </TableCell> */}

                      <TableCell align="left">
                        <TableMoreMenu
                          type={type}
                          setRefresh={setRefresh}
                          currentTeam={row}
                          onDelete={() => handleDeleteTeam(teamId)}
                          userName={teamName}
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
