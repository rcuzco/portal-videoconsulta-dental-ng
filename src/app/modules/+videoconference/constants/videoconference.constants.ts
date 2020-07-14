/**
 * Shared router constants of our application.
 */
export const VIDEOCONFERENCE_CONSTANTS = {
  URL_PARAM_ATTENDANT: 'access',
  MONTHS: {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
  },
  DISCONNECTED_STATUS: {
    OVER: 'over',
    NOT_STARTED: 'not_started',
    HUNG_UP: 'hung_up'
  },
  ICON_BUTTONS: {
    SPEAKER: 'speaker',
    SPEAKER_OFF: 'speaker-off',
    MIC: 'mic',
    MIC_OFF: 'mic-off',
    CAMERA: 'camera',
    CAMERA_OFF: 'camera-off',
    MINIATURE: 'miniature',
    PHONE_OFF: 'phone-off',
    SHARE_SCREEN: 'share-screen'
  },
  VIDEO_EVENTS: {
    STREAM_CREATED: 'streamCreated',
    STREAM_DESTROYED: 'streamDestroyed',
    SIGNAL: {
      EMPTY: 'signal',
      HUNG_UP: 'signal:hungUp',
      MSG: 'signal:msg',
      FILE: 'signal:file',
      FILE_PDF_END: 'signal:file-pdf-end',
      FILE_IMAGE_END: 'signal:file-image-end'
    },
    HUNG_UP: 'hungUp',
    MEDIA_STOPPED: 'mediaStopped'
  },
  CHAT: {
    OWNER_MINE: 'mine',
    OWNER_THEIRS: 'theirs',
    MESSAGE_TYPES: {
      MSG: 'msg',
      FILE: 'file',
      FILE_PDF_END: 'file-pdf-end',
      FILE_IMAGE_END: 'file-image-end'
    },
    ERROR_FILE_SIZE: 'errorSize',
    ERROR_FILE_TYPE: 'errorType'
  },
  SCREEN_SHARING: {
    SCREEN : 'screen',
    MAXRESOLUTION : {
      WIDTH: 1920,
      HEIGHT: 1080
    },
    REASONS: {
      CLIENT_DISCONNECTED: 'clientDisconnected'
    }
  }
};
