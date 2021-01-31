import React, { Component } from "react";

export default class Login extends Component {
  state = {
    userName: "",
    password: "",
    isChecked: false,
  };
  onChangeCheckbox = (event) => {
    this.setState({
      isChecked: event.target.checked,
    });
  };
  componentDidMount() {
    //check if we remember this user
    if (localStorage.checkbox && localStorage.userName !== "") {
      this.setState({
        isChecked: true,
        userName: localStorage.username,
        password: localStorage.password,
      });
    }
    var forms = document.getElementsByClassName("needs-validation");
    // Loop over them and prevent submission
    Array.prototype.filter.call(forms, function (form) {
      form.addEventListener(
        "submit",
        function (event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add("was-validated");
        },
        false
      );
    });
  }
  handleLogin = (e) => {
    e.preventDefault();
    const { userName, password, isChecked } = this.state;
    var hours = 24; // Reset when storage is more than 24hours
    var now = new Date().getTime();
    var setupTime = localStorage.getItem("setupTime");
    if (setupTime == null) {
      localStorage.setItem("setupTime", now);
    } else {
      if (now - setupTime > hours * 60 * 60 * 1000) {
        localStorage.clear();
        localStorage.setItem("setupTime", now);
      }
    }
    if (isChecked && userName !== "" && password !== "") {
      localStorage.username = userName;
      localStorage.password = password;
      localStorage.checkbox = isChecked;
    } else if (!isChecked && userName !== "" && password !== "") {
      localStorage.clear();
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: this.state.userName,
        password: this.state.password,
      }),
    };
    fetch("/api/login", options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        alert(data.message);
        if (!data.error) {
          //if no error, login
          this.props.handleLogin();
        }
        //console.log(data);
      })
      .catch((error) => {
        alert("Uh oh! Server is down! Try again later...");
        console.log(error);
      });
  };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <form
          className="needs-validation bg-light rounded"
          noValidate
          onSubmit={this.handleLogin}
        >
          <div className="form-row">
            <div className="col pl-3 pr-3">
              <label htmlFor="validationCustomUsername" className="h4">
                Username
              </label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="inputGroupPrepend">
                    @
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  id="validationCustomUsername"
                  placeholder="Username"
                  aria-describedby="inputGroupPrepend"
                  name="userName"
                  value={this.state.userName}
                  onChange={this.changeHandler}
                  required
                />
                <div className="invalid-feedback">Please enter a username.</div>
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="col pl-3 pr-3">
              <label htmlFor="validationCustom04" className="h4">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="validationCustom04"
                name="password"
                value={this.state.password}
                onChange={this.changeHandler}
                required
              />
              <div className="invalid-feedback">
                Please provide a valid password.
              </div>
            </div>
          </div>
          <div className="form-check d-flex align-items-center ml-3">
            <input
              type="checkbox"
              value=""
              className="form-check-input"
              id="customCheck1"
              checked={this.state.isChecked}
              onChange={this.onChangeCheckbox}
            />
            <label className="form-check-label" htmlFor="customCheck1">
              Remember me
            </label>
          </div>
          <div className="d-flex justify-content-center mb-3 mt-3">
            <button className="btn btn-primary" type="submit">
              Log In
            </button>
          </div>
          <div className="d-flex justify-content-center">
            <p className="text-muted">
              Forgot <a href="/">password?</a>
            </p>
          </div>
        </form>
      </div>
    );
  }
}
