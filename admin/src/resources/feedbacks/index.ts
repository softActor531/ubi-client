import FeedbackIcon from '@material-ui/icons/Feedback';

import FeedbackList from './FeedbackList';
import FeedbackEdit from './FeedbackEdit';
import FeedbackCreate from './FeedbackCreate';
import { ShowGuesser } from 'react-admin';

export default {
    list: FeedbackList,
    show: ShowGuesser,
    edit: FeedbackEdit,
    create: FeedbackCreate,
    icon: FeedbackIcon,
};
