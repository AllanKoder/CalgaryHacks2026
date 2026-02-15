// Compatibility layer for flattened route imports.
import {
    community,
    dashboard,
    home,
    login,
    logout,
    questionnaire,
    register,
} from '@/routes';
import events from '@/routes/events';
import comments from '@/routes/comments';

export {
    community,
    dashboard,
    home,
    login,
    logout,
    questionnaire,
    register,
    events,
    comments,
};

export const eventsIndex = events.index;
export const eventsCreate = events.create;
export const eventsStore = events.store;
export const eventsShow = events.show;
export const eventsEdit = events.edit;
export const eventsUpdate = events.update;
export const eventsDestroy = events.destroy;

export const eventsIdentificationCreate = events.identification.create;
export const eventsIdentificationStore = events.identification.store;
export const eventsIdentificationEdit = events.identification.edit;
export const eventsIdentificationUpdate = events.identification.update;
export const eventsIdentificationDestroy = events.identification.destroy;

export const eventsLearningCreate = events.learning.create;
export const eventsLearningStore = events.learning.store;
export const eventsLearningEdit = events.learning.edit;
export const eventsLearningUpdate = events.learning.update;
export const eventsLearningDestroy = events.learning.destroy;

export const commentsStore = comments.store;
export const commentsIndex = comments.index;
