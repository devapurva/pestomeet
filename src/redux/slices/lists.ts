import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
// utils
import { HTTPClient } from '../../utils/axios';
import {
  UserManager,
  BatchManager,
  TeamManager,
  BatchMembers,
  TeamMember
} from '../../@types/common';

// ----------------------------------------------------------------------

type UserState = {
  isLoading: boolean;
  error: boolean;
  userList: UserManager[];
  studentInProgressList: UserManager[];
  studentApprovedList: UserManager[];
  mentorList: UserManager[];
  mentorInProgressList: UserManager[];
  mentorApprovedList: UserManager[];
  batchList: BatchManager[];
  mentorTeamList: TeamManager[];
  buddyList: TeamManager[];
  teamList: TeamManager[];
  resourceList: any[];
  metrics: {
    batchCount: number;
    studentCount: number;
    teamCount: number;
    mentorCount: number;
  };
};

const initialState: UserState = {
  isLoading: false,
  error: false,
  userList: [],
  studentInProgressList: [],
  studentApprovedList: [],
  mentorInProgressList: [],
  mentorApprovedList: [],
  mentorList: [],
  batchList: [],
  mentorTeamList: [],
  buddyList: [],
  teamList: [],
  resourceList: [],
  metrics: {
    batchCount: 0,
    studentCount: 0,
    teamCount: 0,
    mentorCount: 0
  }
};

const slice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET METRICS
    getMetricsSuccess(state, action) {
      state.isLoading = false;
      state.metrics = action.payload;
    },

    // GET MANAGE USERS
    getUserListSuccess(state, action) {
      state.isLoading = false;
      state.userList = action.payload;
    },

    // GET STUDENT IN PROGRESS LIST
    getStudentInProgressListSuccess(state, action) {
      state.isLoading = false;
      state.studentInProgressList = action.payload;
    },

    // GET STUDENT APPROVED LIST
    getStudentApprovedListSuccess(state, action) {
      state.isLoading = false;
      state.studentApprovedList = action.payload;
    },

    // GET MENTOR IN PROGRESS LIST
    getMentorInProgressListSuccess(state, action) {
      state.isLoading = false;
      state.mentorInProgressList = action.payload;
    },

    // GET MENTOR APPROVED LIST
    getMentorApprovedListSuccess(state, action) {
      state.isLoading = false;
      state.mentorApprovedList = action.payload;
    },

    // GET BATCH LIST
    getBatchListSuccess(state, action) {
      state.isLoading = false;
      state.batchList = action.payload;
    },

    // GET MENTOR TEAM LIST
    getMentorTeamListSuccess(state, action) {
      state.isLoading = false;
      state.mentorTeamList = action.payload?.filter((list: any) => list?.teamType === 'mentor');
    },

    // GET BUDDY PAIRING LIST
    getBuddyListSuccess(state, action) {
      state.isLoading = false;
      state.buddyList = action.payload?.filter((list: any) => list?.teamType === 'buddypairing');
    },

    // GET TEAM LIST
    getTeamListSuccess(state, action) {
      state.isLoading = false;
      state.teamList = action.payload;
    },

    // GET RESOURCE LIST
    getResourceListSuccess(state, action) {
      state.isLoading = false;
      state.resourceList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getHomeMetrics(id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.get(`/count/myassets/${id}`);
      dispatch(slice.actions.getMetricsSuccess(response.data.result));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getAllUserByID(id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.get(`/list/students/${id}`);
      dispatch(slice.actions.getUserListSuccess(response.data.result ? response.data.result : []));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getAllUserList() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.get(`/list/user/all`);
      dispatch(slice.actions.getUserListSuccess(response.data.result ? response.data.result : []));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getUserList(approval: string, type: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.get(`/list/user/${approval}/${type}`);
      if (type === 'student') {
        if (approval === 'inprogress') {
          dispatch(
            slice.actions.getStudentInProgressListSuccess(
              response.data.result ? response.data.result : []
            )
          );
        }
        if (approval === 'approved') {
          dispatch(
            slice.actions.getStudentApprovedListSuccess(
              response.data.result ? response.data.result : []
            )
          );
        }
      }
      if (type === 'mentor') {
        if (approval === 'inprogress') {
          dispatch(
            slice.actions.getMentorInProgressListSuccess(
              response.data.result ? response.data.result : []
            )
          );
        }
        if (approval === 'approved') {
          dispatch(
            slice.actions.getMentorApprovedListSuccess(
              response.data.result ? response.data.result : []
            )
          );
        }
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteUser(id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.delete(`/delete/user/${id}`);
      return response;
    } catch (error) {
      return error;
    }
  };
}

// ----------------------------------------------------------------------

export function getBatchList(id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.get(`/list/mybatch/${id}`);
      dispatch(slice.actions.getBatchListSuccess(response.data.result ? response.data.result : []));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export const deleteBatch = async (id: string) => {
  dispatch(slice.actions.startLoading());
  const response = await HTTPClient.delete(`/delete/batch/${id}`);
  return response;
};

// ----------------------------------------------------------------------

export function getTeamList(type: string, id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.get(`/list/myteam/${id}`);
      if (type === 'buddypairing') {
        dispatch(
          slice.actions.getBuddyListSuccess(response.data.result ? response.data.result : [])
        );
      }
      if (type === 'mentor') {
        dispatch(
          slice.actions.getMentorTeamListSuccess(response.data.result ? response.data.result : [])
        );
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export const deleteTeam = async (id: string) => {
  dispatch(slice.actions.startLoading());
  const response = await HTTPClient.delete(`/delete/team/${id}`);
  return response;
};

// ----------------------------------------------------------------------

export const addUser = async (
  name: string,
  role: string,
  phone: string,
  experience: string,
  email: string,
  password: string,
  approval: string
) => {
  const response = await HTTPClient.post('/register', {
    name,
    role,
    phone,
    experience,
    email,
    password,
    approval
  });
  return response;
};

// ----------------------------------------------------------------------

export const addAvatar = async (formData: FormData, id: string) => {
  const response = await HTTPClient.post(`/avatar/upload/${id}`, formData);
  return response;
};

// ----------------------------------------------------------------------

export const editUser = async (
  id: string | undefined,
  name: string,
  role: string,
  phone: string,
  experience: string,
  email: string,
  approval: string
) => {
  const response = await HTTPClient.patch(`/edit/user/${id}`, {
    name,
    role,
    phone,
    experience,
    email,
    approval
  });
  return response;
};

// ----------------------------------------------------------------------

export const addBatch = async (
  batchName: string,
  batchType: string,
  batchOwner: string,
  batchOwnerID: string,
  batchMembers: BatchMembers[] | []
) => {
  const response = await HTTPClient.post('/create/batch', {
    batchName,
    batchType,
    batchOwner,
    batchOwnerID,
    batchMembers
  });
  return response;
};

// ----------------------------------------------------------------------

export const editBatch = async (
  batchId: string,
  batchName: string,
  batchType: string,
  batchOwner: string,
  batchOwnerID: string,
  batchMembers: BatchMembers[] | []
) => {
  const response = await HTTPClient.patch(`/edit/batch/${batchId}`, {
    batchName,
    batchType,
    batchOwner,
    batchOwnerID,
    batchMembers
  });
  return response;
};

// ----------------------------------------------------------------------

export const addTeam = async (
  teamName: string,
  teamType: string,
  mentorName: string,
  mentorId: string,
  batchId: string,
  batchOwnerID: string,
  teamMembers: TeamMember[] | []
) => {
  const response = await HTTPClient.post('/create/team', {
    teamName,
    teamType,
    mentorName,
    mentorId,
    batchId,
    batchOwnerID,
    teamMembers
  });
  return response;
};

// ----------------------------------------------------------------------

export const editTeam = async (
  teamId: string,
  teamName: string,
  teamType: string,
  mentorName: string,
  mentorId: string,
  batchId: string,
  batchOwnerID: string,
  teamMembers: TeamMember[] | []
) => {
  const response = await HTTPClient.patch(`/edit/team/${teamId}`, {
    teamName,
    teamType,
    mentorName,
    mentorId,
    batchId,
    batchOwnerID,
    teamMembers
  });
  return response;
};

// ----------------------------------------------------------------------

export function getResourceList() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.get(`/resource/list`);
      dispatch(
        slice.actions.getResourceListSuccess(response.data.result ? response.data.result : [])
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
