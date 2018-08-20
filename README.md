# Weather App 

### Search Bar set up
   - it will be a container because it needs to talk to redux
   - just created search input box and submit button

### Controlled Compoent and Binding-Context
   - added `placeholder`, `className`, `value={this.state.term}` and `onChange={this.onInputChange}` to the `<input />`
   - the `onInputChange()` method would not get the `this` binding
   - ```
      onInputChange(event){
         console.log(event.target.value);
      }
      ```
   - binding the `onInputChange` method with component
      ```
      this.onInputChange = this.onInputChange.bind(this);
      ```
### Form Elements
   - `onClick` handler and also the url changes with `?` while pressing enter that submiting it by default
   - so `onSubmit = {this.onFormSubmit}`
   - ```
      onFormSubmit(event) {
         event.preventDefault(); // 
      }
      ```

### API-signup
- simple signup at https://home.openweathermap.org/
- put the generated API_KEY in the `actions/index.js`

### Middleware
-      they are function that take action, and depending on the action type and payload 
      Lets the action pass through, manipulates it, logs it or stops it
      - they stop any action and inspect it
      - before they reach any reducer
      - using `redux-promise` library for AJAX requests from the weather api to `redux`

### AJAX requests with Axios
- in `actions/index.js`
```
      export const FETCH_WEATHER = 'FETCH_WEATHER';
      export function fetchWeather(){
            return {
                  type: 'FETCH_WEATHER'
            }
      }
```
- have the copied url from the API url as the ROOT_URL in our action
      ```
      const ROOT_URL=`http://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}`
      ```
- to get the city, country name 
      ```
      const url = `${ROOT_URL}&q=${city},us`;
      ```
- A simple AJAX request will be handled by `AXIOS` library
      ```
      const request = axios.get(url)
      ```it will return a promise
- so pass that request into our action as `payload`

### Redux promise in practice
- in the search-bar.js
      ```
      import { connect } from 'react-redux`;
      import { bindActionCreator } from 'redux`;
      import { fetchWeather } from '../actions/index`;
      ```

      then dispatching all the props from this container's state to the redux reducer
      ```
      function mapDispatchToProps(dispatch){
            return bindActionCreators({ fetchWeather }, dispatch);
      }

      export default connect(null, mapDispatchToProps)(SearchBar);
      ```

      bind the onFormSubmit method to the container state as well
      ```
      this.onFormSubmit = this.onFormSubmit.bind(this);
      ```
      - also adding this term to `onFormSubmit` with and also clearing the term with `setState` so that searchBar component will re-render without anything i.e., blank
      ```
      onFormSubmit(event){
            event.preventDefault();

            //we need to go and fetch weather data
            this.props.fetchWeather(this.state.term);
            this.setState({ term: '' });
      }
      ```
### New Reduer FetchWeather
- reducer_weather.js contains
      ```
      export default function(state = null, action){
            console.log(`Action Created ${action}`);
            return state;
      }
      ```
- Adding that to RootReducer /reducers/index.js
      
      ```
      import { WeatherReducer } from './reducer_weather';
      
      const rootReducer = combineReducers({
            //state: (state = () => state);
            weather: WeatherReducer
      });      
      ```
- now in Action Creator, just
      
      ```
      console.log('Request: ', request)
      ```      

- Redux-promise (middleware) looks at the in-coming action and looks at specifically `payload` property
if the `payload` is a `promise`, redux-promise stops the action entirely
here's an action and caught the `payload` of a `promise`, it would take care about it

- once the request finishes it dispatches a new action of the same `type` but with the `payload` of the resolved `request`
so in short it **unwraps** the `promise` for us

- this the promise that reducers really don't care about they really care about the data, so it stops the action it waits until the `promise` resolves and then it says I got the **resolved data**, here's the request from the server, I'm gonna now send that (Data) to the `reducer` as the **payload**
      it would be horrible to end up with a promise inside the Reducer

- basically if the action has a promise as a payload, then it will stop the action
      after the promise resolves, **create a new action and send it to reducers** , after the AJAX requests finished
- this all happens because of **axios** which gets the data **asynschonously** but makes it look like **synchronous** 

- now remove /actions/index.js
      ```
      console.log(`Request: ${request}`);
      ```
      and in /reducers/reducer_weather.js
      ```
      console.log(`Action Received: ${action}`);
      ```

### Avoiding State Mutations in reducer
- 