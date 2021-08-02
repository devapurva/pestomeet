import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { EventInput } from '@fullcalendar/common';
import { dispatch } from '../store';
// utils
import { HTTPClient } from '../../utils/axios';
//
import { CalendarState } from '../../@types/calendar';
import { ResourceManager } from '../../@types/common';

// ----------------------------------------------------------------------

const initialState: CalendarState = {
  isLoading: false,
  error: false,
  events: [],
  resourceEvents: [],
  assignmentEvents: [],
  isOpenModal: false,
  selectedEventId: null,
  selectedRange: null
};

const slice = createSlice({
  name: 'calendar',
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

    // GET EVENTS
    getEventsSuccess(state, action) {
      const resources = action.payload.filter((event: any) => event?.resourceCount > 0);
      const assignments = action.payload.filter((event: any) => event?.hasAssignment);
      state.events = action.payload;
      state.resourceEvents = resources || [];
      state.assignmentEvents = assignments || [];
      state.isLoading = false;
    },

    // CREATE EVENT
    createEventSuccess(state, action) {
      state.isLoading = false;
    },

    // UPDATE EVENT
    updateEventSuccess(state, action) {
      state.isLoading = false;
    },

    // DELETE EVENT
    deleteEventSuccess(state, action) {
      const { eventId } = action.payload;
      const deleteEvent = filter(state.events, (user) => user.id !== eventId);
      state.events = deleteEvent;
    },

    // SELECT EVENT
    selectEvent(state, action) {
      const eventId = action.payload;
      state.isOpenModal = true;
      state.selectedEventId = eventId;
    },

    // SELECT RANGE
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.isOpenModal = true;
      state.selectedRange = { start, end };
    },

    // UPLOAD RESOURCE
    addResourceSuccess(state, action) {
      state.isLoading = false;
    },

    // UPLOAD ASSIGNMENT
    addAssignmentSuccess(state, action) {
      state.isLoading = false;
    },

    // OPEN MODAL
    openModal(state) {
      state.isOpenModal = true;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent } = slice.actions;

// ----------------------------------------------------------------------

export function getEvents(id?: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const url = id ? `/list/myevent/${id}` : '/list/event/masterclass';
      const response = await HTTPClient.get(url);
      if (response?.data?.statusCode) {
        const events = response?.data?.result?.map((element: any) => {
          const obj = {
            ...element,
            id: element.eventId,
            title: element.eventName,
            description: element?.eventDescription,
            start: element.eventStart,
            end: element.eventEnd,
            textColor: element.eventColor
          };
          return obj;
        });
        dispatch(slice.actions.getEventsSuccess(events));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createEvent(newEvent: Omit<EventInput, 'id'>) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.post('/create/event', newEvent);
      dispatch(slice.actions.createEventSuccess(response.data.result));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return error;
    }
  };
}

// ----------------------------------------------------------------------

export function updateEvent(
  eventId: string,
  updateEvent: Partial<{
    eventName: string;
    eventDescription: string;
    eventType: string;
    eventColor: string;
    eventStart: Date | string;
    eventEnd: Date | string;
    organiserId: string;
    organiserName: string;
    hasAssignment: boolean;
    attendees: any[];
  }>
) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.patch(`/edit/event/${eventId}`, updateEvent);
      dispatch(slice.actions.updateEventSuccess(response.data.result));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return error;
    }
  };
}

// ----------------------------------------------------------------------

export function deleteEvent(eventId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.delete(`/delete/event/${eventId}`);
      return response;
      // dispatch(slice.actions.deleteEventSuccess({ eventId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return error;
    }
  };
}

// ----------------------------------------------------------------------

export function selectRange(start: Date, end: Date) {
  return async () => {
    dispatch(
      slice.actions.selectRange({
        start: start.getTime(),
        end: end.getTime()
      })
    );
  };
}

// ----------------------------------------------------------------------

export function addResources(resourceFormData: FormData) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.customRequest({
        url: `/resource/upload`,
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: resourceFormData
      });
      dispatch(slice.actions.addResourceSuccess(response.data.result));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return error;
    }
  };
}

// ----------------------------------------------------------------------

export function getResource(eventId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.get(`/resource/list/${eventId}`);
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return error;
    }
  };
}

// ----------------------------------------------------------------------

export function deleteResource(resourceId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.delete(`/resource/delete/${resourceId}`);
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return error;
    }
  };
}

// ----------------------------------------------------------------------

export function addAssignments(
  assingment: Partial<{
    assignmentName: string;
    assignmentLinks: any;
    uploaderId: string;
    eventID: string;
  }>
) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.post('/create/assignment', assingment);
      dispatch(slice.actions.addAssignmentSuccess(response.data.result));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return error;
    }
  };
}

// ----------------------------------------------------------------------

export function getAssignment(eventId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.get(`/list/assignment/${eventId}`);
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return error;
    }
  };
}

// ----------------------------------------------------------------------

export function deleteAssignment(assignmentId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await HTTPClient.delete(`/delete/assignment/${assignmentId}`);
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return error;
    }
  };
}
