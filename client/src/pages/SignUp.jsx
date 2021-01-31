import React, { Component } from "react";

export default class SignUp extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userName: "",
  };
  componentDidMount() {
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
  validateState = () => {
    var { firstName, lastName, email, password } = this.state;
    return (
      firstName.length > 0 &&
      lastName.length > 0 &&
      email.length > 0 &&
      password.length > 0
    );
  };
  handleSignUp = (e) => {
    e.preventDefault();
    if (!this.validateState()) {
      this.setState({ show: true });
      return;
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: this.state.firstName,
        password: this.state.password,
        lastName: this.state.lastName,
        email: this.state.email,
        userName: this.state.userName,
      }),
    };
    fetch("/api/register", options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //console.log(data);
        alert(data.message);
      })
      .catch((error) => {
        alert("Uh oh! Server is down! Try again later...");
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
          onSubmit={this.handleSignUp}
        >
          <div className="form-row ml-3 mr-3">
            <div className="col-md-4 mb-3">
              <label htmlFor="validationCustom01" className="h4">
                First Name
              </label>
              <input
                type="text"
                className="form-control"
                id="validationCustom01"
                placeholder="First name"
                name="firstName"
                value={this.state.firstName}
                onChange={this.changeHandler}
                required
              />
              <div className="valid-feedback">Looks good!</div>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="validationCustom02" className="h4">
                Last name
              </label>
              <input
                type="text"
                className="form-control"
                id="validationCustom02"
                placeholder="Last name"
                name="lastName"
                value={this.state.lastName}
                onChange={this.changeHandler}
                required
              />
              <div className="valid-feedback">Looks good!</div>
            </div>
            <div className="col-md-4 mb-3">
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
                <div className="invalid-feedback">
                  Please choose a username.
                </div>
              </div>
            </div>
          </div>
          <div className="form-row ml-3 mr-3">
            <div className="col mb-3">
              <label htmlFor="validationCustom03" className="h4">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="validationCustom03"
                placeholder="example@aol.com"
                name="email"
                value={this.state.email}
                onChange={this.changeHandler}
                required
              />
              <div className="invalid-feedback">
                Please provide a valid email.
              </div>
            </div>
            <div className="col mb-3">
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
          <div className="d-flex justify-content-center mt-3 mb-3">
            <button className="btn btn-primary" type="submit">
              Register
            </button>
          </div>
        </form>
      </div>
    );
  }
}
