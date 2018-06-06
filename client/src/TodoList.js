import React from "react";


class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      inputval: "",
      editval: ""
    };
    this.getAllData = this.getAllData.bind(this);
  }

  componentDidMount(){
    this.getAllData();
  }

  handleEdit(item,index){
    var arr = this.state.items;
    arr[index].iseditable = !arr[index].iseditable;
    this.setState({
      items: arr,
      editval: item.value
    });
  }

  editItem(item, index) {
      let arr= this.state.items;
      arr[index].iseditable = false;
      this.setState({
        items: arr
      });
    fetch("http://localhost:8080/changeEdit",
  {
    headers: {
           'Content-Type': 'application/json'
   },
    method: "PUT",
    body: JSON.stringify({ index: index, value: this.state.editval })
  })
  .then(res => res.json())
  .then(res => {console.log(res)})
  .catch((res) => { console.log(res) })
  arr[index].value = this.state.editval;
  this.setState({
    items: arr
  });
  }


  checkitem(index) {
    fetch("http://localhost:8080/changeCheck",
  {
    headers: {
           'Content-Type': 'application/json'
   },
    method: "PUT",
    body: JSON.stringify({index})
  })
  .then(res => res.json())
  .then(res => { console.log(res)})
  .catch((res) => { console.log(res) })
  let arr = this.state.items;
  arr[index].ischecked = !arr[index].ischecked;
  this.setState({
    items: arr
  });
  }


  deleteitem(index) {
   fetch("http://localhost:8080/deleteData", // my server url
 {
   headers: {
          'Content-Type': 'application/json'
  },
   method: "DELETE",
   body: JSON.stringify({index})
 })
 .then(res => res.json())
 .then(res => { console.log(res) })
 .catch((res) => { console.log(res) })
 var arr = this.state.items;
 arr.splice(index, 1);
 this.setState({
  items: arr
 });
  }

  additem(e) {
    if (this.state.inputval !== "") {
      var item = {
        "value": this.state.inputval,
        "ischecked": false,
        "iseditable": false
      };
      fetch("http://localhost:8080/setData",
    {
      headers: {
             'Content-Type': 'application/json'
     },
      method: "POST",
      body: JSON.stringify(item)
    })

    .then(res => res.json())
    .then(res => { console.log(res) })
    .catch((res) => { console.log(res) })
    let arr= this.state.items;
    arr.push(item);
    this.setState({
      items: arr
    });
    }
    this.setState({
      inputval: ""
    });
    console.log(this.state.items);
  }


getAllData(){
fetch("http://localhost:8080/getData",
{
  headers: {
         'Content-Type': 'application/json'
 },
  method: "GET"
})
.then(res => res.json())
.then(res => { this.setState({ items: res }) })
.catch((res) => { console.log(res) })
}


setInput(txt) {
      this.setState({
      inputval: txt
    });
  }

  render() {
    return (
      <div className="wrapper">
      <div className="main">
        <div className="input-container">
          <input
            placeholder="Enter text here"
            onChange={(e) => this.setInput(e.target.value)}
            value={this.state.inputval}
          />
          <button onClick={(e) => this.additem(e)}>Add</button>
        </div>
        <div className="list-container">
         {this.state.items.map((item, index) => {
            return (
              <li
                key={index}
                style={{
                  textDecoration: item.ischecked ? "line-through" : "none"
                }}
              >
              <input className="check"
                type="checkbox"
                checked={item.ischecked}
                onChange={(e) => this.checkitem(index)}
              />
                {item.iseditable
                  ? <span>
                      <input
                        onChange={(e) =>
                          this.setState({ editval: e.target.value })
                        }
                       value={this.state.editval}
                      />
                      <button onClick={(e) => this.editItem(item, index)}>
                        Submit
                      </button>
                    </span>
                  : <p>
                      {item.value}
                    </p>}


                <button onClick={(e) => this.deleteitem(index)}> Delete </button>
                <button onClick={(e) => this.handleEdit(item,index)}> Edit </button>

              </li>
            );
          })}
          </div>
        </div>
      </div>
    );
  }
}
export default TodoList;
