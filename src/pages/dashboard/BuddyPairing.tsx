import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { Container } from '@material-ui/core';
// redux
import useAuth from '../../hooks/useAuth';
import { RootState, useDispatch, useSelector } from '../../redux/store';
import { deleteTeam, getTeamList } from '../../redux/slices/lists';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TeamList } from '../../components/_dashboard/team';
import TeamModal from './CreateTeamModal';

// ----------------------------------------------------------------------

export default function BuddyPairing() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [refresh, setRefresh] = useState(false);
  const { buddyList } = useSelector((state: RootState) => state.list);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getTeamList('buddypairing', user?.id));
    setRefresh(false);
  }, [dispatch, refresh, user?.id]);

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

  const handleDeleteTeam = async (id: string) => {
    await deleteTeam(id).then((response) => {
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
              type="buddypairing"
              isEdit={false}
              currentTeam={null}
              setRefresh={setRefresh}
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
