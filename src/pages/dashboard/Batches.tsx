import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { Container } from '@material-ui/core';
// redux
import useAuth from '../../hooks/useAuth';
import { RootState, useDispatch, useSelector } from '../../redux/store';
import { deleteBatch, getBatchList, getAllUserList } from '../../redux/slices/lists';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import BatchList from '../../components/_dashboard/batch/batchList';
import BatchModal from './CreateBatchModal';

// ----------------------------------------------------------------------

export default function Batches() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [refresh, setRefresh] = useState(false);
  const { batchList, userList } = useSelector((state: RootState) => state.list);
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
    setRefresh(false);
  }, [dispatch, refresh, user?.id]);

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

  const handleDeleteBatch = async (id: string) => {
    await deleteBatch(id).then((response) => {
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
          type="batch"
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
