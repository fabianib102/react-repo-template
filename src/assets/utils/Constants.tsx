type Rendition = {
  label: string;
  w: number;
  h: number;
};

export default class Constants {
  static readonly CHANNEL_ENDPOINT: string = 'channels';
  static readonly UPDATE_INGEST_ENDPOINT: string = 'update-ingest-endpoint';
  static readonly SEND_INVITATION_ENDPOINT: string = 'send-invitation';
  static readonly GENERATE_CREDENTIALS_ENDPOINT: string = 'credentials';

  static readonly QVGA: Rendition = {
    label: 'QVGA (320x240px)',
    w: 320,
    h: 240,
  };

  static readonly HD: Rendition = {
    label: 'HD (1280x720px)',
    w: 1280,
    h: 720,
  };

  static readonly UHDV: Rendition = {
    label: '8K (7680x4320px)',
    w: 7680,
    h: 4320,
  };

  static readonly RENDITIONS: Rendition[] = [
    Constants.QVGA,
    {
      label: 'VGA (640x480px)',
      w: 640,
      h: 480,
    },
    Constants.HD,
    {
      label: 'FullHD (1920x1080px)',
      w: 1920,
      h: 1080,
    },
    {
      label: '4K (4096x1260px)',
      w: 4096,
      h: 1260,
    },
    Constants.UHDV,
  ];

  static readonly STREAM_MANAGER = {
    BROADCAST: 'broadcast',
    BROADCAST_ABR: 'broadcast_abr',
    SUBSCRIBE: 'subscribe',
    RETRIES: 5,
    RETRY_TIMEOUT_MS: 4000,
  };

  static readonly AUTH_STEPS = {
    LOGGING_IN: 'LOGGING_IN',
    LOGGED_IN: 'LOGGED_IN',
    LOGGING_OUT: 'LOGGING_OUT',
    LOGGED_OUT: 'LOGGED_OUT',
  };

  static readonly SUCCESS = 'SUCCESS';

  static readonly ERROR = 'ERROR';

  static readonly WARNING = 'WARNING';

  static readonly RTMP_PROTOCOL = 'RTMP';

  static readonly WEBRTC_PROTOCOL = 'WebRTC';

  static readonly ORIGIN_REQUEST_SUCCESS = 'Origin endpoint correctly updated';

  static readonly ORIGIN_REQUEST_ERROR = 'An error ocurred during origin request. Please try again.';

  static readonly PUBLISHING_ERROR = "Can't publish, an error occurred. Please try again.";

  static readonly UNPUBLISHING_ERROR = "Can't unpublish, an error occurred.";

  static readonly SCREEN_SHARE_ERROR = 'Could not share your screen. Please try again';

  static readonly GET_CHANNEL_ERROR = 'Error getting conference data. Please try again.';

  static readonly ABR_STREAM_PROVISION_ERROR = 'Error providing stream for ABR. Please try again.';

  static readonly ABR_DELETE_STREAM_PROVISION_ERROR = 'Error deleting stream for ABR. Please try again.';

  static readonly ABR_STREAM_PROVISION_ERROR_EXISTS = 'Provision already exists';

  static readonly CHANNEL_LABEL = 'Conference';

  static readonly CHANNEL_CREATION_SUCCESS = 'Conference successfully created';

  static readonly CHANNEL_CREATION_ERROR = 'Error creating Conference: ';

  static readonly CHANNEL_DELETION_SUCCESS = 'Conference successfully deleted';

  static readonly CHANNEL_DELETION_ERROR = 'Error deleting Conference';

  static readonly SEND_INVITATION_SUCCESS = 'Invitation successfully sent';

  static readonly SEND_INVITATION_ERROR = 'An error occurred when sending the invitation, please try again';

  static readonly CHANNEL_ERROR = 'Conference';

  static readonly LIVE = 'live';

  static readonly HOME_PATH = 'home';

  static readonly SEND_INVITATION = 'SEND INVITATION';

  static readonly CHAT_PATH = 'chat';

  static readonly CHAT_ROOM = 'Chat Room';

  static readonly PLAYER_PATH = 'player';

  static readonly CONSUMER_APP_PATH = 'consumer-app';

  static readonly INFRASTRUCTURE_PATH = 'infrastructure';

  static readonly QUERY = '?streamName=';

  static readonly NICKNAME_QUERY = 'userName=';

  static readonly DEFAULT_TITLE = 'ULL Platform - Admin Portal';

  static readonly MEDIA_DEVICES = 'Media Devices';

  static readonly PUBLISHER = 'publisher';

  static readonly SUBSCRIBER = 'subscriber';

  static readonly SCREEN_SHARE_PUBLISHER = 'screen-share';

  static readonly MEDIA_DEVICES_NOT_AVAILABLE = 'The selected Media Device is not available. Please try again';

  static readonly STARTING_CO_STREAMING = 'Starting to Co-streaming';

  static readonly STARTING_CO_STREAMING_ERROR = "Can't starting a Co-streaming session, an error occurred. Please try again";

  static readonly STOP_CO_STREAMING = 'Stopping Co-streaming';

  static readonly STOPPING_CO_STREAMING_ERROR = "Can't stopping the Co-streaming session, an error occurred. Please try again";

  static readonly OFFLINE_STREAMING_MESSAGE = 'This event is currently offline';

  static readonly UNABLE_TO_ACCESS = 'Unable to Access to Conference. Please try again Later';

  static readonly GRID_PREVIEW_MAX_VIDEOS_IN_SCREEN = 9;

  static STOP_SIGNAL_METHOD_NAME(userName: string) {
    return `${userName}-stop`;
  }

  static readonly AUTH = {
    LOCAL_STORAGE_KEY: 'tokens',
    TARGET_URI: `${
      `https://${process.env.REACT_APP_SIGNIN_DOMAIN}${process.env.REACT_APP_REGION}` +
      '.amazoncognito.com/oauth2/authorize?' +
      'response_type=code' +
      '&identity_provider=AzureAD' +
      `&client_id=${process.env.REACT_APP_CLIENT_ID}` +
      `&redirect_uri=${process.env.REACT_APP_IDP_REDIRECT_URL}` +
      '&scope=email+openid+aws.cognito.signin.user.admin'
    }`,
    COGNITO_LAST_AUTH_USER_KEY: `CognitoIdentityServiceProvider.${process.env.REACT_APP_CLIENT_ID}.LastAuthUser`,
    COGNITO_ID_TOKEN_KEY: (userId: string | null) => `CognitoIdentityServiceProvider.${process.env.REACT_APP_CLIENT_ID}.${userId}.idToken`,
    CODE_PARAM: '?code=',
    EVENTS: {
      SIGN_IN: 'signIn',
      TOKEN_REFRESH: 'tokenRefresh',
    },
  };

  static readonly SPEAKER_PATH = 'speaker';
  static readonly CONFERENCE_PATH = 'conference';
  static readonly LOGIN_PATH = 'login';

  static MEDIA_DEVICES_RESOLUTION_ERROR(constraints: { width: { exact: number }; height: { exact: number } }) {
    if (!constraints.width || !constraints.height) {
      return `Media devices are not available. Please reaview your configuration`;
    }

    return `Resolution ${constraints.width.exact}x${constraints.height.exact} px not available. Please select another one`;
  }

  static MEDIA_DEVICES_SELECTED(constraints: { device: string; width: number; height: number }) {
    return `Active Resolution: ${constraints.width}x${constraints.height} px on ${constraints.device}`;
  }

  static readonly STREAM_ACTIONS = {
    SCREEN_SHARE: 'ScreenShare',
    PUBLISH: 'Publish',
  };

  static readonly PARTICIPANT_ROLES = {
    VIEWERS: 'viewers',
    STREAMERS: 'streamers',
    LOBBY: 'lobby',
    ENDED: 'ended',
  };

  static readonly STATUS = {
    OFFLINE: 'offline',
    Offline: 'Offline',
    ONLINE: 'online',
    Live: 'Live',
  };

  static readonly INVITATION_MODAL = {
    TITLE: 'Invitation',
    BODY: 'The presenter has invited you to collaborate in this session. Do you want to join?',
  };

  static readonly DEVICE_SETTINGS = {
    TITLE: 'Configure your devices for co-streaming',
  };

  static readonly CHAT_TOOLTIP_MESSAGE = {
    EXPAND: 'Expand',
    COLLAPSE: 'Collapse',
  };

  static readonly SEND_INVITATION_TOOLTIP_MESSAGE = {
    EMAILS: 'Emails must be separated by commas',
    CELLPHONES: 'Cellphones numbers must be separated by commas',
  };

  static readonly TIMER = {
    GET_TIME_INTERVAL: 500,
    GET_STATS_INTERVAL: 3000,
  };

  static readonly EC2_INSTANCE_STATES = {
    PENDING: 'pending',
    RUNNING: 'running',
    SHUTTING_DOWN: 'shutting-down',
    TERMINATED: 'terminated',
    STOPPING: 'stopping',
    STOPPED: 'stopped',
  };

  static readonly RED5PRO_SUBSCRIBER_PLAYBACK_STATES = {
    AVAILABLE: 'Playback.AVAILABLE',
  };

  static readonly SUBSCRIBER_CREDENTIALS = {
    username: 'subscriber',
    password: 'subscriber',
    token: 'subscriber',
  };
}
