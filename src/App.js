import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect
} from "react-router-dom";

/* component */
import ShoppingList from "./ShoppingList";
import Game from "./TicTacToe";
import Clock from "./Clock";
import ForumList from "./ForumList";
import Forum from "./Forum";
import MyWebSocket from "./MyWebSocket";

export default function App() {
  return (
    <Router>
      <div id="router-div" className="wrapper">
        <div className="row">
          <div className="col-md-2" style={{ minHeight: '90vh', borderRight: '2px solid grey' }}>
            <nav>
              <ul>
                <li className="category">Basic</li>
                <li>
                  {/* NavLink will add 'active' class when selected. use Link instead for normal link */}
                  <NavLink to="/home">Home</NavLink>
                </li>
                <li>
                  <NavLink to="/about">About</NavLink>
                </li>
                <li>
                  <NavLink to="/shopping-list">Shopping List</NavLink>
                </li>
                <li>
                  <NavLink to="/tictactoe">Tic Tac Toe</NavLink>
                </li>
                <li>
                  <NavLink to="/clock">Clock</NavLink>
                </li>
                <li className="category">Forum (Calling Web API)</li>
                <li>
                  <NavLink to="/forums">Forum List</NavLink>
                </li>
                <li>
                  <NavLink to="/websocket">Web Socket</NavLink>
                </li>
              </ul>
            </nav>
          </div>
          <div className="col-md-9">
            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              {/* this is default route and must be appended with 'exact' attributes, 
            otherwise all other routes will be considered as default routes */}
              <Route exact path="/"><Redirect to="/home" /></Route>
              <Route path="/home"><Home /></Route>
              <Route path="/about"><About /></Route>
              <Route path="/shopping-list">
                <ShoppingList name="Haris" />
              </Route>
              <Route path="/tictactoe">
                <div style={{ margin: '0 auto', width: '300px' }}><Game /></div>
              </Route>
              <Route path="/clock">
                <Clock />
                <Clock />
                <Clock />
              </Route>
              <Route exact path={["/list-forum", "/forums"]} component={ForumList} />
              {/* <Route path="/create-forum" render={(props) => <Forum {...props} myprops={'someValue'} />} /> */}
              <Route path="/create-forum" component={Forum} />
              <Route path="/forum/:id" component={Forum} />
              <Route path="/websocket"><MyWebSocket /></Route>
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h3>This is a sample of single page apps created with "create-react-app"<br/>with router using "react-router-dom"</h3>;
}
