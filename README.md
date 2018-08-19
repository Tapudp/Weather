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