import SessionIcon from '@material-ui/icons/LibraryBooks';

import SessionList from './SessionList';
import { ShowGuesser } from 'react-admin';

export default {
    list: SessionList,
    show: ShowGuesser,
    icon: SessionIcon,
};
