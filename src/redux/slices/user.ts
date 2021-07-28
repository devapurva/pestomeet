import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
// utils
import { HTTPClient } from '../../utils/axios';
import {
  Friend,
  Gallery,
  Profile,
  UserPost,
  Follower,
  UserData,
  CreditCard,
  UserInvoice,
  UserManager,
  BatchManager,
  UserAddressBook,
  NotificationSettings,
  TeamManager,
  BatchMembers,
  TeamMember
} from '../../@types/user';

// ----------------------------------------------------------------------

type UserState = {
  isLoading: boolean;
  error: boolean;
  myProfile: null | Profile;
  posts: UserPost[];
  users: UserData[];
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
  followers: Follower[];
  friends: Friend[];
  gallery: Gallery[];
  cards: CreditCard[] | null;
  addressBook: UserAddressBook[];
  invoices: UserInvoice[];
  notifications: NotificationSettings | null;
  metrics: {
    batchCount: number;
    studentCount: number;
    teamCount: number;
  };
};

const initialState: UserState = {
  isLoading: false,
  error: false,
  myProfile: null,
  posts: [],
  users: [],
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
  followers: [],
  friends: [],
  gallery: [],
  cards: null,
  addressBook: [],
  invoices: [],
  notifications: null,
  metrics: {
    batchCount: 0,
    studentCount: 0,
    teamCount: 0
  }
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    emptyUserList(state) {
      state.users = [];
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PROFILE
    getProfileSuccess(state, action) {
      state.isLoading = false;
      state.myProfile = action.payload;
    },

    // GET POSTS
    getPostsSuccess(state, action) {
      state.isLoading = false;
      state.posts = action.payload;
    },

    // GET USERS
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.users = action.payload;
    },

    // DELETE USERS
    // deleteUser(state, action) {
    //   const deleteUser = filter(state.userList, (user) => user.id !== action.payload);
    //   state.userList = deleteUser;
    // },

    // GET FOLLOWERS
    getFollowersSuccess(state, action) {
      state.isLoading = false;
      state.followers = action.payload;
    },

    // ON TOGGLE FOLLOW
    onToggleFollow(state, action) {
      const followerId = action.payload;

      const handleToggle = map(state.followers, (follower) => {
        if (follower.id === followerId) {
          return {
            ...follower,
            isFollowed: !follower.isFollowed
          };
        }
        return follower;
      });

      state.followers = handleToggle;
    },

    // GET FRIENDS
    getFriendsSuccess(state, action) {
      state.isLoading = false;
      state.friends = action.payload;
    },

    // GET GALLERY
    getGallerySuccess(state, action) {
      state.isLoading = false;
      state.gallery = action.payload;
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
      state.mentorTeamList = action.payload;
    },

    // GET BUDDY PAIRING LIST
    getBuddyListSuccess(state, action) {
      state.isLoading = false;
      state.buddyList = action.payload;
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
    },

    // GET CARDS
    getCardsSuccess(state, action) {
      state.isLoading = false;
      state.cards = action.payload;
    },

    // GET ADDRESS BOOK
    getAddressBookSuccess(state, action) {
      state.isLoading = false;
      state.addressBook = action.payload;
    },

    // GET INVOICES
    getInvoicesSuccess(state, action) {
      state.isLoading = false;
      state.invoices = action.payload;
    },

    // GET NOTIFICATIONS
    getNotificationsSuccess(state, action) {
      state.isLoading = false;
      state.notifications = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { onToggleFollow } = slice.actions;

// ----------------------------------------------------------------------

export function getProfile() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.get('/api/user/profile');
      dispatch(slice.actions.getProfileSuccess(response.data.profile));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getPosts() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.get('/api/user/posts');
      dispatch(slice.actions.getPostsSuccess(response.data.posts));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getFollowers() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.get('/api/user/social/followers');
      dispatch(slice.actions.getFollowersSuccess(response.data.followers));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getFriends() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.get('/api/user/social/friends');
      dispatch(slice.actions.getFriendsSuccess(response.data.friends));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getGallery() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.get('/api/user/social/gallery');
      dispatch(slice.actions.getGallerySuccess(response.data.gallery));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

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

export function getTeamList(type: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.get(`/list/team/${type}`);
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

export function getCards() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.get('/api/user/account/cards');
      dispatch(slice.actions.getCardsSuccess(response.data.cards));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getAddressBook() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.get('/api/user/account/address-book');
      dispatch(slice.actions.getAddressBookSuccess(response.data.addressBook));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getInvoices() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.get('/api/user/account/invoices');
      dispatch(slice.actions.getInvoicesSuccess(response.data.invoices));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getNotifications() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.get('/api/user/account/notifications-settings');
      dispatch(slice.actions.getNotificationsSuccess(response.data.notifications));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getUsers() {
  return async () => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.emptyUserList());
    try {
      const response = await HTTPClient.get('/api/user/all');
      dispatch(slice.actions.getUsersSuccess(response.data.users));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

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
  if (response.data.statusCode) {
    const user = {
      name,
      role,
      phone,
      experience,
      email,
      password,
      approval
    };
  }
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
  if (response.data.statusCode) {
    const user = {
      name,
      role,
      phone,
      experience,
      email,
      approval
    };
  }
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
