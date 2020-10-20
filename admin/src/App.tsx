import React from 'react';
// import { useState, useEffect } from 'react';
import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

import './App.css';

import authProvider from './authProvider';
// import themeReducer from './themeReducer';
// import { Login, Layout } from './layout';

// import { Dashboard } from './dashboard';
// import customRoutes from './routes';

import users from './resources/users';
import organizations from './resources/organizations';
import events from './resources/events';
import appointments from './resources/appointments';
import sessions from './resources/sessions';
import feedbacks from './resources/feedbacks';

// import { PostList, PostEdit, PostCreate, PostIcon } from './posts';
// import visitors from './visitors';
// import orders from './orders';
// import products from './products';
// import invoices from './invoices';
// import categories from './categories';
// import reviews from './reviews';

const App = () => {
    return (
        <Admin
            title=""
            dataProvider={simpleRestProvider('http://localhost:3001/api/admin')}
            // customReducers={{ theme: themeReducer }}
            // customRoutes={customRoutes}
            authProvider={authProvider}
            // dashboard={Dashboard}
            // loginPage={Login}
            // layout={Layout}
        >
            <Resource name="users" {...users} />
            <Resource name="organizations" {...organizations} />
            <Resource name="events" {...events} />
            <Resource name="appointments" {...appointments} />
            <Resource name="sessions" {...sessions} />
            <Resource name="feedbacks" {...feedbacks} />
            {/* <Resource name="customers" {...visitors} />
            <Resource
                name="commands"
                {...orders}
                options={{ label: 'Orders' }}
            />
            <Resource name="invoices" {...invoices} />
            <Resource name="products" {...products} />
            <Resource name="categories" {...categories} />
            <Resource name="reviews" {...reviews} /> */}
        </Admin>
    );
};

export default App;
