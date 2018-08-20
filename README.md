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