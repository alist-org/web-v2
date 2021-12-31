import { Center, Heading, Spinner } from '@chakra-ui/react'
import React, { lazy, Suspense } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
const Index = lazy(() => import('./pages/list'))
const Manage = lazy(() => import('./pages/manage'))

function App() {
  
  return (
    <div className="App">
      <Router>
        <Suspense fallback={<Center h='100vh'><Spinner color="teal.300" size="xl" /></Center>}>
        <Switch>
          <Route path="/@manage/">
            <Manage />
          </Route>
          <Route path="*">
            <Index />
          </Route>
        </Switch>
        </Suspense>
      </Router>
    </div>
  )
}

export default App
