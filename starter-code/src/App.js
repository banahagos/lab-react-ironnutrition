import React, { Component } from 'react';
import './App.css';
import foods from './foods.json';
import FoodBox from './Components/FoodBox';
import Form from './Components/Form';
import Search from './Components/Search';
import TodaysFood from './Components/TodaysFood';


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      foods: foods,
      displayFoods: foods,
      todaysFood: [],
      formVisible: false
    }
  }

  handleFormVisibility = () => {
    this.setState({
      formVisible: !this.state.formVisible
    })
  }

  addNewFood = food => {
    this.state.displayFoods.unshift(food);
    this.setState({
      displayFoods: this.state.displayFoods,
    });
  }

  handleInputChange = e => {
    this.showSearchResult(e.target.value)
  }

  showSearchResult = searchTerm => {
    this.setState({ displayFoods: this.state.foods.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())) })
  }

  addTodaysFood = (foodItem, quantity) => {

    const copyToday = [...this.state.todaysFood]
    const food = {
      name: foodItem.name,
      calories: foodItem.calories,
      image: foodItem.image,
      quantity: quantity
    }
    const key = copyToday.map(e => e.name) // create an array with all food names from copyToday
    if (key.includes(food.name)) { // check if the current food is already in the list
      let index = key.indexOf(food.name)
      copyToday[index].quantity += parseInt(food.quantity)
    } else {
      copyToday.push(food)
    }

    this.setState({ todaysFood: copyToday })
  }

  deleteOne = (idx) => {
    this.state.todaysFood[idx].quantity > 0 ? this.state.todaysFood[idx].quantity -= 1 : this.state.todaysFood[idx].quantity === 0
    this.setState({ todaysFood: this.state.todaysFood })
  }


  render() {
    return (
      <div className="App">
        {this.state.formVisible && <Form addNewMethod={this.addNewFood} handleFormVisibility={this.handleFormVisibility} />}
        {!this.state.formVisible && <button onClick={this.handleFormVisibility} className="button is-primary">Add new food</button>}
        <Search handleInputChange={this.handleInputChange} />
        <div className="columns">
          <div className="column">
            {this.state.displayFoods.map((f, i) => {
              return <FoodBox addTodaysFoodMethod={this.addTodaysFood} name={f.name} calories={f.calories} image={f.image} quantity={f.quantity} key={'food_' + i} />
            })}
          </div>
          <div className="column">
            <h1>Today's food</h1>

            {
              this.state.todaysFood.map((f, idx) => {
                return <TodaysFood deleteOneMethod={() => this.deleteOne(idx)} name={f.name} calories={f.calories} quantity={f.quantity} key={idx} />
              })
            }
            <h1>Total Calories: {this.state.todaysFood.map(f => f.calories * f.quantity).reduce((acc, cv) => { return acc + cv }, 0)}</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
