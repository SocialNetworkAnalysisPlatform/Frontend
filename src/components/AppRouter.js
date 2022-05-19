import React from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import Homepage from '../pages/Homepage'
import NotfoundPage from '../pages/NotfoundPage'
import ExplorePage from '../pages/ExplorePage'
import ProjectsPage from '../pages/ProjectsPage'
import ProjectPage from '../pages/ProjectPage'
import ConversationPage from '../pages/ConversationPage'
import NewConversationPage from '../pages/NewConversationPage'
import NewProjectPage from '../pages/NewProjectPage'
import Registerpage from '../pages/Registerpage'
import ResetPasswordPage from '../pages/ResetPasswordPage'
import TestPage from '../pages/TestPage'
import ComparePage from '../pages/ComparePage'
import ProjectSettingsPage from '../pages/ProjectSettingsPage'
import ExploreConversationPage from '../pages/ExploreConversationPage'

const AppRouter = (props) => {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path='/' component={Homepage} />
          <ProtectedRoute exact path='/register' component={Registerpage} />
          <ProtectedRoute exact path='/explore' component={ExplorePage} />
          <ProtectedRoute exact path='/explore/:id' component={ExploreConversationPage} />
          <ProtectedRoute exact path='/projects' component={ProjectsPage} />
          <ProtectedRoute exact path='/projects/:id' component={ProjectPage} />
          <ProtectedRoute exact path='/projects/:id/conversations/:id' component={ConversationPage} />
          <ProtectedRoute exact path='/projects/:id/new-conversation' component={NewConversationPage} />
          <ProtectedRoute exact path='/new-project' component={NewProjectPage} />
          <ProtectedRoute exact path='/project-settings' component={ProjectSettingsPage} />
          <ProtectedRoute exact path='/compare' component={ComparePage} />
          <ProtectedRoute exact path='/test' component={TestPage} />
          <ProtectedRoute
            exact
            path='/forgot-password'
            component={ForgotPasswordPage}
          />
          <ProtectedRoute
            exact
            path='/reset-password'
            component={ResetPasswordPage}
          />
          <Route exact path='*' component={NotfoundPage} />
        </Switch>
      </Router>
    </>
  )
}

function ProtectedRoute(props) {
  const { currentUser } = useAuth()
  const { path } = props
  const location = useLocation()

  if (
    path === '/login' ||
    path === '/register' ||
    path === '/forgot-password' ||
    path === '/reset-password'
  ) {
    return currentUser ? (
      <Redirect to={location.state?.from ?? '/'} />
    ) : (
      <Route {...props} />
    )
  }
  return currentUser ? (
    <Route {...props} />
  ) : (
    <Redirect
      to={{
        pathname: '/',
        state: { from: path },
      }}
    />
  )
}
export default AppRouter
