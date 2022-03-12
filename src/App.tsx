import { Center, Heading, Spinner } from "@chakra-ui/react";
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
const Index = lazy(() => import("./pages/list"));
const Manage = lazy(() => import("./pages/manage"));
import { ClimbingBoxLoader } from "react-spinners";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App">
      <div><Toaster/></div>
      <Router>
        <Suspense
          fallback={
            <Center h="100vh">
              {/* <Spinner color="#1890ff" size="xl" /> */}
              <ClimbingBoxLoader color="#1890ff" loading={true} size={20} />
            </Center>
          }
        >
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
  );
}

export default App;
