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

      import { connect } from 'react-redux`;
      import { bindActionCreator } from 'redux`;
      import { fetchWeather } from '../actions/index`;

then dispatching all the props from this container's state to the redux reducer
      
      function mapDispatchToProps(dispatch){
            return bindActionCreators({ fetchWeather }, dispatch);
      }

      export default connect(null, mapDispatchToProps)(SearchBar);
      

bind the onFormSubmit method to the container state as well
     
      this.onFormSubmit = this.onFormSubmit.bind(this);
     
- also adding this term to `onFormSubmit` with and also clearing the term with `setState` so that searchBar component will re-render without anything i.e., blank

      onFormSubmit(event){
            event.preventDefault();

            //we need to go and fetch weather data
            this.props.fetchWeather(this.state.term);
            this.setState({ term: '' });
      }

### New Reduer FetchWeather
- reducer_weather.js contains

      export default function(state = null, action){
            console.log(`Action Created ${action}`);
            return state;
      }

- Adding that to RootReducer /reducers/index.js

      import { WeatherReducer } from './reducer_weather';
      
      const rootReducer = combineReducers({
            //state: (state = () => state);
            weather: WeatherReducer
      });      

- now in Action Creator, just

      console.log('Request: ', request)
 

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
 
      console.log(`Request: ${request}`);

and in /reducers/reducer_weather.js
 
      console.log(`Action Received: ${action}`);


### Avoiding State Mutations in reducer
- in the response we only care about the `data` object `action.payload.data`
- decide what our the initial state would be ( an empty array), so rather than having initialy `state = null` -> `state= []`
- switch statement to handle only the `fetchWeather` action type
      
      import { FETCH_WEATHER } from '../actions/index';
      switch(action.type){
            case FETCH_WEATHER:
                  return [ action.payload.data ]; 
      }
instead of just having a string it would be a variable

- never do something like `state.push( action.payload.data );` it will be mutated and must use **this.setState()**
whenever we are inside a reducer we never mutate a state; we return a completely new state
so we should instead return out a new array entirely
      state.concat([action.payload.data]) because concat puts the new data into the existing one
- ES6 allows a slightly different way
      return [actions.payload.data, ...state]; // just spreaded the state in the new array
- basically we never want to manipulate the state

### Building a List container
- the purpose of this thing to render the list of cities so it needs access to reducer so it would be container
- rendered with a table and import it in the main app
- so use the `reducer_weather.js` and the main reducer we have it as `weather: WeatherReducer` so in the `/containers/weather_list.js`

      ```
      function mapStateToProps(state) {
            return { weather: state.weather }; // which is coming directly from the reducer itself
      }
      ```
 we can directly write `{ weather }` instead of `state.weather`because **ES6** which is same as `const weather = state.weather;`

      ```
      function mapStateToProps({ weather }){
            return { weather: weather }
      }
      ```

 but again with **ES6** the key: value names are same so we can write it as `return { weather }` only

      ```
      function mapStateToProps({ weather }){
            return { weather }
      }
      ```

- and then `connect` from react-redux, so that WeatherList container connects with the normal one

      ```
      export default connect(mapStateToProps)(WeatherList);
      ```

### Mapping props to a Render Helper
 - in the container we will have an redux state which contians a `weather` array which has several objects per city names so just `map` over the array so we get one city per array
      ```
      <tbody>
            {this.props.weather.map(this.renderWeather)} // mapping over weather array
      </tbody>
      ```
 - which is like one city and then a list of all the temprature, pressure, humidity details to render from the Redux state i.e., reducer
      ```
      returnWeather() {
            return(
                  <tr>
                        <td>{ cityData.city.name }</td>
                  </tr>
            )
      }
      ```
 - because in the response it is specified as city.name; it all renders well now
 - add the key in the list
      ```
      <tr key = { cityData.city.name }>
      ```
### Adding Sparkline charts
 - react-sparkline Charts to render, it only takes array of number so we will have Temprature, Humidity, Pressure arrays
      ```
      const temps = cityData.list.map(weather => weather.main.temp)
      ```
 - `npm i -S react-sparklines`
      ```
      import { SparkLines, SparkLinesLine } from 'react-sparklines';
      ```
 - and also to render 
      ```
      <td>
            <Sparklines height={120} width={120} data={temps}>
                  <SparklinesLine color="cyan"/>
            </Sparklines>
      </td>
      ```
### Making a Reusable Chart Component
 - since the chart <Sparkline> components doesn't need to take the variable data from so it would `/components/chart.js`
 - made it a functional component
      ```
      <Chart data={temps} color="orange" />
      ```

      and chart.js looks like this

      ```
      import { Sparklines, SparklinesLine } from 'react-sparklines';

      return(
            <Sparklines height={120} width={120} data={props.data}>
                  <SparklinesLine color={props.color} />
            </Spartklines>
      )
      ```

### Labeling Units on the chart component
 - for pressures and humidity the same thing
      ```
      const pressures = cityData.list.map(weather => weather.main.pressure);
      const humidity = cityData.list.map(weather => weather.main.humidity);

      <td><Chart data={pressures} color="green" /></td>
      <td><Chart data={humidities} color="black" /></td>
      ```

 - now going to add numbers and line for the average value of each
      for that bring in the  `{SparklinesReferenceLines}` and pass it as an additional child with a `type="avg"` for average
 - now for the numerical average
      ```
      <div>{ average(props.data) }</div>
      ```
 average would be an helper function here
 - to help us calculate the average we are gonna use the utility library `lodash` so install it since our setup is only with CRA
 - and with `lodash` the utility to calculate average is pretty straight forward
      ```
      function average(data){
            return _.round(_.sum(data)/data.length);
      }
      ```
 - also converted it into the Celcius directly from the `./containers/weather_list.js`

### Styling and Google Maps
 - addding `./style/style.css` which only works when its in the same folder as index.html
 - because we have added the GoogleMaps API in the `index.html` already it is going to be easier for us to calculate
 - adding google maps thing also, since its not going to use redux at all we will use it as component and not a container
      ```
      class GoogleMap extends Component {
            componentDidMount(){
                  new google.maps.Map(this.refs.map, {
                        zoom: 12,
                        center: {
                              lat: this.prop.lat,
                              lng: this.prop.lon,
                        }
                  })
            }
            render(){
                  return <div ref="map" />
            }
      }
      ```
### Google map integration
 - `componentDidMount` the lifecycle method will get called automatically after this component has been rendered to the sscreen
 - `new google.maps.Map` an embedded google map inside document, it just takes an HTML node so that's why we are using `ref`
 - so this is how 3rd party libraries/API knows where to render their content without knowing about default JSX or any other format
 - so the weathermaps API gives us `lat` and `lng` as lattitude and logitude
 - in WeatherList component add them and define 
      ```
      import GoogleMap from '../component/google_map';
      const { lon, lat } = cityData.city.coord;
      // const lat = cityData.city.coord.lat; not individually but together

      <td> <GoogleMap lon={lon} lat={lat} /> </td>
      ```
 - style the rendered little google map

### final working
 - to make the google maps work with CRA ( create react app), one needs to add
      ```
      import React, {Component} from 'react';
      const google = window.google; // very important when using CRA 
 
      class GoogleMap extends Component {
            componentDidMount() {
                  new google.maps.Map(this.refs.map, {
                  zoom: 12,
                  center: {
                  lat: this.props.lat,
                  lng: this.props.lon
                  }
            });
      }
 
      render() {
              return <div ref="map" />;
            }
      }
      export default GoogleMap;
      ```
 - also added the India as in for Indian cities by adding the following in `./src/actions/index.js`
      ```
      const url = `${ROOT_URL}&q=${city},in`;
      ```