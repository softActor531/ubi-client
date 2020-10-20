import UserIcon from '@material-ui/icons/Group';

import UserList from './UserList';
import UserEdit from './UserEdit';
import UserCreate from './UserCreate';
import { ShowGuesser } from 'react-admin';

export default {
    list: UserList,
    edit: UserEdit,
    create: UserCreate,
    show: ShowGuesser,
    icon: UserIcon,
};
