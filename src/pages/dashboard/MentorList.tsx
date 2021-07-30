import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
// material
import { Container, Tab } from '@material-ui/core';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
import { deleteUser, getUserList } from '../../redux/slices/lists';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { UserList } from '../../components/_dashboard/user/list';
import UserCreateModal from './UserCreateModal';

export default function MentorList() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false);
  const { mentorInProgressList, mentorApprovedList } = useSelector(
    (state: RootState) => state.list
  );
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [value, setValue] = useState('1');

  const handleChange = (event: any, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(getUserList('inprogress', 'mentor'));
    dispatch(getUserList('approved', 'mentor'));
    setRefresh(false);
  }, [dispatch, refresh]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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

  const handleDeleteUser = (userId: string) => {
    dispatch(deleteUser(userId)).then((response) => {
      if (response?.data?.statusCode) {
        enqueueSnackbar('Mentor deleted successfully', {
          variant: 'success'
        });
        setRefresh(true);
      }
    });
  };

  return (
    <Page title="Mentors: List">
      <Container>
        <HeaderBreadcrumbs
          heading="Mentor List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Mentor List', href: PATH_DASHBOARD.mentor }
          ]}
          action={<UserCreateModal isEdit={false} currentUser={null} setRefresh={setRefresh} />}
        />
        <TabContext value={value}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="In-Progress" value="1" />
            <Tab label="Approved" value="2" />
          </TabList>
          <TabPanel value="1">
            <UserList
              type="mentor"
              handleRequestSort={handleRequestSort}
              handleClick={handleClick}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              handleFilterByName={handleFilterByName}
              handleDeleteUser={handleDeleteUser}
              page={page}
              setPage={setPage}
              order={order}
              selected={selected}
              orderBy={orderBy}
              filterName={filterName}
              rowsPerPage={rowsPerPage}
              userList={mentorInProgressList}
              setRefresh={setRefresh}
            />
          </TabPanel>
          <TabPanel value="2">
            <UserList
              type="mentor"
              handleRequestSort={handleRequestSort}
              handleClick={handleClick}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              handleFilterByName={handleFilterByName}
              handleDeleteUser={handleDeleteUser}
              page={page}
              setPage={setPage}
              order={order}
              selected={selected}
              orderBy={orderBy}
              filterName={filterName}
              rowsPerPage={rowsPerPage}
              userList={mentorApprovedList}
              setRefresh={setRefresh}
            />
          </TabPanel>
        </TabContext>
      </Container>
    </Page>
  );
}
