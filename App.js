import SearchBoxUserAddressList from "./component/SearchBoxUserAddressList";
import FormUserAddressInfo from "./component/FormUserAddressInfo";
import { Switch,Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={SearchBoxUserAddressList}/>
        <Route exact path="/add_address" component={FormUserAddressInfo}/>
        <Route exact path="/edit_address/:id" component={FormUserAddressInfo}/>
      </Switch>
    </div>
  );
}

export default App;
