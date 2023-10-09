import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import PageRenderer from './PageRenderer'
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path= "/" Component={PageRenderer} />
          <Route path= "/:page" Component={PageRenderer} />
          <Route path= "/:page/:slug" Component={PageRenderer} />
        </Routes>
      </Router>
    </div>
  )
}

export default App