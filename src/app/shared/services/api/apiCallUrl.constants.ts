export const API_CALL_URL = {
  DEMO: {
    path: '/demo',
    params: {
    }
  },
  DEMO2: {
    path: '/demo/{id}',
    params: {
      id: {
        key: 'id',
        value: ''
      }
    }
  },
  ROOM_ACCESS: {
    path: '/rooms/accesses/{attendantId}',
    params: {
      attendantId: {
        key: 'attendantId',
        value: ''
      }
    }
  }
};
