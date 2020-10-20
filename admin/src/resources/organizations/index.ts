import OrganizationIcon from '@material-ui/icons/Domain';

import OrganizationList from './OrganizationList';
import OrganizationEdit from './OrganizationEdit';
import OrganizationCreate from './OrganizationCreate';
import { ShowGuesser } from 'react-admin';

export default {
    list: OrganizationList,
    edit: OrganizationEdit,
    create: OrganizationCreate,
    show: ShowGuesser,
    icon: OrganizationIcon,
};
