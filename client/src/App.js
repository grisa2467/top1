import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import UserLayout from "./components/user_layout/UserLayout";
import "./css/styles.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import { Provider } from "react-redux";
import HomePage from "./components/home";
// import ResultPage from "./components/ResultPage";
import PropertyPage from "./components/PropertyPage";
import AboutUsPage from "./components/about_page";
import ContactPage from "./components/contact_page";
import store from "./store";

import BlogPage from "./components/blog_page";
import BlogArticle from "./components/BlogArticle";
import AdminLayout from "./components/admin/admin_layout/AdminLayout";
import AdminLoginPage from "./components/admin/AdminLoginPage";
import AddPropertyPage from "./components/admin/AddPropertyPage";
import Settings from "./components/admin/Settings";
import Groups from "./components/admin/Groups";
import GroupPage from "./components/admin/GroupPage";
import Dashboard from "./components/admin/admin_dashboard/Dashboard";
import EditPropertyPage from "./components/admin/EditPropertyPage";
import AdminAgentPage from "./components/admin/AdminAgentPage";
import ResultPage from "./components/ResultPage";
import SiteInfoSettings from "./components/admin/SiteInfoSettings";
import FavoritePropertiesPage from "./FavoritePropertiesPage";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/admin/login" component={AdminLoginPage} />
          <Route exact path={["/admin/:path?", "/admin/:path/:p2?"]}>
            <AdminLayout>
              <Switch>
                <Route exact path="/admin/" component={Dashboard} />
                <Route
                  exact
                  path="/admin/siteinfo"
                  component={SiteInfoSettings}
                />
                <Route exact path="/admin/add" component={AddPropertyPage} />
                <Route
                  exact
                  path="/admin/edit/:id"
                  component={EditPropertyPage}
                />
                <Route exact path="/admin/settings" component={Settings} />
                <Route exact path="/admin/groups" component={Groups} />
                <Route
                  exact
                  path="/admin/agents/:id"
                  component={AdminAgentPage}
                />
                <Route exact path="/admin/groups/:id" component={GroupPage} />
              </Switch>
            </AdminLayout>
          </Route>
          <Route>
            <UserLayout>
              <Switch>
                <Route exact path="/contact">
                  <ContactPage />
                </Route>
                <Route exact path="/despre">
                  <AboutUsPage />
                </Route>
                {/* <Route exact path="/blog">
                  <BlogPage />
                </Route>
              <Route exact path="/blog/:id" component={BlogArticle} /> */}
                <Route exact path="/favorite">
                  <FavoritePropertiesPage />
                </Route>
                <Route exact path="/apartamente">
                  <ResultPage propertyType={27} />
                </Route>
                <Route exact path="/case">
                  <ResultPage propertyType={28} />
                </Route>
                <Route exact path="/spatii-comerciale">
                  <ResultPage propertyType={30} />
                </Route>
                <Route exact path="/terenuri">
                  <ResultPage propertyType={29} />
                </Route>
                <Route
                  exact
                  path="/agent/:id"
                  render={(props) => <ResultPage {...props} />}
                ></Route>
                {/* <Route exact path="/apartamente" component={FlatsPage}></Route> */}
                {/* <Route exact path="/case" component={HomesPage}></Route> */}
                {/* <Route
                  exact
                  path="/spatii-comerciale"
                  component={CommercialsPage}
                ></Route> */}
                {/* <Route exact path="/terenuri" component={LandsPage}></Route> */}
                <Route
                  exact
                  path="/property/:id"
                  component={PropertyPage}
                ></Route>
                <Route exact path="/">
                  <HomePage />
                </Route>
              </Switch>
            </UserLayout>
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
