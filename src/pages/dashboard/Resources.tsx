import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
// material
import { Container } from '@material-ui/core';
// redux
import useAuth from '../../hooks/useAuth';
import { RootState, useDispatch, useSelector } from '../../redux/store';
import { deleteTeam } from '../../redux/slices/lists';
import { getEvents } from '../../redux/slices/calendar';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ResourcesList from '../../components/_dashboard/resources/ResourcesList';
import ResourceModal from './AddResources';

// ----------------------------------------------------------------------

export default function Resources() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [refresh, setRefresh] = useState(false);
  const { resourceEvents } = useSelector((state: RootState) => state.calendar);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getEvents(user?.id));
    setRefresh(false);
  }, [dispatch, refresh, user?.id]);

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
    <Page title="Resources">
      <Container>
        <HeaderBreadcrumbs
          heading="Resources"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Resources' }]}
          action={<ResourceModal isEdit={false} setRefresh={setRefresh} />}
        />
        <ResourcesList
          type="mentor"
          handleRequestSort={handleRequestSort}
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
          userList={resourceEvents}
          setRefresh={setRefresh}
        />
      </Container>
    </Page>
  );
}
